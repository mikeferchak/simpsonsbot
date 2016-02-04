var express = require('express');
var request = require('request');
var app     = express();

app.get('/simpsons', function(req, res){
  url = "https://www.frinkiac.com/api/search?q="+req.query.q;
  request(url, function(error, response, html){
    if(!error){
      var data = JSON.parse(response.body);
      if (data) {
        var body = "https://www.frinkiac.com/img/"+data[0].Episode+"/"+data[0].Timestamp+"/medium.jpg";
        var doc = buildHtml(body);
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Content-Length': doc.length,
          'Expires': new Date().toUTCString()
        });
        res.end(doc);
      }
    }
  });
});

function buildHtml(body) {
  return '<!DOCTYPE html><html><header></header><body><img src="' + body + '"/></body></html>';
}

app.listen('8081');
exports = module.exports = app;
