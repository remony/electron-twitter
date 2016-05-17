var oauth = require('oauth'),
    events = require('events'),
    util = require('util');

var consts = {
    'filter_stream': 'https://stream.twitter.com/1.1/statuses/filter.json',
    'user_stream': 'https://userstream.twitter.com/1.1/user.json',
    'request_token': 'https://api.twitter.com/oauth/request_token',
    'access_token': 'https://api.twitter.com/oauth/access_token'
};

function Stream(params) {
    if (!(this instanceof Stream)) {
        return new Stream(params);
    }

    events.EventEmitter.call(this);

    this.params = params;

    this.oauth = new oauth.OAuth(
        consts.request_token,
        consts.access_token,
        this.params.consumer_key,
        this.params.consumer_secret,
        '1.0',
        null,
        'HMAC-SHA1',
        null,
        {
            'Accept': '*/*',
            'Connection': 'close',
            'User-Agent': 'twitter-stream.js'
        }
    );
}
util.inherits(Stream, events.EventEmitter);

Stream.prototype.streamUser = function (params) {
    var stream = this;

    if (typeof params != 'object') {
        params = {};
    }

    var request = this.oauth.post(
        consts.user_stream,
        this.params.access_token,
        this.params.access_token_secret,
        params,
        null
    );

    function abort() {
        request.abort();
    }

//    Kill socket
    this.destroy = function () {
        abort();
    };

    request.on('response', function (res) {
        var data = '', index = 0, json;
        if (res.statusCode > 200) {
            stream.emit('error', {'type': 'response', data: res});
        } else {
            stream.emit('connected');
            data = '';
            index = 0;
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                data += chunk.toString('utf8');
                //is heartbeat?
                var heartbeat = data == '\r\n';

                if (heartbeat) {
                    stream.emit('heartbeat');
                    return;
                }

                while ((index = data.indexOf('\r\n')) > -1) {

                    json = data.slice(0, index);
                    data = data.slice(index + 2);

                    if (json.length > 0) {
                        try {
                            // stream.emit('data', JSON.parse(json))
                            stream.emit('data', json)
                        } catch (e) {
                            stream.emit('error', e)
                        }

                    }

                }


            });

            res.on('error', function (error) {
                stream.emit('close', error);
            });

            res.on('end', function () {
                stream.emit('close', 'socket end');
            });

            res.on('close', function () {
                abort();
            })


        }
    });

    request.on('error', function (error) {
        stream.emit('error', {'type': 'request', data: error})
    });

    request.end();
};




module.exports = Stream;

