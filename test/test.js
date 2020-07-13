const Rewire = require('rewire');
const Sinon = require('sinon');
const test = require('ava');
const WinSC = Rewire('../src/winsc.js');

const RealService = 'QWAVE';
const FakeService = 'imaginary-service';
const TestService = 'TestService';
const TestServicePath = '.\\sample\\SampleWindowsService\\SampleWindowsService\\bin\\Debug\\SampleWindowsService.exe'

let baseExec = WinSC.__get__('exec');

// NOTE: these tests assumes you have the QWAVE
// service on your windows test machine,
// while this is a default service it is not guaranteed
// to be present

test.before(async (t) => {
  
  await WinSC.exists(TestService).then(async (exists) => {
    if (exists) {
      await WinSC.uninstall(TestService);
    }
  });
});

test.after(async (t) => {
  
  await WinSC.exists(TestService).then(async (exists) => {
    if (exists) {
      await WinSC.uninstall(TestService);
    }
  });
});

test.serial('all returns a list of all serivices registerd on local machine', async (t) => {
  
  await WinSC.all().then((serviceList) => {
    t.not(serviceList, null);
    t.truthy(Array.isArray(serviceList));
  });
});

test.serial('all rejects if the call to sc.exe through exec throws an error', async (t) => {
  
  WinSC.__set__('exec', Sinon.stub().throws());
  
  await WinSC.all().catch((err) => {
    t.is(err.message, 'Error');
  });
  
  WinSC.__set__('exec', baseExec);
});

test.serial('exists returns true if the service is registered in windows', async (t) => {
  
  await WinSC.exists(RealService).then((exists) => {
    t.truthy(exists);
  });
});

test.serial('exists returns false if the service is not registered in windows', async (t) => {
  
  await WinSC.exists(FakeService).then((exists) => {
    t.falsy(exists);
  });
});

test.serial('exists rejects if the service name provided is not valid', async (t) => {
  
  await WinSC.exists(null).catch((err) => {
    t.is(err.message, 'Service name is invalid');
  });
});

test.serial('exists rejects if the call to sc.exe through exec throws an error', async (t) => {
  
  WinSC.__set__('exec', Sinon.stub().throws());
  
  await WinSC.exists(RealService).catch((err) => {
    t.is(err.message, 'Error');
  });
  
  WinSC.__set__('exec', baseExec);
});

test.serial('status returns a string value for an existing service', async (t) => {
  
  await WinSC.status(RealService).then((status) => {
    t.not(status, null);
    t.regex(status, /^(RUNNING|STOPPED)$/);
  });
});

test.serial('status rejects if the service name does not exist', async (t) => {

  await WinSC.status(FakeService).catch((err) => {
    t.not(err, null);
    t.is(err, 'Service with name \'imaginary-service\' does not exists');
  });
});

test.serial('status rejects if the call to sc.exe through exec throws an error', async (t) => {
  
  let testErr = new Error('Error');
  
  WinSC.__set__('exec', Sinon.stub().throws());
  
  await WinSC.status(RealService).catch((err) => {
    t.is(err.message, 'Error');
  });
  
  WinSC.__set__('exec', baseExec);
  WinSC.__set__('exec', Sinon.stub().yields(testErr));
  
  await WinSC.status(RealService).catch((err) => {
    t.is(err.message, 'Error');
  });
  
  WinSC.__set__('exec', baseExec);
});

test.serial('status rejects if an invalid service name is provided', async (t) => {
  
  await WinSC.status(null).catch((err) => {
    t.is(err.message, 'Service name is invalid');
  });
});

test.serial('start returns true if the service exists and can be started', async (t) => {
  
  await WinSC.status(RealService).then(async (status) => {
    if (status === 'RUNNING') {
      await WinSC.stop(RealService);
    }
  });
  
  await WinSC.start(RealService).then((status) => {
    t.truthy(status);
  }).catch((err) => {
    console.error(err);
    t.fail();
  });
});

test.serial('start rejects if the service name does not exist', async (t) => {
  
  await WinSC.start(FakeService).catch((err) => {
    t.not(err, null);
    t.is(err, 'Service with name \'imaginary-service\' does not exists');
  });
});

test.serial('start rejects if an invalid service name is provided', async (t) => {
  
  await WinSC.start(null).catch((err) => {
    t.is(err.message, 'Service name is invalid');
  });
});

test.serial('start rejects if the call to sc.exe through exec throws an error', async (t) => {
  
  let testErr = new Error('Error');
  
  WinSC.__set__('exec', Sinon.stub().throws());
  
  await WinSC.start(FakeService).catch((err) => {
    t.is(err.message, 'Error');
  });
  
  WinSC.__set__('exec', baseExec);
  WinSC.__set__('exec', Sinon.stub().yields([testErr, 'huh']));
  
  await WinSC.start(TestService).catch((err) => {
    t.is(err[1], 'huh');
  });
  
  WinSC.__set__('exec', baseExec);
});

test.serial('stop returns true if the service exists and can be stopped', async (t) => {
  
  await WinSC.status(RealService).then(async (status) => {
    if (status === 'STOPPED') {
      await WinSC.start(RealService);
    }
  });
  
  await WinSC.stop(RealService).then((status) => {
    t.truthy(status);
  }).catch((err) => {
    console.error(err);
    t.fail();
  });
});

