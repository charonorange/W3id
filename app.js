
// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

var session = require('express-session');
var passport = require('passport'); 
var cookieParser = require('cookie-parser');
var fs = require('fs');
var https = require('https');


// read settings.js
var settings = require('./settings.js');

// work around intermediate CA issue
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// create a new express server
var app = express();

// START OF CHANGE
app.use(cookieParser());
app.use(session({resave: 'true', saveUninitialized: 'true' , secret: 'keyboard cat'}));

// passport 
app.use(passport.initialize());
app.use(passport.session()); 

passport.serializeUser(function(user, done) {
	   done(null, user);
}); 

passport.deserializeUser(function(obj, done) {
	   done(null, obj);
});         


var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
                 authorizationURL : settings.authorization_url,
                 tokenURL : settings.token_url,
                 clientID : settings.client_id,
                 scope: 'openid',
                 response_type: 'NODE',
                 clientSecret : settings.client_secret,
                 callbackURL : settings.callback_url,
                 skipUserProfile: true,
                 issuer: settings.issuer_id
             }, 
         function(iss, sub, profile, accessToken, refreshToken, params, done)  {
	        process.nextTick(function() {
                profile.accessToken = accessToken;
		profile.refreshToken = refreshToken;
		done(null, profile);
	      	})
}); 
passport.use(Strategy); 

// http requests
app.get('/', function(req, res) {
	console.log(settings.callback_url);
	res.send('<h2>Welcome123</h2><br /><a href="/login">userinfo</a><br/><a href="/logout">logout</a>'+'<br /><a href="/">home</a><br /><a href="/hello145600">members of 145600 bluegroup only</a>'+'<br/><a href="/index.html">index</a>');
});


// handle login and authentication
app.get('/login', passport.authenticate('openidconnect', {
	})); 

function ensureAuthenticated(req, res, next) {
	// console.log(req.isAuthenticated())
	// console.log(req.originalUrl)
	if (!req.isAuthenticated()) {
		req.session.originalUrl = req.originalUrl;

		
		res.redirect('/login');
	} else {

		return next();
	}
}

// handle callback, if authentication succeeds redirect to
// original requested url, otherwise go to /failure

app.get('/test/auth',function(req, res, next) {
	var redirect_url = req.session.originalUrl;
	// console.log("redirect url:" + redirect_url );
	passport.authenticate('openidconnect', {
		successRedirect: redirect_url,
		failureRedirect: '/failure',
	})(req,res,next);
});

// failure page
app.get('/failure', function(req, res) {
	res.send('login failed'); });

// protected pages
app.get('/hello', ensureAuthenticated, function(req, res) {
	var claims = req.user['_json'];
	// console.log(claims);
        var html ="<p>Hello " + claims.firstName + " " + claims.lastName + ": </p>";

        html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
        html += "<hr> <a href=\"/\">home</a>";
	//res.send('Hello '+ claims.given_name + ' ' + claims.family_name + ', your email is ' + claims.email + '<br /> <a href=\'/\'>home</a>');

        res.send(html);
        });

// protected pages
app.get('/hello145600', ensureAuthenticated, function(req, res) {

	var claims = req.user['_json'];
	var html='';
	var grp145600_found=false;
	for(i=0;i<claims.blueGroups.length;i++)
		if(claims.blueGroups[i]=='145600')
			grp145600_found=true;

	if(grp145600_found) {
		//console.log(claims);
        	html ="<p>Hello " + claims.firstName + " " + claims.lastName + ": </p>";
		html +="<p>Congratulation, you are a member of 145600 bluegroup!!!</p>";
//	        html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
	        html += "<hr> <a href=\"/\">home</a>";
	} else {
		html='Hello '+ claims.firstName + ' ' + claims.lastName + ', your email is ' + claims.emailAddress + "<br /> but you are not a member of 145600 bluegroup. Go to: <a href=\"/\">home</a>";
	}
        res.send(html);
});


// logout page
app.get('/logout', function(req,res) {
       req.session.destroy();
       req.logout();
    fs.readFile("public/slo.html", function(err,data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();

     });
});

//index.html
app.get('/index.html',function(req,res){//ensureAuthenticated,
	console.log(req);
	fs.readFile("public/index.html", function(err,data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
        });
});


// serve the files out of ./html as our main files
app.use(express.static(__dirname + '/public'));

// CHANGE ME Uncomment the following section if running locally
https.createServer({
     key: fs.readFileSync('key.pem'),
     cert: fs.readFileSync('cert.pem')
},
 app).listen(9090);


