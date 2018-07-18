import React from "react";
var app = require("http").createServer(handler)
var io = require("socket.io")(app);
var fs = require("fs");

io.on("connection", function(socket) {
  socket.emit('news', {hello: "world"});
  socket.on('otherevent', function(data){
    console.log(data)
  })
})
