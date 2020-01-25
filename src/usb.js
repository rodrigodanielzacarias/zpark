// var usb = require('usb');
// var HID = require('node-hid');
// var devices = HID.devices();

// console.log(devices);
// var cfg = {
//   vendorId: null,
//   productId: null,
// };
// usb.on('attach', function(device) {
//   console.log('USB: ', device);
//   cfg = {
//     vendorId: device.deviceDescriptor.idVendor,
//     productId: device.deviceDescriptor.idProduct,
//   };
// });

// var serialport = require('serialport');
// var SerialPort = serialport.SerialPort;
// var util = require('util');
// var repl = require('repl');

// serialport.list(function(err, ports) {
//   ports.forEach(function(port) {
//     console.log(port.comName);
//     console.log(port.pnpId);
//     console.log(port.manufacturer);
//   });
// });

// var usbDetect = require('usb-detection');
// usbDetect.startMonitoring();

// usbDetect.find(function(err, devices) {
//   console.log(devices, err);
// });
