var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

if(!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing")
mongoose.connect(process.env.MONGODB_URI)

var User = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  docList: {
    type: Array,
    default: []
  }
});

varr Document = new Schema({

content: {
  type: Array,
  default: []
},

owner: {
  type: ObjectId,
  required: true,
  ref: "users"
},

collaboratorList: {
  type: [{
    type: ObjectId,
    ref: "users"
  }]
  default: [],
},
title: {
  type: String,
  default: "Untitled"
},

password: {
  type: String
},
createdTime: {
  type: Date
},
lastEditTime: {
  type: Date
}
},
{
  minimize: false
}

module.exports = mongoose.model('documents', Document);


})
