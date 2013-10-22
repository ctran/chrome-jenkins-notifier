function loadOptions() {
	var config = getConfig();

	if (config.viewUrl) 
		viewUrl = config.viewUrl;

	if (config.checkInterval)
		checkInterval = +config.checkInterval;	

	if (config.notifySuccess)
		notifySuccess = config.notifySuccess;
}

function showNotification(options) {
	var settings = $.extend({
		picture: getIcon('SUCCESS'),
		title: '',
		text: ''
	}, options);

	var notification = window.webkitNotifications.createNotification(
		settings.picture,
		settings.title,
		settings.message
		);

	notification.onclick = function () {
		if (settings.url) {
			window.open(settings.url);
		}
		notification.close();
	}

	notification.show();
}  

function getIcon(result) {
	var url = "images/green.png";
	if (result == "UNSTABLE") {
		url = "images/yellow.png";
	} else if (result == "FAILURE") {
		url = "images/red.png";
	} else if (result == "ABORTED") {
		url = "images/grey.png";
	} else if (result == 'In Progress') {
		url = "images/pending.gif";
	} else if (result == 'SUCCESS') {
		url = "images/green.png";
	}

	return url;
}

function getColor(result) {
	var color = [0, 0, 255, 200];
	if (result == "UNSTABLE") {
		color =  [255, 255, 0, 200];
	} else if (result == "FAILURE") {
		color = [255, 0, 0, 200];
	} else if (result == "ABORTED") {
		color = [200, 200, 200, 200];
	} else if (result == "SUCCESS") {
		color = [0, 255, 0, 200];
	}
	return color;
}


function checkJenkins() {
	$.getJSON(viewUrl + '/api/json', function(data) {
		// it's a job url
		if (data.buildable) {
			checkJobStatus(viewUrl);
			return;
		}

		// it's a view url
		$.each(data.jobs, function(i, job) {
			checkJobStatus(job.url);
		});		
	});
}

function checkJobStatus(jobUrl) {
	if (jobUrl.charAt(jobUrl.length - 1) === '/')
		jobUrl = jobUrl.substring(0, jobUrl.length - 1);

	var url = jobUrl + '/lastBuild/api/json';
	$.getJSON(url, function(data) {
		debug('Got a response from Jenkins ' + url);
		processBuildResult(data);	
	});
}

function processBuildResult(data) {
	var buildStatus = data.result || 'In Progress';
	var jobUrl = data.url;

	// previously checked
	if (lastResults[jobUrl] && lastResults[jobUrl].number == data.number)
		return;

	if (buildStatus == 'SUCCESS' && !notifySuccess)
		return;

	var actions = data.actions;
	var causes = [];

	for (var i = 0; i < actions.length; i++) {
		if (actions[i].causes) {
			causes = actions[i].causes;
			break;
		}
	}

	lastResults[jobUrl] = data;

	chrome.browserAction.setBadgeText({text: String(data.number)});
	chrome.browserAction.setBadgeBackgroundColor({color: getColor(buildStatus)});

	showNotification({
		picture: getIcon(buildStatus),
		title: data.fullDisplayName,
		message: causes[0].shortDescription + ' \n(' + buildStatus + ')',
		url: data.url
	});
}

jQuery(function() {
	loadOptions();
	checkJenkins();
	setInterval(checkJenkins, checkInterval * 1000);	
});