test.serial('stop rejects if the service name does not exist', async (t) => {
  
  await WinSC.stop(FakeService).catch((err) => {
    t.not(err, null);
    t.is(err, 'Service with name \'imaginary-service\' does not exists');
  });
});

test.serial('stop rejects if an invalid service name is provided', async (t) => {
  
  await WinSC.stop(null).catch((err) => {
    t.is(err.message, 'Service name is invalid');
  });
});

test.serial('stop rejects if the call to sc.exe through exec throws an error', async (t) => {
  
  let testErr = new Error('Error');
  
  WinSC.__set__('exec', Sinon.stub().throws());
  
  await WinSC.stop(FakeService).catch((err) => {
    t.is(err.message, 'Error');
  });
  
  WinSC.__set__('exec', baseExec);
  WinSC.__set__('exec', Sinon.stub().yields([testErr, 'huh']));
  
  await WinSC.stop(TestService).catch((err) => {
    t.is(err[1], 'huh');
  });
  
  WinSC.__set__('exec', baseExec);
});

// NOTE: the install and uninstall tests assume that you have
// built the provided sample service and have it in the
// default location.

test.serial('install installs the service and registers it with windows', async (t) => {
  
  await WinSC.exists(TestService).then((exists) => {
    t.falsy(exists);
  });
  
  await WinSC.install(TestService, TestService, TestServicePath).then((installed) => {
    t.truthy(installed);
  });

  await WinSC.exists(TestService).then((exists) => {
    t.truthy(exists);
  });
});

test.serial('install rejects if the service name is missing or invalid', async (t) => {
  
  await WinSC.exists(TestService).then(async (exists) => {
    if (exists) {
      await WinSC.uninstall(TestService);
    }
  });
  
  await WinSC.install(null, TestService, TestServicePath).catch((err) => {
    t.is(err.message, 'Service name is invalid');
  });
});

test.serial('install uses the service name for the service display name if none is provided', async (t) => {
  t.plan(4);
  
  await WinSC.exists(TestService).then((exists) => {
    t.falsy(exists);
  });
  
  await WinSC.install(TestService, null, TestServicePath).then((installed) => {
    t.truthy(installed);
  });
  
  await WinSC.exists(TestService).then((exists) => {
    t.truthy(exists);
  });
  
  await WinSC.uninstall(TestService).then((removed) => {
    t.truthy(removed);
  });
});

test.serial('install rejects if the service path is missing or invalid', async (t) => {
  
  await WinSC.exists(TestService).then((exists) => {
    t.falsy(exists);
  });
  
  await WinSC.install(TestService, TestService, null).catch((err) => {
    t.is(err.message, 'Executable file path is invalid');
  });
});

test.serial('install rejects if the service already exists', async (t) => {
  
  await WinSC.install(RealService, RealService, TestServicePath).catch((err) => {
    t.is(err, 'Service with name \'QWAVE\' already exists');
  });
});

test.serial('install rejects if the call to sc.exe through exec throws an error', async (t) => {
  
  let testErr = new Error('Error');
  
  WinSC.__set__('exec', Sinon.stub().throws());
  
  await WinSC.install(TestService, TestService, TestServicePath).catch((err) => {
    t.is(err.message, 'Error');
  });
  
  WinSC.__set__('exec', baseExec);
  WinSC.__set__('exec', Sinon.stub().yields([testErr, 'huh']));
  
  await WinSC.install(TestService, TestService, TestServicePath).catch((err) => {
    t.is(err[1], 'huh');
  });
  
  WinSC.__set__('exec', baseExec);
});

test.serial('uninstall uninstalls the service and de-registers it with windows if it exists', async (t) => {
  
  await WinSC.exists(TestService).then(async (exists) => {
    if (!exists) {
      await WinSC.install(TestService, TestService, TestServicePath);
    }
  });
  
  await WinSC.uninstall(TestService).then((removed) => {
    t.truthy(removed);
  });
  
  await WinSC.exists(TestService).then((exists) => {
    t.falsy(exists);
  });
});

test.serial('uninstall rejects if the service name does not exist', async (t) => {
  
  await WinSC.uninstall(FakeService).catch((err) => {
    t.is(err, 'Service with name \'imaginary-service\' does not exists');
  });
})

test.serial('uninstall rejects if the call to sc.exe through exec throws an error', async (t) => {
  
  let testErr = new Error('Error');
  
  WinSC.__set__('exec', Sinon.stub().throws());
  
  await WinSC.uninstall(TestService).catch((err) => {
    t.is(err.message, 'Error');
  });
  
  WinSC.__set__('exec', baseExec);
  WinSC.__set__('exec', Sinon.stub().yields([testErr, 'huh']));
  
  await WinSC.uninstall(TestService).catch((err) => {
    t.is(err[1], 'huh');
  });
  
  WinSC.__set__('exec', baseExec);
});

test.serial('uninstall rejects if the service name is invalid', async (t) => {
  
  await WinSC.uninstall(null).catch((err) => {
    t.is(err.message, 'Service name is invalid');
  });
});