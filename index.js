var five = require('johnny-five');
var raspi = require('raspi-io');
var Device = require('losant-mqtt').Device;

// Construct Losant device.
var device = new Device({
  id: 'my-device-id',
  key: 'my-access-key',
  secret: 'my-access-secret'
});

// Connect the device to Losant.
device.connect();

var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {

  var led = new five.Led('P1-7')
  var button = new five.Button({
    pin: 'P1-11',
    isPullup: true
  });

  button.on('down', function() {
    console.log('Button pressed')
    // When the button is pressed, send the state to Losant.
    device.sendState({ button: true });
  });

  // Listen for commands from Losant.
  device.on('command', function(command) {
    console.log('Received a command: ' + command.name)
    if(command.name === 'toggle') {
      led.toggle();
    }
  });
});
