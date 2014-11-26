var Twit = require('twit')

var T = new Twit({
    consumer_key:         'UBO5tm2NiPBqYASZ4Za7NDw17'
  , consumer_secret:      'kJhQ0z4d5Lubyzi6CCi4MjJQCYs1m4YVyCPSS4pU772FvUBdRW'
  , access_token:         '...'
  , access_token_secret:  '...'
})


function linkToTwitter(fn){
  var stream = T.stream('statuses/filter', { track: '#bbmad' })

  stream.on('tweet', function (tweet) {
    fn(tweet)
  });
}

module.exports = {
  linkToTwitter: linkToTwitter
}