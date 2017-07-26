'use strict'

var express = require('express');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var bodyParser = require('body-parser');
// Here you sepcify which google sheet to use. The ID of the sheet is
// the long part of the URL to the sheet.
var doc = new GoogleSpreadsheet('1Mxj_adOl2qfAJUEZ1kKFrLkQ_iNYF8a85ODG_JaQV14');
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

function calcDays(startDate, endDate, startTime, endTime) {
	var oneDay = 24*60*60*1000; // ms
	var start = new Date(startDate);
	var end = new Date(endDate);
	var days = Math.round(Math.abs((start.getTime() - end.getTime())/(oneDay)));
	startTime = startTime.split(":");
	endTime = endTime.split(":");
	start = new Date(0, 0, 0, startTime[0], startTime[1], 0);
	end = new Date(0, 0, 0, endTime[0], endTime[1], 0);
	var minutes = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
	if(minutes < 0) {
		days--;
	}
	return days;
}

function calcCost(req, days, distance) {
	// TODO: implement violation fees. 
	var kmCost1;
	var kmCost2;
	var extra;
	var dayCost;
	switch(req.body.bokningstyp) {
	case "Utomstående":
		kmCost1 = 10;
		kmCost2 = 5;
		dayCost = 150;
		extra = 50;
		break;
 	default:
		kmCost1 = 5;
		kmCost2 = 2.5;
		dayCost = 150;
		extra = 0;
		break;
	}
	if(distance < 100) {
		return days * dayCost + distance * kmCost1 + extra;
	}
	else {
		return days * dayCost + distance * kmCost1 +
			(distance - 100) * kmCost2 + extra;
	}
}

function processForm(req, res) {
	var distance = req.body.toCounter - req.body.fromCounter;
	var days = calcDays(req.body.fromDate, req.body.toDate,
						req.body.fromTime, req.body.toTime);
	var cost = calcCost(req, days, distance);

	// The values to be written to the sheet.
	var row = {
		Namn : req.body.name,
		Epost : req.body.mail,
		Fakturatext : req.body.fakturatext,
		Meddelande : req.body.message,
		Fixat_Datum : req.body.fromDate, 
		Antal_dygn : days,
		Kilometer : distance,
		Typ_av_bokning : req.body.bokningstyp,
		Checklista_innan_avfärd : req.body.innan,
		Checklista_efter_avfärd : req.body.efter,
		Kostnad : cost
	}

	// Add form values and additional fields to sheet.
	sheet.addRow(row, function(err){
		if(err) throw err;
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
	// Load the confirmation page.
	//res.sendFile(__dirname + '/confirmation.html')
	console.log(req.body);
	res.send(req.body);
});

app.listen(3000);

console.log("server listening on 3000");
