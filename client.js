<script src="/socket.io,socket.io.js"></script>
<script>
  var socket = ('http://localhost');
  socket.on('news', function(data) {
    console.log(data);
    socket.emit('otherevent', {my:"data"});
  });
</script>
