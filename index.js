const fse = require('fs-extra');
const path = require('path');
const rfs = require('file-stream-rotator');
const pinoms = require('pino-multi-stream');
const { createWriteStream } = require('pino-http-send');
// const dayjs = require('dayjs');

function logger({
    frequency = '24h',
    verbose = false,
    max_logs = '10d',
    date_format = 'YYYY-MM-DD',
    logLevel = 'warn',
    size = '1m',
    colorize = true,
    singleLine = false,
    ignore = "",
    mixin = null,
    levelFirst = false,
    postUrl = null,
}) {
    const logFolder = path.join(process.cwd(), 'logs');  // Create a stream where the logs will be written
    fse.ensureDir(logFolder); // create logs directory if not exists.

    const logStreamConfig = { frequency, verbose, max_logs, date_format, size };

    const mainStream = rfs.getStream(Object.assign(logStreamConfig, { filename: `${logFolder}/log-%DATE%.log` }));
    const errorStream = rfs.getStream(Object.assign(logStreamConfig, { filename: `${logFolder}/error-%DATE%.log` }));
    const streams = [
        {
            level: logLevel,
            stream: pinoms.prettyStream({
                dest: process.stdout,
                prettyPrint: {
                    translateTime: 'SYS:yyyy-mm-dd h:MM:ss',
                    ignore: ignore,
                    colorize: colorize,
                    singleLine: singleLine,
                    levelFirst: levelFirst
                }
            })
        },
        {
            level: logLevel,
            stream: pinoms.prettyStream({
                dest: mainStream,
                prettyPrint: {
                    translateTime: 'SYS:yyyy-mm-dd h:MM:ss',
                    ignore: ignore,
                    colorize: colorize,
                    singleLine: singleLine,
                    levelFirst: levelFirst
                }
            })
        },
        {
            level: 'error',
            stream: pinoms.prettyStream({
                dest: errorStream,
                prettyPrint: {
                    translateTime: 'SYS:yyyy-mm-dd h:MM:ss',
                    ignore: ignore,
                    colorize: colorize,
                    singleLine: singleLine,
                    levelFirst: levelFirst
                }
            })
        }
    ];

    if (postUrl) {
        streams.push({
            level: logLevel,
            console: false,
            stream: createWriteStream({
                url: postUrl,
                method: "post",
                retries: 0
            }),
        });
    }

    return pinoms({
        //timestamp: () => { return `, "time": "${dayjs().format('YYYY-MM-DD HH:mm:ss')}"` },
        streams: streams,
        mixin: mixin
    });
}
module.exports = logger;