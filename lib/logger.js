const tracer = require('tracer');

const defaultOpts = {
  dateformat: "yyyy-mm-dd HH:MM:ss.L",
  format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
  color: true,
  file: true,
  silent: false,
}

const defaultFileOpts = Object.assign({}, defaultOpts, {
  root:'./logs',
  maxLogFiles: 10,
  allLogsFileName: 'spacecraft'
})

const getLogger = function(_opts) {
  let opts = Object.assign({}, defaultOpts, _opts);
  if(process.env.SCL_SILENT) {
    opts.silent = Boolean(process.env.SCL_SILENT);
  }
  if(process.env.SCL_FILE) {
    opts.file = true;
    opts.root = process.env.SCL_FILE;
  }
  let fn;
  if(opts.color) {
    fn = tracer.colorConsole;
  }else {
    fn = tracer.console;
  }

  let fileTransport = opts.file
    ? require('./file')(Object.assign({}, defaultFileOpts, opts))
    : (data) => {}
  let logTransport = opts.silent
    ? (data) => {}
    : (data) => {
      if (data.level >= 4) { // warn and more critical
        console.error(data.output + "\n" + data.stack);
      } else {
        console.log(data.output);
      }
    }

  let settings = {
    dateformat: opts.dateformat,
    inspectOpt: {
      showHidden: false,
      depth: null
    },
    transport: [
      fileTransport,
  		logTransport
  	]
  };

  let logger = fn(settings);


  let wrap = function(method) {
    return logger[method];
  }

  return {
    log: wrap('log'),
    trace: wrap('trace'),
    debug: wrap('debug'),
    info: wrap('info'),
    warn: wrap('warn'),
    error: wrap('error'),
  };

}

module.exports = getLogger;
