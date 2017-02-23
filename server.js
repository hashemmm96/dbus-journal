'use strict'

var fs = require('fs');
var express = require('fs');
var readline = require('readline');
//var google = require('googleapis');
var util = require('util');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var doc = new GoogleSpreadsheet('1E-Z2AOufVk533XaEwyRGx0IVrXqrYuwGI0WtBN550h8');
var sheet;
var app = express();

async.series([
	function setAuth(step) {
		var creds = require('./dbus_secret.json');
		doc.useServiceAccountAuth(creds, step);
	},
	function getInfoAndWorksheets(step) {
		doc.getInfo(function(err, info) {
			console.log('Loaded doc: '+info.title+' by '+info.author.email);
			sheet = info.worksheets[0];
			console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
			step();
		});
	}
]);

function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processForm(req, res) {
	/* TODO Code for parsing form. Insert values of submitted fields
	 * into google sheet. */
				 
	var bokning = req.body.bokning;
	var name = req.body.name;
	var mail = req.body.mail;
	var fromDate = req.body.fromDate;
	var fromTime = req.body.fromTime;
	var fromCounter = req.body.fromCounter;
	var toDate = req.body.toDate;
	var toTime = req.body.toTime;
	var toCounter = req.body.toCounter;
	var message = req.body.message;
	var faktura = req.body.faktura;
	var innan = {req.body.trash1, req.body.halvtank1, req.body.spill1, req.body.tryck1}
	var efter = {req.body.trash2, req.body.halvtank2, req.body.spill2, req.body.tryck2}
	
	console.log(req.body);

// 	console.log(bokning + ", " + name + ", " + mail + ", " +  fromDate + ", " + fromTime
// 			    + ", " + fromCounter + ", " + toDate + ", " + toTime + ", " + toCounter
// 			    + ", " + message + ", " + faktura + ", " + innan + ", " + efter);

	// var row;
	// form.on('field', function(field, value) {
	// 	var key = field;
	// 	var val = value;
	// 	row.key = val;
	// });

	// console.log(row);
	// // Page viewed when parsing is successful.
	// form.on('end', function() {
		
  	fs.readFile('confirmation.html', function (err, data) {
  			res.writeHead(200, {
  				'Content-Type': 'text/html',
  				'Content-Length': data.length
  			});
  			res.write(data);
  			res.end();
  		});
	}); 

	// sheet.addRow(row, function(err, res) {
	// 	if(err) throw err;
	// 	console.log("wrote values");
	// });
	
	// For debugging purposes-------------------------------------------------
	// form.parse(req, function (err, fields, files) {
	// 	console.log(row);
	// 	sheet.addRow(row, function(err, res) {
	// 		if(err) throw err;
	// 		console.log("wrote");
	// 	});

    //     //Store the data from the fields in your data store.
    //     //The data store could be a file or database or any other store based
    //     //on your application.
    //     res.writeHead(200, {
    //         'content-type': 'text/plain'
    //     });
    //     res.write('received the data:\n\n');
    //     res.end(util.inspect({
    //         fields: fields,
    //         files: files
    //     }));
    // });
	//------------------------------------------------------------------------
}

app.listen(3000);

console.log("server listening on 3000");
