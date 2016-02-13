var GPIO = require('onoff').Gpio;
var led = new GPIO(18, 'out');



led.writeSync(1);
console.log('led on');


