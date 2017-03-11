'use strict'

// Essential requirements.
var express = require('express');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var bodyParser = require('body-parser');
// Here you sepcify which google sheet to use. The ID of the sheet is
// the long part of the URL to the sheet.
var doc = new GoogleSpreadsheet('1E-Z2AOufVk533XaEwyRGx0IVrXqrYuwGI0WtBN550h8');
var sheet;
var app = express();

// Code to load a google sheet. Needs a google service account.
async.series([
	function setAuth(step) {
		// json file from google, you get it from google developer console. 
		var creds = require('./dbus_secret.json'); 
		doc.useServiceAccountAuth(creds, step);
	},
	function getInfoAndWorksheets(step) {
		doc.getInfo(function(err, info) {
			sheet = info.worksheets[0];
			// Debug messages.
			console.log('Loaded doc: '+info.title+' by '+info.author.email);
			console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
			step();
		});
	}
]);

function processForm(req, res) {
	/* TODO Code for parsing form. Insert values of submitted fields
	 * into google sheet. */
		
	// Variables for all the elements in the form.
	// var bokning = req.body.bokning;
	// var name = req.body.name;
	// var mail = req.body.mail;
	// var fromDate = req.body.fromDate;
	// var fromTime = req.body.fromTime;
	// var fromCounter = req.body.fromCounter;
	// var toDate = req.body.toDate;
	// var toTime = req.body.toTime;
	// var toCounter = req.body.toCounter;
	// var message = req.body.message;
	// var faktura = req.body.faktura;
	// var innan = req.body.innan;
	// var efter = req.body.efter;

	console.log(req.body);

}

var jsonParser = bodyParser.json();

// Startpage
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/form.html');
});

// Action taken on form submission
app.post('/', jsonParser, function (req, res) {
	//processForm(req, res);
	//res.sendFile(__dirname + '/confirmation.html')
	console.log(req.body);
	res.json(req.body);
});

app.listen(3000);

console.log("server listening on 3000");
