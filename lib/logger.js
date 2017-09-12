const tracer = require('tracer');

const defaultOpts = {
  dateformat: "yyyy-mm-dd HH:MM:ss.L",
  format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
  color: true,
  file: true,
}
const defaultFileOpts = Object.assign({}, defaultOpts, {
  root:'./logs',
  maxLogFiles: 10,
  allLogsFileName: 'spacecraft'
})

const getLogger = function(_opts) {
  let opts = Object.assign({}, defaultOpts, _opts);
  let fn;
  if(opts.color) {
    fn = tracer.colorConsole;
  }else {
    fn = tracer.console;
  }

  let fileTransport = opts.file
    ? require('./file')(Object.assign({}, defaultFileOpts, _opts))
    : (data) => {};

  let settings = {
    dateformat: opts.dateformat,
    inspectOpt: {
      showHidden: false,
      depth: null
    },
    transport: [
      fileTransport,
  		function(data) {
        if (data.level >= 4) { // warn and more critical
  				console.error(data.output + "\n" + data.stack);
  			} else {
  				console.log(data.output);
  			}
  		}
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
