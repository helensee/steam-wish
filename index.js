var $ = require('jquery')(require("jsdom").jsdom().defaultView);
var http = require('http');
var express = require('express');
var squel = require("squel");
var mysql = require('mysql');
var app = express();

var request = require('request'),
		cheerio = require('cheerio');

//global variable that should hold user wishlist
var wishlistURL;
//var appidList = [];
GLOBAL._appidList = new Array();

app.set('port', (process.env.PORT || 5000));

var connection = mysql.createConnection({
	host	: 'steamgame.c7tcssw8uobt.us-east-1.rds.amazonaws.com',
	user	: 'SteamGame',
	password: 'steamgame',
	port 	: '3306'
});

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//root redirects to login page
app.get('/', function(request, response) {
  response.render('pages/login');
	//$("body").append("<div>TEST</div>");
	//console.log($("h2").html());

});

//routes to the main dashboard page
app.get('/index', function (request, response) {
	 response.render('pages/index');
});

//wildcard (if nothing matches)
app.get('*', function (req, res) {
	res.send('Bad Route: URL does not exist');

});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

/***************** CUSTOM METHODS BELOW ***********************/
/*creates a variable in the locals, so it can be accessed in all the views*/
//app.locals.appdata = appidList;
//var a = "daad"
//global._appidList.push(a);
/*GET RID OF HARD CODING ONCE USER INPUT IS FIGURED OUT*/

wishlistURL = 'http://steamcommunity.com/id/T1War/wishlist/';
/*gets the user wishlist url and parses the user's wishlist for the game's appID*/
var appid;
request(wishlistURL, function(err, resp, body){
	//console.log(appidList);

	if(!err && resp.statusCode == 200){
		var $ = cheerio.load(body);
		$('div.wishlistRow').each(function(){
			appid = $(this).attr('id');
			appid = appid.replace("game_", "");
			//global._appidList.push(appid);

			connection.connect();
			connection.query('INSERT INTO SteamGame.userWishlistTemp SET AppID=?', appid ,function(err, result){
				if(err) throw err;
				console.log('result:', result);
			});
			connection.end();
		}); /*end of each function*/
		//prints wishlist
		//console.log(global._appidList);


	}
});


//console.log(global._appidList);

/*
connection.query('INSERT INTO SteamGame.userWishlistTemp SET AppID=?', String(appidList[0]) ,function(err, result, fields){
	if(err) throw err;
	console.log('result:', result);
});
*/

/*
var query = connection.query('SELECT * FROM SteamGame.SteamStore', function(err, result, appidList){
	if(err) throw err;
	//console.log('result:', result);
});
*/

/*
var q = squel.insert();
squel.insert().into("SteamGame.userWishlistTemp").set("AppID", "test").toString();
var test = squel.select().from("SteamGame.userWishlistTemp");
console.log(test);
*/



