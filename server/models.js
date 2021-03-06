
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

if(!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing")
mongoose.connect(process.env.MONGODB_URI)

var User = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  docList: {
    type: Array,
    default: [],
  },
});


var User = mongoose.model('users', User)


var Document = new Schema({

  content: {
    type: Array,
    default: [],
  },

  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },

  collaboratorList: {
    type: Array,
    default: []
  },

  title: {
    type: String,
    default: 'Untitled',
  },

  password: {
    type: String,
  },

  createdTime: {
    type: Date,
  },

  lastEditTime: {
    type: [{
      type: Date,
    }],
  }
},
{
  minimize: false
}
);

var Document = mongoose.model('documents', Document)


module.exports = {
  User: User,
  Document: Document
};
