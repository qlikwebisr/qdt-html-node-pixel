'use strict';

const express = require('express');
const https = require('https');
const app = express();

/**
 * body-parser module is used to read HTTP POST data
 */ 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*  setting up cookies and session modules  */
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser('keyboard cat'));
app.use(session({ 
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
    cookie: { //maxAge: 600000
     }
}));

//static files - css,js
app.use(express.static('public'));

/**
 * templating view engine
 */ 
app.set('view engine', 'ejs');
app.set('view cache', false);

//logging
//https://www.npmjs.com/package/morgan
//https://github.com/expressjs/morgan
const morgan  = require('morgan');

const fs = require('fs');
const path = require('path');

//settings
const config = require('./config.json');



//index route
//view main file
app.get('/', async (req, res, next) => {

	res.render('index', {title: 'HTML QDT Components'});
  
});


//test route
app.get('/api', function(req, res, next){

	res.json({ message: "response from API endpoint" });
	
});

/* 
Get ticket from QPS API

Body:{
	"UserId":"qlik1"
}
*/
app.post('/ticket', async function(req, res, next) {

	let username = req.body.UserId;

	const data =  JSON.stringify({
		"UserId":username,
		"UserDirectory":config.UserDirectory
	});

	/*   Options */
const  options = {
	hostname: config.host,
	port: 4243, 
	path: '/qps/ticket/ticket?xrfkey=iiUNaaVTY3nQmTTZ',
	method: 'POST',
	headers: {
	  'X-Qlik-XrfKey':'iiUNaaVTY3nQmTTZ',
	  'Content-Type':'application/json',
	  'accept': '*/*'
	},
	//These two files in C:\ProgramData\Qlik\Sense\Repository\Exported Certificates\.Local Certificates
	key: fs.readFileSync('./certs/client_key.pem'),
	cert: fs.readFileSync('./certs/client.pem'),  
	passphrase: 'secret',
	requestCert: true,
	rejectUnauthorized: false
  
  };

  const request = https.request(options, function(response) {
	  
	let body = [];

		response.on('data', function(chunk) {

		body.push(chunk);

        }).on('end', () => {

        body = Buffer.concat(body).toString();

		let body_parsed;

		//empty body for GET
		if(typeof(body) === 'undefined' || body === '' || !body) {
		body_parsed = "";
		} else {
		body_parsed = JSON.parse(body);
		}
	
	    res.json(body_parsed);

	});

});

  request.on('error', (e) => {
	console.log(e.message);
	res.json({ "error": e.message});
  });

  request.write(data);

  request.end(); 

	
}); //app.post('/ticket', async function(req, res, next) {


console.log(config);

/* Apps route
Body parameter:
{
    "UserID":"qlik1",
}
sends to /qrs/app

{
	"UserID":"qlik1",
	"AppId":"32bdc28e-c6e3-45da-9cb5-18bef90f56b4"
}
sends to 
/qrs/app/object/full?filter=app.id eq 32bdc28e-c6e3-45da-9cb5-18bef90f56b4     /

*/
app.post('/apps', async function(req, res, next) {

	let username = req.body.UserID;

    let options = {
		hostname: config.host,
		port: 4242,
		//path: '/qrs/app/object/full?xrfkey=iiUNaaVTY3nQmTTZ',
		path: '/qrs/app?xrfkey=iiUNaaVTY3nQmTTZ',
		method: 'GET',
		headers: {
		'X-Qlik-XrfKey':'iiUNaaVTY3nQmTTZ',
		'X-Qlik-User':'UserDirectory=' + config.UserDirectory + ';UserID=' + username,
		'Content-Type':'application/json',
		'accept': '*/*'
		},
		//These two files in C:\ProgramData\Qlik\Sense\Repository\Exported Certificates\.Local Certificates
		key: fs.readFileSync('./certs/client_key.pem'),
		cert: fs.readFileSync('./certs/client.pem'),  
		passphrase: 'secret',
		requestCert: true,
		rejectUnauthorized: false
  };

  if(typeof(req.body.AppId) != 'undefined') {
	 options.path = `/qrs/app/object/full?filter=app.id%20eq%20${req.body.AppId}&xrfkey=iiUNaaVTY3nQmTTZ`;
	 //options.path = '/qrs/app/object/full?xrfkey=iiUNaaVTY3nQmTTZ';
  }

  //res.json(options);

  const request = https.request(options, function(response) {
	  
	let body = [];

		response.on('data', function(chunk) {

		body.push(chunk);

		//res.json(chunk);

        }).on('end', () => {

        body = Buffer.concat(body).toString();

		let body_parsed;

		//empty body for GET
		if(typeof(body) === 'undefined' || body === '' || !body) {
		body_parsed = "";
		} else {
		body_parsed = JSON.parse(body);
		}
	
	    res.json(body_parsed);

	});

});

  request.on('error', (e) => {
	console.log(e.message);
	res.json({ "error": e.message});
  });

  //request.write(data);

  request.end();

	
}); //app.post('/app', async function(req, res, next) { 

const port = process.env.PORT || 8090;

app.listen(port, function(){
	console.log('Server running at port' + port + ' : http://127.0.0.1:' + port);
});


