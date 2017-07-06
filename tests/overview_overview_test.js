'use strict';
var pa11y = require('pa11y');
var fs = require("fs");

//*********************************
//UPDATE THIS FOR PAGE BEING TESTED
//*********************************
var url = 'http://phgma.dev/v2/overview/overview';
var name = 'overview_overview';

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
	beforeScript: function(page, options, next){
		function waitUntil(condition, retries, waitOver){
			page.evaluate(condition, function(error, result){
				if(result || retries < 1){
					waitOver();
				}
				else {
					retries -= 1;
					setTimeout(function(){
						waitUntil(condition, retries, waitOver);
					}, 200);
				}
			});
		}

		page.evaluate(function() {
			var user = document.querySelector('#user');
			var password = document.querySelector('#password');
			var submit = document.querySelector('#submit');

			user.value = 'console';
			password.value = 'PeteWin5';

			submit.click();
		}, function() {
			waitUntil(function() {
				return window.location.href === url;
			}, 20, next);
		});
	},
	wait: 3000
});

function construct_report_name(name){
	//Setup timestamp for report
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	return '../reports/' + day + '-' + month + '-' + year + '_' + name + '.html';
}

//Run test
test.run(url, function(error, results){
	//Create HTML reporter
	var htmlReporter = require('pa11y/reporter/html');
	var html = htmlReporter.process(results, url);
	if (error) {
		return console.error(error.message);
	}

	//Save report
	fs.writeFile(construct_report_name(name), html, function(err) {
		if (err) throw err;
		console.log('Saved!');
	});
});
