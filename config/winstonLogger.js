const winston = require('winston');

const app = require('./app')

let winstonLogger = winston.createLogger({
    level: app.loggerLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint({colorize: true}),
        winston.format.splat(),
        winston.format.json(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            dirname: './logs',
            filename: 'content-partner_error.log',
            level: 'error'
        }),
        new winston.transports.File({
            dirname: './logs',
            filename: 'content-partner_app.log',
            zippedArchive: false,
            maxsize: 10000000,
            maxFiles: 2
        })]
});

module.exports = {winstonLogger};