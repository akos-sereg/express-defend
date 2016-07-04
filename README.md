# express-defend 
[![npm](https://img.shields.io/npm/v/express-defend.svg?style=flat)](https://npmjs.com/package/express-defend)
[![Build Status](https://travis-ci.org/akos-sereg/express-defend.png)](https://travis-ci.org/akos-sereg/express-defend) 

[![NPM](https://nodei.co/npm/express-defend.png?downloads=true&stars=true)](https://nodei.co/npm/express-defend/)

NodeJS Express middleware that detects malicious requests on your site (originated from automated website vulnerability scanner, or an attacker) like:<br/>

```
http://<your website>/page.html?name=<script>alert('hello world')</script>
http://<your website>/page.html?path=../../etc/passwd
```

Once a possible security threat is detected by express-defend, you can block all other requests sent from the attacker. If file logging is enabled, you can check the logfile and see how attackers try to find a security vulnerabilties on your server (it makes sense to see it, there might be real issues as well).


Current implementation supports the followings:<br/>
* Cross Site Scripting detection
* Path Traversal detection
* SQL Injection detection

Please note that this module will never be able to detect security threats with 100% precision. The goal of this project is to catch and report the very first 'obvious' attempts, if possible.

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

Content of 'suspicious.log' (after sending demo requests)

```
Suspicious Request /page.html?path=../../../etc/passwd, fragment is on blacklist (Path Traversal): "../"" from ::ffff:192.168.1.121
Suspicious Request /page.html?path=../../etc/passwd, fragment is on blacklist (Path Traversal): "../"" from ::ffff:192.168.1.121
Suspicious Request /page.html?path=../etc/passwd, fragment is on blacklist (Path Traversal): "../"" from ::ffff:192.168.1.121
Suspicious Request /page.html?name=%3Cscript%3Ealert(%27xss%27)%3C/script%3E, fragment is on blacklist (Reflected XSS): "<script"" from ::ffff:192.168.1.121
Suspicious Request /page.html?name=%27%20or%201=1, fragment is on blacklist (SQL Injection): "or 1=1"" from ::ffff:192.168.1.121, reached threshold (5)
Dropping request /page.html?name=%27%20or%201=1 from ::ffff:192.168.1.121 
```

Please note that only suspicious traffic will be dropped from a malicious host when "dropSuspiciousRequest" is enabled. 
If you want to put the host on blacklist on your server, you might want to use this module with [express-blacklist](https://github.com/akos-sereg/express-blacklist).
