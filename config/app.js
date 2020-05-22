module.exports = {
    port : process.env.PORT || 4000,
    nodeEnv : process.env.ENV || 'development',
    loggerLevel : process.env.loggerLevel || 'info'
}