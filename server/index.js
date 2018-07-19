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

// passport.use(new LocalStrategy(function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//
//       if (err) {
//         console.log(err);
//         return done(err);
//       }
//       // if no user present, auth failed
//       if (!user) {
//         console.log(user);
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       // if passwords do not match, auth failed
//       if (user.password !== password) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       // auth has has succeeded
//       return done(null, user);
//     });
//   }
// ));

// app.post('/login',
//   passport.authenticate('local', { failWithError: true }),
//   function(req, res, next) {
//     // handle success
//     if (req.xhr) { return res.json({ id: req.user.id }); }
//     return res.json({"error": "error"});
//   },
//   function(err, req, res, next) {
//     // handle error
//     if (req.xhr) { return res.json(err); }
//     return res.json({"error": "error"});
//   }
// );



app.post('/login', (req, res)=> {
  User.findOne({username: req.body.username})
  .then(result=> {
    if (result.password === req.body.password){
      res.json({"userId":result._id});
    }else{
      res.json({"status": "abcincorrect credentials"});
    }
  }).catch(err=> {
    res.json({"status": "incorrect credentials"});
  })
});

/*
  EXPECTS
  {
  username:
  password:
  passwordRepeat:
}
*/



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

app.get('/', function(req, res){
  res.send('test');
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
  /* expects
   {
    userId:
    title:
    password:
  }*/
  let newDoc = new Document({
    owner: req.body.userId,
    title: req.body.title,
    password: req.body.password,
    createdTime: new Date(),
  });
  newDoc.save(function(err, doc) {
    if (err){
      res.json({"error": err});
    }else{
      Document.findOne({
        owner: req.body.userId,
        title: req.body.title
      }).then(result=> {
        res.json({"docId": result._id});
      })
    }
  })
})


app.post('/save', function(req, res){
  //docId, content, title
  console.log("saved document")
  Document.findById(req.body.docId)
  .then(result=> {
    Document.findByIdAndUpdate(req.body.docId, {
      content: result.content.concat(req.body.content),
      title: req.body.title
    }).then(newResult => {
      res.json({"status":"200"});
    })
  }).catch(err=> {
    res.json({"error":err});
  });
})

//takes docId
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

//add contributors
app.post("/addCollaborator", function(req, res) {
  Document.findById(req.body.docId)
  .then(result => {
    result.collaboratorList.push(req.body.userId);
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

app.get('/getAllDocs', function(req, res){
  let userId = req.query.userId;
  let userDocs = [];
  let collabDocs = [];

  Document.find({})
  .then(results => {
    results.forEach(eachDoc => {
      if (eachDoc.collaboratorList.includes(userId)){
        collabDocs.push({
          title: eachDoc.title,
          docId: eachDoc._id
        });
      }else if (eachDoc.owner === userId){
        userDocs.push({
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

//socket connect --> listening and emitting
io.on("connection", (socket) => {
  // socket.on("enterDoc", id => {
  //   Document.findById(id)
  //   .then(result => {
  //     socket.emit("foundDoc", result)
  //   })
  //   .catch(err => {
  //     res.json({"error": err})
  //   })
  // })
  socket.on("join", (id) => {
    console.log("SERVER --> 1.listening join")
    socket.join(id)
    io.in(id).clients((err, clientArr) => {
      if(clientArr.length === 1){
        console.log("SERVER --> 2.emitting fetch")
        socket.emit("fetch")
      }else if (clientArr.length > 1){
        console.log("SERVER --> emitting realtime")
        socket.emit("realtime", rooms[id])
      }

    })
  });

  socket.on('setRoom', data => {
    console.log("SERVER --> listening setRoom")
    rooms[data.docId] = data.roomContent
  })

  socket.on("realtimeContent", data => {
    //find the room, then set the global variable
    rooms[data.id] = data.content
    socket.to(data.id).emit("contentRender", rooms[data.id])
  });



  //mainpage listening
  // socket.on("addCollaborator", data => {
  //   console.log("listening: " + data)
  //   Document.findById(data.docId, function(foundDoc, err){
  //     if(err){
  //       console.log(err)
  //     }
  //     foundDoc.collaboratorList.push(data.userId)
  //   })
  // })
})

server.listen(port);

console.log('Server running at http://127.0.0.1:1337/');
