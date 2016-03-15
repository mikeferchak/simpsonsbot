var express = require('express'),
    rp      = require('request-promise'),
    base64url = require('base64url'),
    wrap    = require('word-wrap'),
    app     = express(),
    port    = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.listen(port, function() {
    console.log('running on http://localhost:' + port);
});

app.get('/', function(req, res){
  if (req.query.text) {
    var episode_data,
        subtitles_arr = [],
        subtitles_string = "";

    rp({uri: "https://www.frinkiac.com/api/search?q="+req.query.text, json: true})
      .then(function(data){
        episode_data = data[0];
      })
      .then(function(){
        rp(
          {uri: "https://www.frinkiac.com/api/caption?e="+episode_data.Episode+"&t="+episode_data.Timestamp,
           json: true}
         ).then(function(caption_data){
            var subtitles = caption_data.Subtitles;
            for (var i in subtitles) {
              if(subtitles[i].Content.length > 0) {
                subtitles_arr.push(subtitles[i].Content);
              }
            }
            subtitles_string = subtitles_arr.join("\n");
            subtitles_string = wrap(subtitles_string, 25);
            subtitles_string = new Buffer(subtitles_string).toString('base64');
            subtitles_string = encodeURI(subtitles_string);
          })
          .then(function(){
            res.json({
              "response_type": "in_channel",
              "attachments": [
                  {
                    "fallback": "Episode: "+episode_data.Episode+"@"+episode_data.Timestamp,
                    "image_url": "https://www.frinkiac.com/meme/"+episode_data.Episode+"/"+episode_data.Timestamp+".jpg?b64lines="+subtitles_string
                  }
              ]
            });
          });
      });
  } else {
    res.statusCode = 404;
    res.end();
  }
});
