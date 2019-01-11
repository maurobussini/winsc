winsc - Windows Service Controller for NodeJs
======
Windows Service Controller for NodeJs. Install/uninstall, start/stop and verify existence of a Windows service. Print out the current status of the service and list all services available on local machine.

Disclaimer! This module works on Microsoft Windows machines only

## Install NPM

```javascript
npm install winsc --save
```

## Usage

Import module for Windows Service Controller
```javascript
let winsc = require('winsc');
```

Get list of all available services on local machine
```javascript
let services = await winsc.all();

// services => ["ServiceOne", "ServiceTwo"]
```

Check existence of provide service name
```javascript
let doesExists = await winsc.exists('ServiceOne');

// doesExists => true/false
```

Install the service providing name, deescription and executable path
```javascript
let wasInstalled = await winsc.install(
    'ServiceOne', 
    'Demo Service One', 
    'C:\\services\\service-one.exe');

// wasInstalled => true/false
```

Uninstall the service providing name
```javascript
let wasUninstalled = await winsc.uninstall('ServiceOne');

// wasUninstalled => true/false
```

Start an installed service
```javascript
let wasStarted = await winsc.start('ServiceOne');

// wasStarted => true/false
```

Stop a running service
```javascript
let wasStopped = await winsc.stop('ServiceOne');

// wasStopped => true/false
```

Get status of the service using its name
```javascript
let serviceStatus = await winsc.status('ServiceOne');

// serviceStatus => "RUNNING" or "STOPPED"
```
Enjoy...