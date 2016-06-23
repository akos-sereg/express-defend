# express-defend

NodeJS Express middleware that detects malicious requests on your site (originated from automated website vulnerability scanner, or an attacker) like:<br/>

```
http://<your website>/page.html?name=<script>alert('hello world')</script>
http://<your website>/page.html?path=../../etc/passwd
```

... and possibly blocks further suspicious requests from attacker's host, and notifies you - based on configuration.

# Usage

```
$ npm install express-defend
```

Setting up your express server with express-defend support
```javascript
var expressDefend = require('express-defend');

app.use(expressDefend.protect({ 
    maxAttempts: 5,                   // (default: 5) number of attempts until "onMaxAttemptsReached" gets triggered
    dropSuspiciousRequest: true,      // respond 403 Forbidden when max attempts count is reached
    consoleLogging: true,             // (default: true) enable console logging
    logFile: 'suspicious.log',        // if specified, express-defend will log it's output here
    onMaxAttemptsReached: function(ipAddress, url){
        console.log('IP address ' + ipAddress + ' is considered to be malicious, URL: ' + url);
    } 
}));
```

Above example in action

![Screenshot](https://raw.githubusercontent.com/akos-sereg/express-defend/master/doc/sample.png "Above example in action")

Please note that only suspicious traffic will be dropped from a malicious host when "dropSuspiciousRequest" is enabled. 
If you want to put the host on blacklist on your server, you might want to use this module with [express-blacklist](https://github.com/akos-sereg/express-blacklist).
