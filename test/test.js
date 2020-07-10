const test = require('ava');
const WinSC = require('../src/winsc.js');

// NOTE: this test assumes you have LanmanWorkstation
// (Workstation) service on your windows test machine,
// while this is a default service, it is not guaranteed
// to be present
test('status returns a string value for an existing service', async (t) => {
  
  let value = await WinSC.status('LanmanWorkstation');
  console.log(value);
  t.not(value, null);
  t.regex(value, /^(RUNNING|STOPPED)$/);
});