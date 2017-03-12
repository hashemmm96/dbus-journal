'use strict'

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

	// The values to be written to the sheet.
	var row = {
		reqbody : req.body,
		lol : "hel"
	}

	// Add form values and additional fields to sheet.
	sheet.addRow(row, function(err){
		if (err) throw err;
		console.log("Data added successfully.");
	});
}

var urlParser = bodyParser.urlencoded({
	extended : true
});

// Startpage
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/form.html');
});

// Action taken on form submission
app.post('/', urlParser, function (req, res) {
	processForm(req, res);
	//res.sendFile(__dirname + '/confirmation.html')
	console.log(req.body);
	res.send(req.body);
});

app.listen(3000);

console.log("server listening on 3000");
