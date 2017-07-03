'use strict';
var pa11y = require('pa11y');
var fs = require("fs");
var test = pa11y({
	allowedStandards: ['WCAG2A'],
	standard: 'WCAG2A',
	log: {
		debug: console.log.bind(console),
		error: console.error.bind(console),
		info: console.log.bind(console)
	},
    ignore: [
        'notice',
        'warning'
    ],
	actions: [
		'set field #user to console',
		'set field #password to PeteWin5',
		'click element #submit',
		'wait for path to be /v2/overview/overview'
	],
	wait: 5000
});

	// "urls": [
	// 	"http://phgma.dev/v2/overview/overview",
	// 	"http://phgma.dev/v2/admin/campaign",
	// 	"http://phgma.dev/v2/admin/publishers"
	// ]

var url = 'http://phgma.dev/v2/overview/overview';
test.run('http://phgma.dev/v2/overview/overview', function(error, results){
	var htmlReporter = require('pa11y/reporter/html');
	var html = htmlReporter.process(results, url);
	if (error) {
		return console.error(error.message);
	}

	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();

	fs.writeFile('reports/' + day + '-' + month + '-' + year + '-' + 'report.html', html, function(err) {
		if (err) throw err;
		console.log('Saved!');
	});
});
