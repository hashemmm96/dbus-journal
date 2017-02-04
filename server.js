'use strict'
var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var express = require('fs');
var util = require('util');
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
	// form.on('field', )

	// Page viewed when parsing is successful.
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
	
	form.parse(req, function (err, fields, files) {
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
}

server.listen(1185);
console.log("server listening on 1185");
