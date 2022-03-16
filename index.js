const fse = require('fs-extra');
const path = require('path');
const rfs = require('file-stream-rotator');
const pino = require('pino');
const pinoms = require('pino-multi-stream');

function logger({ frequency = '24h', verbose = false, max_logs = '10d', date_format = 'YYYY-MM-DD', localTime = true, logLevel = 'warn', size = '1m' }) {
    const logFolder = path.join(process.cwd(), 'logs');  // Create a stream where the logs will be written
    fse.ensureDir(logFolder); // create logs directory if not exists.

    const logStreamConfig = { frequency, verbose, max_logs, date_format, size };

    const mainStream = rfs.getStream(Object.assign(logStreamConfig, { filename: `${logFolder}/log-%DATE%.log` }));
    const errorStream = rfs.getStream(Object.assign(logStreamConfig, { filename: `${logFolder}/error-%DATE%.log` }));
    const streams = [
        { level: logLevel, stream: process.stdout },
        { level: logLevel, stream: mainStream },
        { level: 'error', stream: errorStream }
    ];

    return pino({
        level: logLevel, // this MUST be set at the lowest level of the destination
        prettyPrint: {
            colorize: false,
            levelFirst: true,
            ignore: 'pid,hostname',
            translateTime: localTime ? 'SYS:h:MM:ss TT Z o' : true,
            messageFormat: 'Message - {msg}',
            size: size
        }
    }, pinoms.multistream(streams));
}
module.exports = logger;