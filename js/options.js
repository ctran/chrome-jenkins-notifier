function save() {
	saveConfig({
		viewUrl: document.getElementById('viewUrl').value,
		checkInterval: document.getElementById('checkInterval').value,
		notifySuccess: document.getElementById('notifySuccess').checked
	});

	window.close();
	chrome.extension.getBackgroundPage().window.location.reload();
}

function load() {
	var config = getConfig();
	debug('Loading config: ' + config);
	document.getElementById('viewUrl').value = config.viewUrl;
	document.getElementById('checkInterval').value = config.checkInterval;
	document.getElementById('notifySuccess').checked = config.notifySuccess;
}

document.addEventListener('DOMContentLoaded', load);
document.querySelector('#save').addEventListener('click', save);
document.querySelector('#cancel').addEventListener('click', function() {
	window.close();
});