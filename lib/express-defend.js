var chalk = require('chalk');

module.exports = {

	// Config settings
	dropSuspiciousRequest: false,    // Drop suspicious request if maxAttempts reached
	logFile: null,                   // If specified, we store logs in this file
	onMaxAttemptsReached: null,      // A callback(ipAddress) that is triggered once an attacker from an IP has reached the maximum number of attempts
	maxAttempts: 1,                  // Number of maximum attempts from attacker until we put him/her on blacklist: 1 means that we block the IP immediately

	// Private members
	fs: null,                        // Log file handle
	endOfLine: require('os').EOL,    // Platform specific EOL, used when logging
	blacklistCandidates: [],         // Candidates to be put on blacklist: IP => AttemptCount association - once we reach maxAttempts for an IP, we block it
	suspiciousUrlFragments: [ '../', '/etc/hosts', '/etc/passwd', '/etc/shadow', '<script', 'alert(', 'console.log' ],

	protect: function(settings) {

		this.applySettings(settings);

		var self = this;

		var interceptor = function(request, response, next) {

			var url = request.originalUrl;

			if (url == undefined || url == null) {
				next();
				return;
			}

			for (var i=0; i!=self.suspiciousUrlFragments.length; i++) {
				if (url.indexOf(self.suspiciousUrlFragments[i]) > 0 
					|| decodeURI(url).indexOf(self.suspiciousUrlFragments[i]) > 0 ) {

					self.handleSuspiciousRequest(request, response, next, self.suspiciousUrlFragments[i]);

					return;
				}
			}

			next();
		}

		return interceptor;
	},

	applySettings: function(settings) {

		if (settings.dropSuspiciousRequest != undefined) {
			this.dropSuspiciousRequest = settings.dropSuspiciousRequest;
		}

		if (settings.onMaxAttemptsReached != undefined) {
			this.onMaxAttemptsReached = settings.onMaxAttemptsReached;
		}

		if (settings.maxAttempts != undefined) {
			this.maxAttempts = settings.maxAttempts;
		}

		if (settings.logFile != undefined) {
			this.logFile = settings.logFile;

			this.fs = require('fs');
		}
	},

	handleSuspiciousRequest: function(request, response, next, blacklistItem) {

		var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
		var message = 'Suspicious Request ' + request.originalUrl + ', fragment is on blacklist: "' + blacklistItem + '"" from ' + this.getHumanReadableAddress(request);

		var thresholdReached = this.hasIpReachedThreshold(request.connection.remoteAddress);

		if (thresholdReached && this.onMaxAttemptsReached != null) {
			message += ', reached threshold (' + this.maxAttempts + ')';
			this.logEvent('warn', message);
			this.onMaxAttemptsReached(request.connection.remoteAddress);
		}

		if (!thresholdReached) {
			this.logEvent('warn', message);
		}

		if (thresholdReached && this.dropSuspiciousRequest) {
			this.logEvent('warn', 'Dropping request ' + request.originalUrl + ' from ' + this.getHumanReadableAddress(request));
			response.status(403).send('Untrusted Request Detected');
			return;
		}

		next();
	},

	hasIpReachedThreshold: function(ipAddress) {

		for (var i=0; i!=this.blacklistCandidates.length; i++) {
			if (this.blacklistCandidates[i].ipAddress == ipAddress) {
				this.blacklistCandidates[i].attemptCount++;

				if (this.blacklistCandidates[i].attemptCount >= this.maxAttempts) {
					return true;
				}

				return false;
			}
		}
		
		this.blacklistCandidates.push({ ipAddress: ipAddress, attemptCount: 1 });
	},

	getHumanReadableAddress: function(request) {

		if (request.headers['x-forwarded-for']) {
			return request.headers['x-forwarded-for'] + ' (via ' + request.connection.remoteAddress + ')';
		}

		return request.connection.remoteAddress;
	},

	// type: info|warn
	logEvent: function(type, message) {
		var msg = type == 'info' ? chalk.green('[express-defend] ') : chalk.red('[express-defend] ');
		msg += message;

		if (this.logFile != null && this.fs != null) {
			this.fs.appendFile(this.logFile, message + this.endOfLine);
		}

		console.log(msg);
	}
}