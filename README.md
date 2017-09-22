# spacecraft-logger
a smart logger component for any application

## Usage
Normal
```javascript
var logger = require('../')();
```

no file output
```javascript
var logger = require('../')({file: false});
```

## Simple Example
```javascript
var logger = require('../')();

logger.log('hello');
logger.trace('hello', 'world');
logger.debug('hello %s',  'world', 123);
logger.info('hello %s %d',  'world', 123, {foo:'bar'});
logger.warn('hello %s %d %j', 'world', 123, {foo:'bar'});
logger.error('hello %s %d %j', 'world', 123, {foo:'bar'}, [1, 2, 3, 4], Object);
```

## Options

| Property      | Default                 | Description                    |
| ------------- | ----------------------- | ------------------------------ |
| dateformat    | "yyyy-mm-dd HH:MM:ss.L" | date output value in format `{{timestamp}}` |
| format        | "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})" | output format |
| color         | true                    | output color in console        |
| file          | true                    | is output file log in `logs/*` |
| silent        | false                   | is output log in console       |

**enable just when property file is true:**

| Property        | Default       | Description                                           |
| --------------- | ------------- | ----------------------------------------------------- |
| root            | '.'           | root path                                             |
| logPathFormat   | '{{root}}/{{prefix}}.{{date}}.log' | output file path format          |
| splitFormat     | 'yyyymmdd'    | file split format                                     |
| allLogsFileName | false         | if this is string, output all type of log in one file |
| maxLogFiles     | 10            | max log file number                                   |


## Customize output format
console format tag:
- `timestamp`: current time
- `title`: method name, default is 'log', 'trace', 'debug', 'info', 'warn', 'error','fatal'
- `level`: method level, default is 'log':0, 'trace':1, 'debug':2, 'info':3, 'warn':4, 'error':5, 'fatal':6
- `message`: printf message, support %s string, %d number, %j JSON and auto inspect
- `file`: file name
- `line`: line number
- `pos`: position
- `path`: file's path
- `method`: method name of caller
- `stack`: call stack message

## License
MIT Licensed. Copyright (c) moonrailgun 2017.
