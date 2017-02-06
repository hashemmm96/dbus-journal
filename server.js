'use strict'

var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var express = require('fs');
var readline = require('readline');
var google = require('googleapis');
var util = require('util');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var doc = new GoogleSpreadsheet('1E-Z2AOufVk533XaEwyRGx0IVrXqrYuwGI0WtBN550h8');
var sheet;

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
	}]);

var server = http.createServer(function (req, res) {
	if(req.method.toLowerCase() == 'get'){
		displayForm(res);
	} else if (req.method.toLowerCase() == 'post') {
		processForm(req, res);
	}
});

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
	var form = new formidable.IncomingForm();
	/* TODO Code for parsing form. Insert values of submitted fields
	 * into google sheet. */

	var row = { bokning: '',
				name: '',
				mail: '',
				fromDate: '',
				fromTime: '',
				fromCounter: '',
				toDate: '',
				toTime: '',
				toCounter: '',
				message: '',
				faktura: '' }
	// var row;
	// form.on('field', function(field, value) {
	// 	var key = field;
	// 	var val = value;
	// 	row.key = val;
	// });

	// console.log(row);
	// // Page viewed when parsing is successful.
	// form.on('end', function() {
		
  	// 	fs.readFile('confirmation.html', function (err, data) {
  	// 		res.writeHead(200, {
  	// 			'Content-Type': 'text/html',
  	// 			'Content-Length': data.length
  	// 		});
  	// 		res.write(data);
  	// 		res.end();
  	// 	});
	// }); 

	// sheet.addRow(row, function(err, res) {
	// 	if(err) throw err;
	// 	console.log("wrote values");
	// });
	
	// For debugging purposes-------------------------------------------------
	form.parse(req, function (err, fields, files) {
		
		console.log(row);
		sheet.addRow(row, function(err, res) {
			if(err) throw err;
			console.log("wrote");
		});

        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });
	//------------------------------------------------------------------------

}

server.listen(1185);
console.log("server listening on 1185");
