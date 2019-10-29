var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var conf = require('../conf');

var connection = mysql.createConnection(conf.db);
var tableName = 'account';
var sql;

module.exports = {
    login: function (req, callback) {
        var userid = req.body.userid;
        var password = req.body.password;
        sql = mysql.format('SELECT * FROM ' + tableName + ' WHERE userid = ?', [userid, password]);
        return connection.query(sql, callback);
    },
    createToken: function (req, callback) {
        let payload = {
            iss: req.results[0].userid,
            sub: 'HR System Web API',
            role: req.results[0].role
            // userid: req.results[0].userid,
            // role: req.results[0].role
        };
        let token = jwt.sign(payload, conf.secret, {
            algorithm: 'HS256',
            expiresIn: conf.increaseTime + 's'
        });
        return callback({
            // access_token: token,
            // token_type: 'bearer',
            // expres_in: (Date.parse(new Date()) / 1000) + conf.increaseTime,
            // scope: req.results[0].role,
            // info: {
            //     userid: req.results[0].userid
            // }
            status: true,
            token: token,
            userid: req.results[0].userid,
            role: req.results[0].role
        });
    },
    verifyToken: function (req, res, next) {
        var token = req.headers['token'];
        if (token) {
            jwt.verify(token, conf.secret, function (err, decoded) {
                if (err) {
                    res.status(500).send('Token Invalid');
                } else {
                    req.user = decoded;
                    next();
                }
            });
        } else {
            res.send('Please send a token');
        }
    },
    // verifyToken: function (req, res, next) {
    //     //沒有 JWT
    //     if (!req.headers.authorization) {
    //         res.customStatus = 401;
    //         res.customError = { error: 'invalid_client', error_description: '沒有 token！' };
    //     }
    //     if (req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer') {
    //         jwt.verify(req.headers.authorization.split(' ')[1], conf.secret, function (err, decoded) {
    //             if (err) {
    //                 res.customStatus = 400;
    //                 switch (err.name) {
    //                     // JWT 過期
    //                     case 'TokenExpiredError':
    //                         res.customError = { error: 'invalid_grant', error_description: 'token 過期！' };
    //                         break;
    //                     // JWT 無效
    //                     case 'JsonWebTokenError':
    //                         res.customError = { error: 'invalid_grant', error_description: 'token 無效！' };
    //                         break;
    //                 }
    //             } else {
    //                 req.user = decoded;
    //             }
    //         });
    //     }
    //     next();
    // },
    // Web API 存取控制
    accessControl: function (req, res, next) {
        // console.log(req.user);
        // 如不是 admin，則無權限
        switch (req.user.role) {
            // case 'admin':
            // case 'user':
            case 'guest':
                res.customStatus = 400;
                res.customError = { error: 'unauthorized_client', error_description: '無權限！' };
                break;
        }
        next();
    }
};