# Spraxa Logger
Pino based logger warpper

## Install

```
$ npm install spraxa-logger
```

## Usage

``` js
const logger = require('spraxa-logger')()
logger.info('hello world');
logger.debug("hello world");
logger.error("hello world");
logger.trace("hello world");
```

## Configuration

``` js
const spraxaLogger = require('spraxa-logger');
const logger = spraxaLogger({
    frequency: '24h',
    verbose: false,
    max_logs: '10d',
    date_format: 'YYYY-MM-DD',
    localTime: false,
    logLevel: 'info',
    size: '50k'
});
logger.info('hello world');
```

## Configuration

### `frequency`      
 * How often to rotate. Options are 'daily', 'custom' and 'test'. 'test' rotates every minute.
 * If frequency is set to none of the above, a YYYYMMDD string will be added to the end of the filename.

#### `verbose`
* If set, it will log to STDOUT when it rotates files and name of log file. Default is TRUE

### `max_logs`
* Max number of logs to keep. If not set, it won't remove past logs. It uses its own log audit file to keep track of the log files in a json format. It won't delete any file not contained in it.
* It can be a number of files or number of days. If using days, add 'd' as the suffix.

### `date_format`
* Format as used in moment.js http://momentjs.com/docs/#/displaying/format/. The result is used to replace the '%DATE%' placeholder in the filename.
* If using 'custom' frequency, it is used to trigger file change when the string representation changes.

### `localTime`
* If set, it will log and show local time on file and console. Default is TRUE

### `logLevel`
* Min Level setting. Default is warn

### `size`
* Max size of the file after which it will rotate. It can be combined with frequency or date format.
* The size units are 'k', 'm' and 'g'. Units need to directly follow a number e.g. 1g, 100m, 20k.


## Contributors
* Devesh Kumar (@deveshspraxa)
