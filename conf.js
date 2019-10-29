module.exports = {
    db: {
        host: '127.0.0.1',
        user: 'Rose',
        password: 'mitlab',
        database: 'rosedb'
    },
    port: 3000,
    // JWT 自訂私鑰
    secret: 'secret',
    // JWT 加上多少時間過期 (UNIX 時間戳)
    increaseTime: 1000
};