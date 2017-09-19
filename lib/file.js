const fs = require('fs');
const dateFormat = require('dateformat');
const tinytim = require('tinytim');
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const path = require('path');
const strip = require('strip-color');

module.exports = function(conf) {
  let _conf = {
    root: '.',
    logPathFormat: '{{root}}/{{prefix}}.{{date}}.log',
    splitFormat: 'yyyymmdd',
    allLogsFileName: false,
    maxLogFiles: 10
  };

  _conf = Object.assign({}, _conf, conf);

  function LogFile(prefix, date) {
    this.date = date;
    this.path = tinytim.tim(_conf.logPathFormat, {
      root: _conf.root,
      prefix: prefix,
      date: date
    });
    spawnSync('mkdir', ['-p', _conf.root]);
    this.stream = fs.createWriteStream(this.path, {
      flags: "a",
      encoding: "utf8",
      mode: parseInt('0644', 8)
      // When engines node >= 4.0.0, following notation will be better:
      //mode: 0o644
    });
  }

  LogFile.prototype.write = function(str) {
    this.stream.write(str + "\n");
  };

  LogFile.prototype.destroy = function() {
    if (this.stream) {
      this.stream.end();
      this.stream.destroySoon();
      this.stream = null;
    }
  };

  let _logMap = {};

  let _push2File = function(str, title) {
    if (_conf.allLogsFileName) {
      let allLogFile = _logMap.allLogFile,
        now = dateFormat(new Date(), _conf.splitFormat);
      if (allLogFile && allLogFile.date != now) {
        allLogFile.destroy();
        allLogFile = null;
      }
      if (!allLogFile) {
        allLogFile = _logMap.allLogFile = new LogFile(_conf.allLogsFileName, now);
        spawn('find', ['./', '-type', 'f', '-name', '*.log', '-mtime', '+' + _conf.maxLogFiles, '-exec', 'rm', '{}', '\;']);
      }
      allLogFile.write(str);
    } else {
      let logFile = _logMap[title],
        now = dateFormat(new Date(), _conf.splitFormat);
      if (logFile && logFile.date != now) {
        logFile.destroy();
        logFile = null;
      }
      if (!logFile) {
        logFile = _logMap[title] = new LogFile(title, now);
        spawn('find', [_conf.root, '-type', 'f', '-name', '*.log', '-mtime', '+' + _conf.maxLogFiles, '-exec', 'rm', '{}', '\;']);
      }
      logFile.write(str);
    }
  }

  let fileTransport = function(data) {
    _push2File(strip(data.output), data.title);
  }

  return fileTransport
}
