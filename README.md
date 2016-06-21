var expressDefend = require('express-defend');

app.use(expressDefend.protect({ 
    maxAttempts: 5, 
    dropSuspiciousRequest: false, 
    logFile: 'suspicious.log', 
    onMaxAttemptsReached: function(ipAddress){
        // ipAddress should be blocked
    } 
}));