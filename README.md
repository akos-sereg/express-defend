# express-defend

NodeJS Express middleware that detects malicious requests on your site, like:<br/>

```
http://<your website>/page.html?name=<script>alert('hello world')</script>
http://<your website>/page.html?path=../../etc/passwd
```

... and possibly blocks further suspicious requests and notifies you, based on configuration.

# Usage

```
$ npm install express-defend
```

Setting up your express server with express-defend support
```javascript
var expressDefend = require('express-defend');

app.use(expressDefend.protect({ 
    maxAttempts: 5,                   // number of attempts until "onMaxAttemptsReached" gets triggered
    dropSuspiciousRequest: true,      // respond 403 Forbidden when max attempts count is reached
    logFile: 'suspicious.log',        // if specified, express-defend will log it's output here
    onMaxAttemptsReached: function(ipAddress){
        console.log('IP address ' + ipAddress + ' is considered to be malicious');
    } 
}));
```

Above example in action

![Screenshot](https://raw.githubusercontent.com/akos-sereg/express-defend/master/doc/sample.png "Above example in action")

Please note that only suspicious traffic will be dropped from a malicious host when "dropSuspiciousRequest" is enabled. 
If you want to put the host on blacklist on your server, you might want to use this module with [express-blacklist](https://github.com/akos-sereg/express-blacklist).
