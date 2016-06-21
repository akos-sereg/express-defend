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
```
root@sauron:/home/akoss/dev/cashflow# nodejs server.js
Cashflow server listening on port 3009
[express-defend] Suspicious Request /page.html?name=%3Cscript%3Ealert(%27hello%27)%3C/script%3E, fragment is on blacklist: "<script"" from ::ffff:192.168.1.121
[express-defend] Suspicious Request /page.html?path=/etc/passwd, fragment is on blacklist: "/etc/passwd"" from ::ffff:192.168.1.121
[express-defend] Suspicious Request /page.html?path=../etc/passwd, fragment is on blacklist: "../"" from ::ffff:192.168.1.121
[express-defend] Suspicious Request /page.html?path=../../etc/passwd, fragment is on blacklist: "../"" from ::ffff:192.168.1.121
IP address ::ffff:192.168.1.121 is considered to be malicious
[express-defend] Dropping request /page.html?path=../../../etc/passwd from ::ffff:192.168.1.121
```
