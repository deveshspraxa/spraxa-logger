const logger = require('./index')({
    frequency: '24h',
    verbose: false,
    max_logs: '10d',
    date_format: 'YYYY-MM-DD',
    logLevel: 'info',
    size: '1m',
    colorize: true,
    singleLine: false,
    ignore: "",
    mixin: null,
    levelFirst: false,
    postUrl: "http://localhost:5000"
});

logger.info('hello world');
logger.debug("hello world");
logger.error("hello world");
logger.trace("hello world");