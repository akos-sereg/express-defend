# express-defend

NodeJS Express middleware that detects malicious requests on your site, like:<br/>
http://<your website>/?username=tom<script>alert('hello world')</script><br/>
http://<your website>/?path=../../etc/passwd<br/>

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


