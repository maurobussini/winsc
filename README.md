winsc - Windows Service Controller for NodeJs
======
Windows Service Controller for NodeJs. Install/uninstall, start/stop and verify existence of a Windows service. Print out the current status of the service and list all services available on local machine.

| This module works on Microsoft Windows machines only |
| --- |

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

Get status of the service using its name
```javascript
let serviceStatus = await winsc.status('ServiceOne');

// serviceStatus => "RUNNING" or "STOPPED"
```

Get details of a given service using its name
```javascript
let serviceDetails = await winsc.details('ServiceOne');

// serviceDetails => {
//   name: "ServiceOne",
//   displayName: "Service One",
//   startType: "Automatic",
//   exePath: "C:\Windows\System32\serviceone.exe"
//   dependencies: []
// }
```

| Attention! Install, uninstall, start and stop require administrative privileges! |
| --- |

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

## Provided working sample

Inside folder **sample** you will find a sample of Windows Service created using .NET Framework 4.7.2. In order to try "winsc" please **build** the .NET application (using Visual Studio 2017/2019).

The Windows Service executable file will be generated in 
*.\sample\SampleWindowsService\SampleWindowsService\bin\Debug\SampleWindowsService.exe*. Please check its existence before proceed.

Then run with **administrative privileges** from the project **root** folder the following commands on console.

For install the new service:

```console
node ./sample/sample-install.js install
```

For uninstall the service, run the following command:

```console
node ./sample/sample-install.js uninstall
```

Enjoy...