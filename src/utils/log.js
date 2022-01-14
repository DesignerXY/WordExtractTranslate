const fs = require('fs');
const dateTime = require('node-datetime');

var log = {
  setName: function (message) {
    logName = message;
  },
  all: function (message) {
    console.log(getDate() + ' [ ALL ] ' + message);
    writeMessage(getDate() + ' [ ALL ] ' + message);
  },
  trace: function (message) {
    console.log(getDate() + ' [ TRACE ] ' + message);
    writeMessage(getDate() + ' [ TRACE ] ' + message);
  },
  debug: function (message) {
    console.log(getDate() + ' [ DEBUG ] ' + message);
    writeMessage(getDate() + ' [ DEBUG ] ' + message);
  },
  info: function (message) {
    console.log(((getDate() + ' [ INFO ] ' + message)).red);
    writeMessage(getDate() + ' [ INFO ] ' + message);
  },
  warn: function (message) {
    console.log(getDate() + ' [ WARN ] ' + message);
    writeMessage(getDate() + ' [ WARN ] ' + message);
  },
  error: function (message) {
    console.log(getDate() + ' [ ERROR] ' + message);
    writeMessage(getDate() + ' [ ERROR] ' + message);
  },
  fatal: function (message) {
    console.log(getDate() + ' [ FATAL ] ' + message);
    writeMessage(getDate() + ' [ FATAL ] ' + message);
  },
  off: function (message) {
    console.log(getDate() + ' [ OFF ] ' + message);
    writeMessage(getDate() + ' [ OFF ] ' + message);
  }
}

function getDate() {
  return dateTime.create().format('Y-m-d H:M:S')
}

function writeMessage(message) {
  pwd = process.cwd();
  fs.appendFileSync(pwd + '/logs/log', message + "\n");
}

module.exports = log