const exec = require("child_process").exec;

// Module schema
module.exports = {
    all: all, 
    exists: exists, 
    install: install, 
    uninstall: uninstall, 
    stop: stop, 
    start: start, 
    status: status
};

/**
 * Get status of provided service on local machine
 * @param {string} serviceName Name of service
 */
function status(serviceName) {

    //Create promise
    return new Promise((resolve, reject) => {

        //With invalid service name, reject
        if (!serviceName){
            reject(new Error('Service name is invalid'));
            return;
        }

        //Check existence
        exists(serviceName).then(

            //Existence check completed
            (alreadyExists) => {

                //If exists, reject
                if (!alreadyExists){
                    return reject("Service with name '" + serviceName + "' does not exists");
                }

                //Run command for create service with provided data
                exec("sc.exe query " + serviceName, (err, stdout) => {

                    //On error, reject and exit
                    if (err){
                        return reject(err);
                    }

                    //Get all lines on standard output, take only
                    //lines with "STATE" and remove extra parts
                    var lines = stdout.toString()
                        .split("\r\n")            
                        .filter(function (line) {
                            return line.indexOf("STATE") !== -1;
                        });

                    //Split "STOPPED" o "RUNNING"
                    let stateName = lines[0].indexOf("STOPPED") !== -1 
                        ? "STOPPED"
                        : "RUNNING";

                    //Get state name
                    return resolve(stateName);
                });

            }, 

            //Reject on error
            (err) => reject(err)
        );

    });
}

/**
 * Stops provided service on local machine
 * @param {string} serviceName Name of service
 */
function stop(serviceName) {

    //Create promise
    return new Promise((resolve, reject) => {

        //With invalid service name, reject
        if (!serviceName){
            reject(new Error('Service name is invalid'));
            return;
        }

        //Check existence
        exists(serviceName).then(

            //Existence check completed
            (alreadyExists) => {

                //If exists, reject
                if (!alreadyExists){
                    return reject("Service with name '" + serviceName + "' does not exists");
                }

                //Run command for create service with provided data
                exec("sc.exe stop " + serviceName, (err, stdout) => {

                    //On error, reject and exit
                    if (err){
                        return reject(new Error(stdout));
                    }

                    //Get all lines on standard output, take only
                    //lines with "SUCCESS" and remove extra parts
                    var lines = stdout.toString()
                        .split("\r\n")            
                        .filter(function (line) {
                            return line.indexOf("SUCCESS") !== -1;
                        });

                    //With at least one line with success, true, otherwise, false
                    return resolve(!!lines);
                });

            }, 

            //Reject on error
            (err) => reject(err)
        );

    });
}

/**
 * Starts provided service on local machine
 * @param {string} serviceName Name of service
 */
function start(serviceName) {

    //Create promise
    return new Promise((resolve, reject) => {

        //With invalid service name, reject
        if (!serviceName){
            reject(new Error('Service name is invalid'));
            return;
        }

        //Check existence
        exists(serviceName).then(

            //Existence check completed
            (alreadyExists) => {

                //If exists, reject
                if (!alreadyExists){
                    return reject("Service with name '" + serviceName + "' does not exists");
                }

                //Run command for create service with provided data
                exec("sc.exe start " + serviceName, (err, stdout) => {

                    //On error, reject and exit
                    if (err){
                        return reject(new Error(stdout));
                    }

                    //Get all lines on standard output, take only
                    //lines with "SUCCESS" and remove extra parts
                    var lines = stdout.toString()
                        .split("\r\n")            
                        .filter(function (line) {
                            return line.indexOf("SUCCESS") !== -1;
                        });

                    //With at least one line with success, true, otherwise, false
                    return resolve(!!lines);
                });

            }, 

            //Reject on error
            (err) => reject(err)
        );

    });
}

/**
 * Uninstalls provided service from local machine
 * @param {string} serviceName Name of service
 */
