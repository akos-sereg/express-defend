# express-defend

NodeJS Express middleware that detects malicious requests on your site, like:<br/>
http://&lt;your website&gt;/?username=tom<script>alert('hello world')</script><br/>
http://&lt;your website&gt;/?path=../../etc/passwd<br/>

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

