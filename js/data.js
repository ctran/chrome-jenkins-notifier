var STORAGE_KEY = 'jenkins_config';

var viewUrl = 'http://localhost:8080/view/Watch';
var checkInterval = 60;
var notifySuccess = false;
var lastResults = {};

function debug(msg) {
	console.debug(new Date() + ': ' + msg);
}

function getConfig() {
	var saved = localStorage[STORAGE_KEY] || '{}';
	return JSON.parse(saved);
}

function saveConfig(config) {
	localStorage[STORAGE_KEY] = JSON.stringify(config);
}