function uninstall(serviceName) {

    //Create promise
    return new Promise((resolve, reject) => {

        //With invalid service name, reject
        if (!serviceName){
            reject(new Error('Service name is invalid'));
            return;
        }

        //Check existence
        exists(serviceName).then(

            //Existence check completed
            (alreadyExists) => {

                //If exists, reject
                if (!alreadyExists){
                    return reject("Service with name '" + serviceName + "' does not exists");
                }

                //Run command for create service with provided data
                exec("sc.exe delete " + serviceName, (err, stdout) => {

                    //On error, reject and exit
                    if (err){
                        return reject(new Error(stdout));
                    }

                    //Get all lines on standard output, take only
                    //lines with "SUCCESS" and remove extra parts
                    var lines = stdout.toString()
                        .split("\r\n")            
                        .filter(function (line) {
                            return line.indexOf("SUCCESS") !== -1;
                        });

                    //With at least one line with success, true, otherwise, false
                    return resolve(!!lines);
                });

            }, 

            //Reject on error
            (err) => reject(err)
        );
    });
}

/**
 * Install provided service on local machine
 * @param {string} serviceName Name of service
 * @param {string} displayName Name of service displayed on service manager
 * @param {string} exeFilePath Executable file full path
 */
function install(serviceName, displayName, exeFilePath) {

    //Create promise
    return new Promise((resolve, reject) => {

        //With invalid service name, reject
        if (!serviceName){
            reject(new Error('Service name is invalid'));
            return;
        }

        //With invalid exeFilePath, reject
        if (!exeFilePath){
            reject(new Error('Executable file path is invalid'));
            return;
        }

        //With missing display name, set service name
        if (!displayName){
            displayName = "Service '" + serviceName + "'";
        }

        //Check existence
        exists(serviceName).then(

            //Existence check completed
            (alreadyExists) => {

                //If exists, reject
                if (alreadyExists){
                    return reject("Service with name '" + serviceName + "' already exists");
                }

                //Run command for create service with provided data
                exec("sc.exe create " + serviceName + " " + 
                "displayname=\"" + displayName  + "\" " + 
                "binpath=\"" + exeFilePath + "\"", (err, stdout) => {

                    //On error, reject and exit
                    if (err){
                        return reject(new Error(stdout));
                    }

                    //Get all lines on standard output, take only
                    //lines with "SUCCESS" and remove extra parts
                    var lines = stdout.toString()
                        .split("\r\n")            
                        .filter(function (line) {
                            return line.indexOf("SUCCESS") !== -1;
                        });

                    //With at least one line with success, true, otherwise, false
                    return resolve(!!lines);
                });

            }, 

            //Reject on error
            (err) => reject(err)
        );        
    });
}

/**
 * Check if provided service name exists
 * @param {string} serviceName Name of service
 */
function exists(serviceName) {

    //Create promise
    return new Promise((resolve, reject) => {

        //With invalid service name, reject
        if (!serviceName){
            reject(new Error('Service name is invalid'));
            return;
        }

        //Get all services
        all().then(

            //On success, check
            (allServices) => {

                //Find provided name
                for (let i = 0; i < allServices.length; i++){
                    if (allServices[i] == serviceName){
                        resolve(true);
                    }
                }

                //Not found, resolve false
                resolve(false);
            }, 

            //Reject on error
            (err) => reject(err)
        );
    }); 
}

/**
 * Get all names of services installed on local machine
 */
function all() {

    //Create promise
    return new Promise((resolve, reject) => {

        //Run command for get states of all services on local machine
        exec("sc.exe query state= all", (err, stdout) => {

            //On error, reject and exit
            if (err){
                reject(err);
                return;
            }

            //Get all lines on standard output, take only
            //lines with "SERVICE_NAME" and remove extra parts
            var lines = stdout.toString()
                .split("\r\n")            
                .filter(function (line) {
                    return line.indexOf("SERVICE_NAME") !== -1;
                }).
                map(function (line) {
                    return line.replace("SERVICE_NAME: ", "");
                });

            //Resolve with array of service names
            resolve(lines);
        });
    });
}