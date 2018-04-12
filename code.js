// const SerialPort = require('serialport');

// var port = new SerialPort("COM6", {
//   baudRate: 9600
// });

// port.on('data', function (data) {
//   console.log('Data:', data.toString('utf8'))
// ;});

// port.on('readable', function () {
//   console.log('Data:', port.read());
// });

const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const port = new SerialPort('COM6')
const parser = new Readline()
let X = 0
let Y = 0
port.pipe(parser);
parser.on('data', (data) => {
	console.log(data)
	if(data.charAt(0) == "X") {
		X = data.split("X")[1]
	} else if(data.charAt(0) == "Y") {
		Y = data.split("Y")[1]
	}
});
