var twitterAPI = require('node-twitter-api');

var tweet = function(tweet, params, api) {
    console.log('tweet')

    api.statuses("update", {
            status: tweet
        },
        params.accessToken,
        params.accessTokenSecret,
        function(error, data, response) {
            if (error) {
                // something went wrong 
            } else {
                // data contains the data sent by twitter 
            }
        }
    );
}

module.exports = {
    tweet: tweet
}