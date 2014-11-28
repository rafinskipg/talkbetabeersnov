var Twit = require('twit')

var T = new Twit({
    consumer_key:         'UBO5tm2NiPBqYASZ4Za7NDw17'
  , consumer_secret:      'kJhQ0z4d5Lubyzi6CCi4MjJQCYs1m4YVyCPSS4pU772FvUBdRW'
  , access_token:         '119382990-d4L1sOcqQK5sCL93cu4RUmexzH0uqEeEyPzNUE5u'
  , access_token_secret:  'UcOU1qSq3ChF5tgyAKPmdeGInVNrQXPi1KestjsxznyPH'
})

var hashtag = 'bussiness';

function linkToTwitter(fn){
  var stream = T.stream('statuses/filter', { track: '#'+hashtag })

  stream.on('tweet', function (tweet) {
    fn({
      text: tweet.text,
      name: tweet.user.screen_name,
      image: tweet.user.profile_image_url
    })
  });
}


function debug(){
  var stream = T.stream('statuses/filter', { track: '#'+hashtag })

  stream.on('tweet', function (tweet) {
    console.log('------')
    console.log(tweet)
    console.log('------')
  });
}

module.exports = {
  linkToTwitter: linkToTwitter,
  debug: debug
}

if(require.main === module) { 
  console.log("called directly");
  debug();
} else { 
  console.log("required as a module"); 
}
