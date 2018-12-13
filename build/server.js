var express = require('express');
var cors = require('cors'); 
var app = express();

app.use(cors()); 

app.use(express.static('./'));





var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});