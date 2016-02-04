var express = require('express');
var request = require('request');
var app     = express();
var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port, function() {
    console.log('running on http://localhost:' + port);
});

app.get('/simpsons', function(req, res){
  if (req.query.text) {
    request("https://www.frinkiac.com/api/search?q="+req.query.text, function(error, response, html){
      if(!error){
        var data = JSON.parse(response.body);
        if (data[0]) {
          res.statusCode = 200;
          res.json({
            "response_type": "in_channel",
            "attachments": [
                {
                  "fallback": "Episode: "+data[0].Episode+"@"+data[0].Timestamp,
                  "image_url": "https://www.frinkiac.com/img/"+data[0].Episode+"/"+data[0].Timestamp+"/medium.jpg"
                }
            ]
          });
        } else {
          res.statusCode = 204;
          console.log("else");
        }
      }
    });
  } else {
    res.render('pages/error', {body: "nope"});
  }
});
