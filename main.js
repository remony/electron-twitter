const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Stream = require('./util/userstream.js');
const Util = require('./util/util.js');
const twitterUtils = require('./util/twitter.js');
var dialog = require('electron').dialog;

var OauthTwitter = require('electron-oauth-twitter');
var userSteamStatus = false;
var streamCount = 0;
var hasLoaded = false;

var mainWindow;
var onlineStatus;
const consumer_key = '';
const consumer_secret = '';

var oauthTwitter = new OauthTwitter({
    key: consumer_key,
    secret: consumer_secret
});

var accessToken = {'accessToken': '', 'accessTokenSecret': ''};


var stream;
var twitterAPI = require('node-twitter-api');

var twitter = new twitterAPI({
    consumerKey: consumer_key,
    consumerSecret: consumer_secret,
    callback: ''
});

function createWindow() {
    var electronScreen = electron.screen;
    var displays = electronScreen.getAllDisplays();

    var externalDisplay = null;
    for (var i in displays) {
        if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
            externalDisplay = displays[i];
            break;
        }
    }

    if (externalDisplay) {
        // mainWindow = new BrowserWindow({width: 800, height: 600});
        mainWindow = new BrowserWindow({
            x: externalDisplay.bounds.x + 50,
            y: externalDisplay.bounds.y + 50
        });
    } else {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600
        });
    }


    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null
    });

    ipcMain.on('login', function(event, arg) {
        oauthTwitter.startRequest().then(function(result) {
            mainWindow.webContents.send('login-success', {
                'token': result.oauth_access_token,
                'secret': result.oauth_access_token_secret
            })
        }).catch(function(error) {
            console.error(error, error.stack);
        });
    });

    var reload = false;

    ipcMain.on('killuserstream', function(event) {

    });

    mainWindow.on('closed', function() {
        stream.destroy();
    });

    ipcMain.on('tweet', function(event, tweet) {
        console.log(tweet);
        // console.log(tweet);
        twitterUtils.tweet(tweet, accessToken, twitter)
    })


    ipcMain.on('auth', function(event, token, secret) {
        mainWindow.webContents.send('logger', {
            'token': token,
            'secret': secret
        });

        accessToken.accessToken = token;
        accessToken.accessTokenSecret = secret;
        console.log('Starting Stream')
        if (!userSteamStatus) {
            stream = new Stream({
                consumer_key: consumer_key,
                consumer_secret: consumer_secret,
                access_token: token,
                access_token_secret: secret
            });
            userSteamStatus = true;
            stream.streamUser();

            if (stream) {
                stream.on('data', function(json) {
                    // Send client json
                    mainWindow.webContents.send('user-stream', json)
                    saveMedia(JSON.parse(json).extended_entities.media)
                    
                    // var tweet = JSON.parse(json)
                    // mainWindow.webContents.send('logger', json);
                    if (tweet.user) {
                        mainWindow.webContents.send('logger', 'Tweet from ' + json.user.name);
                    }







                });

                stream.on('error', function(err) {
                    mainWindow.webContents.send('logger', err);
                })
            }
        }

    })
}

function saveMedia(media) {
    console.log('there is ' + media.length + 'images');
    for (var i = 0; i < media.length; i++) {
        console.log(media[i].type);
        if (media[i].type === 'photo') {
            Util.download(media[i].media_url, 'images');
        }
        if (media[i].type === 'animated_gif') {
            console.log(media[i].video_info.variants)
            Util.download(media[i].video_info.variants[0].url, 'video')
        }

    }

}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
});