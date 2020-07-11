const test = require('ava');
const WinSC = require('../src/winsc.js');
const RealService = 'QWAVE';
const FakeService = 'imaginary-service';
const TestService = 'TestService';
const TestServicePath = '.\\sample\\SampleWindowsService\\SampleWindowsService\\bin\\Debug\\SampleWindowsService.exe'

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

// NOTE: the install and uninstall tests assume that you have built
// the provided sample service and have it in the default location.
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

test.serial('uninstall uninstalls the service and de-registers it with windows if it exists', async (t) => {
  
  await WinSC.exists(TestService).then((exists) => {
    t.truthy(exists);
  });
  
  await WinSC.uninstall(TestService).then((removed) => {
    t.truthy(removed);
  });
  
  await WinSC.exists(TestService).then((exists) => {
    t.falsy(exists);
  });
});

test.serial('install rejects if the service name is missing or invalid', async (t) => {
  
  await WinSC.exists(TestService).then((exists) => {
    t.falsy(exists);
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

test.serial('uninstall rejects if the service name does not exist', async (t) => {
  
  await WinSC.uninstall(FakeService).catch((err) => {
    t.is(err, 'Service with name \'imaginary-service\' does not exists');
  });
})

test('exists should return true if the service is registered in windows', async (t) => {
  
  await WinSC.exists(RealService).then((exists) => {
    t.truthy(exists);
  });
});

test('exists should return false if the service is not registered in windows', async (t) => {
  
  await WinSC.exists(FakeService).then((exists) => {
    t.falsy(exists);
  });
});

test('all should return a list of all serivices registerd on local machine', async (t) => {
  
  await WinSC.all().then((serviceList) => {
    t.not(serviceList, null);
    t.truthy(Array.isArray(serviceList));
  });
});