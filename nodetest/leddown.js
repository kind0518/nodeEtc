
var GPIO = require('onoff').Gpio
var led = new GPIO(18, 'out')


led.writeSync(0);
console.log('down');


