var STORAGE_KEY = 'jenkins_config';

var viewUrl = 'https://localhost:8080/me/my-views';
var checkInterval = 60;  // in seconds
var dismissInterval = 10; // in seconds
var notifySuccess = false;
var lastResults = {};

function debug(msg) {
	console.debug(new Date() + ': ' + msg);
}

function getConfig() {
	var saved = localStorage[STORAGE_KEY];
	if (saved)
		return JSON.parse(saved);

	return {
		viewUrl: viewUrl,
		checkInterval: checkInterval,
		notifySuccess: notifySuccess
	}
}

function saveConfig(config) {
	localStorage[STORAGE_KEY] = JSON.stringify(config);
}
