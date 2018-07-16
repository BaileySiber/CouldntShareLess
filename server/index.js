import http from 'http';

http.createServer((req, res) => {
<<<<<<< HEAD
  res.writeHead(200, { 'Content-Type': 'text/plain' });
=======
  res.writeHead(200, {'Content-Type': 'text/plain'});
>>>>>>> d9e3148823b7689f6b9da0b3c555355ec5b86419
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
