var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');
var draftJs = require('draft-js');
var EditorState = draftJs.EditorState;
var convertToRaw = draftJs.convertToRaw;
var socketIO = require('socket.io')

let app = express();

// app.use(cors());
// const server = http.Server(app)
const server = require('http').Server(app);
const io = socketIO(server)
// const io = require('socket.io')(server);

// var auth = require('./auth');
const models = require('./models');
const User = models.User;
const Document= models.Document;
const port = 1337;

var rooms = {};

mongoose.connect(process.env.MONGODB_URI);

var validateReq = function(userData) {
  return (userData.password === userData.passwordRepeat);
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res)=> {
  User.findOne({username: req.body.username})
  .then(result=> {
    if (result.password === req.body.password){
      res.json({"userId":result._id, "username": result.username});
    }else{
      res.json({"status": "abcincorrect credentials"});
    }
  }).catch(err=> {
    res.json({"status": "incorrect credentials"});
  })
});


//expects username, password, passwordRepeat
app.post('/register', (req, res)=> {
  if (!validateReq(req)) {
    res.json({ error: 'invalid registration'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    newUser.save(function(error){
      if (error){
        res.json({"error": error})
      }else{
        res.json({"status": 200});
      }
    })
  }
})

/** OTHER ROUTES **/

app.post('/editDoc', (req, res)=>{
  Document.findById(req.body.docId)
  .then(result => {
    if (result.password === req.body.password){
      res.json({"status":"200"});
    }else{
      res.json({"error":"incorrect password"});
    }
  }).catch(err => {
    res.json({"error": err});
  })
  /* expects
   {
    docId:
    password:
  }*/
})

app.post('/create', (req, res)=> {
  /* expects userId, title, password
  */
  let newDoc = new Document({
    owner: req.body.userId,
    title: req.body.title,
    password: req.body.password,
    createdTime: new Date(),
    collaboratorList: [req.body.userId],
    lastEditTime: []
  });
  newDoc.save(function(err, doc) {
    if (err){
      res.json({"error": err});
    }else{
      User.findById(req.body.userId)
      .then(user=> {
        user.docList.push(doc._id);
        user.save()
        .then(()=> {
          Document.findOne({
            owner: req.body.userId,
            title: req.body.title
          }).then(result=> {
            res.json({"docId": result._id})
          }).catch(err=> {
            res.json({"error": err});
          })
        })
      })
    }
  })
})


app.post('/save', function(req, res){
  //docId, content, title

  Document.findById(req.body.docId)
  .then(result=> {
    let lastEditTimeArray = result.lastEditTime;
    let oldTitle = result.title;
    lastEditTimeArray.push(new Date());
    Document.findByIdAndUpdate(req.body.docId, {
      content: result.content.concat(req.body.content),
      title: req.body.title? req.body.title : result.title,
      lastEditTime: lastEditTimeArray
    }).then(newResult => {
      console.log(newResult);
      res.json({"status":"200"});
    })
  }).catch(err=> {
    res.json({"error":err});
  });
})

//expects docId in query params
app.get('/getDocInfo', function(req, res){
  let docId = req.query.docId;

  Document.findById(docId)
  .populate('owner', `username`)
  .then(result=> {
    res.json({"document": result});
  }).catch(err=> {
    res.json({"error": err});
  })
})

//add contributors,
// expects userId, docId,
app.post("/addCollaborator", function(req, res) {
  let username = '';
  User.findById(req.body.userId)
  .then(user => {
    username = user.username;
  }).then(()=> {
    Document.findById(req.body.docId)
    .then(result => {
      result.collaboratorList.push(username);
      result.save(err=>{
        if (err){
          res.json({"error":err})
        }else{
          res.json({"status": 200})
        }
      })
    }).catch(err=>{
      res.json({"error": err})
    })
  })
})


//expects userId as query params
app.get('/getAllDocs', function(req, res){
  let userId = req.query.userId;
  let userDocs = [];
  let collabDocs = [];

  Document.find({})
  .then(results => {
    results.forEach(eachDoc => {
      if (eachDoc.owner.toString() === userId){
        userDocs.push({
          title: eachDoc.title,
          docId: eachDoc._id
        });
      }
      else if (eachDoc.collaboratorList.includes(userId)){
        collabDocs.push({
          title: eachDoc.title,
          docId: eachDoc._id
        });
      }
    })
    res.json({
      userDocs: userDocs,
      collabDocs: collabDocs
    })
  }).catch(err=> {
    res.json({"error": err});
  })
});


app.get('/getHistory', function(req, res){
  let docId = req.query.docId;
  Document.findById(docId)
  .then(doc => {
    res.json({
      content: doc.content,
      lastEditTime: doc.lastEditTime
    });
  }).catch(err=> res.json({"error": err}));
})

//socket connect --> listening and emitting
io.on("connection", (socket) => {

  //every person on the doc
  socket.on("join", (id) => {

    socket.join(id)
    io.in(id).clients((err, clientArr) => {
      //only person in the room
      if(clientArr.length === 1){
        socket.emit("fetch")

        //else multiple people
      }else if (clientArr.length > 1){
        socket.emit("contentRender", rooms[id])

      }

    })
  });

  //sets the initial content of the room
  socket.on('setRoom', data => {
    rooms[data.docId] = data.roomContent;
  })

  socket.on("realtimeContent", data => {
    //find the room, then set the global variable
    rooms[data.id] = data.content
    socket.to(data.id).emit("contentRender", rooms[data.id])
  });

  socket.on("closeDoc", id => {
    socket.leave(id);
  })

})

server.listen(port);

console.log('Server running at http://127.0.0.1:1337/');
