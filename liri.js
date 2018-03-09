var argument = process.argv;
var command = argument[2];
var commandParam = "";
for (var i = 3; i < argument.length; i++) {
    commandParam += process.argv[i] + " ";
}
var keys = require("./keys.js");
var request = require('request');
var fs = require("fs");
require("dotenv").config();
var Spotify = require('node-spotify-api');
var twitter = require('twitter');
switch (command) {
    case 'my-tweets':
        tweetFunction();
        break;
    case 'spotify-this-song':
        spotifyFunction(commandParam);
        break;
    case 'movie-this':
        ombdFunction(commandParam);
        break;
    case 'do-what-it-says':
        myCommand();
        break;
    default:
        if (command == null) {
            console.log("please provide command from below options!");
            trace("please provide command from below options!");
        }
        else {
            console.log("No  correct command! try again...");
            trace("No  correct command! try again...");
        }
        console.log(" 1-node liri.js my-tweets \n 2-node liri.js spotify-this-song <song name> \n 3-node liri.js movie-this <movie name> \n 4-node liri.js do-what-it-says")
        return false;
}

function spotifyFunction(commandParam) {
    var spotifyObj = new Spotify({
        id: process.env.SPOTIFY_ID, // keys.spotify.id,
        secret: process.env.SPOTIFY_SECRET // keys.spotify.secret
    });
    //'artist OR album OR track'
    if (commandParam === '' || commandParam == null) {
        commandParam = "Ace of Base The Sign";
    }
    spotifyObj.search({ type: 'track', query: "'" + commandParam + "'", limit: 1 }, function (error, data) {
        if (!error) {
            var artistsName = "";
            for (var i = 0; i < data.tracks.items[0].album.artists.length; i++) {
                artistsName += data.tracks.items[0].album.artists[i].name
            }
            console.log("Artist(s): " + artistsName);
            console.log("The song's name: " + data.tracks.items[0].name);
            console.log("A preview link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
            trace("Artist(s): " + artistsName);
            trace("The song's name: " + data.tracks.items[0].name);
            trace("A preview link: " + data.tracks.items[0].preview_url);
            trace("Album: " + data.tracks.items[0].album.name);
            trace("----------------------------------------------------------");
        }
    });

}
function tweetFunction() {
    var client = new twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY, // keys.twitter.consumer_key,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET, // keys.twitter.consumer_secret,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY, // keys.twitter.access_token_key,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET // keys.twitter.access_token_secret
    });
    client.get('statuses/user_timeline', function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length && i < 20; i++) {
                console.log((i + 1).toString() + ") " + tweets[i].text + "\n  created @: " + tweets[i].created_at);
                trace((i + 1).toString() + ") " + tweets[i].text + "\n  created @: " + tweets[i].created_at);
                trace("----------------------------------------------------------");
            }
        }
    });
}

function ombdFunction(commandParam) {
    if (commandParam == null || commandParam === '') {
        var querlyUrl = "https://www.omdbapi.com/?t=Mr.+Nobody.&y=&plot=short&apikey=trilogy";
    }
    else {
        var querlyUrl = "https://www.omdbapi.com/?t=" + commandParam + "&apikey=trilogy";
    }
    request(querlyUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("Rotten Tomatoes Rating: " + findRating(JSON.parse(body).Ratings));
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("If you haven't watched '" + JSON.parse(body).Title + "' then you should: http://www.imdb.com/title/" + JSON.parse(body).imdbID);

            trace("Title: " + JSON.parse(body).Title);
            trace("Year: " + JSON.parse(body).Year);
            trace("Rotten Tomatoes Rating: " + findRating(JSON.parse(body).Ratings));
            trace("IMDB Rating: " + JSON.parse(body).imdbRating);
            trace("Country: " + JSON.parse(body).Country);
            trace("Language: " + JSON.parse(body).Language);
            trace("Plot: " + JSON.parse(body).Plot);
            trace("Actors: " + JSON.parse(body).Actors);
            trace("If you haven't watched '" + JSON.parse(body).Title + "' then you should: http://www.imdb.com/title/" + JSON.parse(body).imdbID);

        }
        else {
            console.log("there is no record.");
        }
    });
}
function myCommand() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log("Something is wrong with random.txt file." + error);
            return console.log("Something is wrong with random.txt file." + error);
        }
        var tempArray = data.split(",");
        for (var i = 0; i < tempArray.length; i = i + 2) {
            switch (tempArray[i]) {
                case 'my-tweets':
                    tweetFunction();
                    break;
                case 'spotify-this-song':
                    spotifyFunction('');
                    break;
                case 'movie-this':
                    ombdFunction('');
                    break;
                case 'do-what-it-says':
                    myCommand();
                    break;
                default:
                    console.log("randome.txt file does not have correct 'I Want it That Way' command. ");
                    trace("randome.txt file does not have correct 'I Want it That Way' command. ");
                    break;
            }
        }
    });
}

function findRating(arr) {
    if (typeof (arr) === "undefined") {
        return "N/A";
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].Source === "Rotten Tomatoes") {
            return arr[i].Value;
        }
    }
}
function trace(message) {
    fs.appendFile("log.txt", message + "\n", function (err) {
        if (err) {
            console.log(err);
        }
    });
}










