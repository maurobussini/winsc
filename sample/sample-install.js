let winsc = require('../src/winsc');
let path = require('path');
let command = process.argv[2];

const serviceExeRelativePath = ".\\SampleWindowsService\\bin\\Debug\\SampleWindowsService.exe";
const serviceName = "WinSc-SampleService2";
const serviceDisplayName = "WinSc Sample Service";

(async() => {
    try {

        //Select command passed by argument
        switch(command) {

            //**************************************************************
            case "install": 
                let fullPath = path.join(__dirname, serviceExeRelativePath);
                let wasInstalled = winsc.install(
                    serviceName, 
                    serviceDisplayName, 
                    fullPath
                );
                console.log("Installed: " + (wasInstalled ? "OK": "FAILED"));
                break;
            //**************************************************************
            case "uninstall": 
                let wasUninstalled = winsc.uninstall(
                    serviceName
                );
                console.log("Uninstalled: " + (wasUninstalled ? "OK": "FAILED"));
                break;
            //**************************************************************
            default:
                console.log("Command not supported!");
                break;
            //**************************************************************
        }

    } catch(exc){
        console.log("Exception:" + exc);
    }
})();

