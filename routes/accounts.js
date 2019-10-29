var express = require('express');
var accounts = require('../models/accounts');
var oauth2 = require('../models/oauth2');

var router = express.Router();
// router.route('/total')
// .get(oauth2.accessControl, function (req, res) {
//     accounts.items(req, function (err, results, fields) {
//         if (err) {
//             res.sendStatus(500);
//             return console.error(err);
//         }
//         // 沒有找到指定的資源
//         if (!results.length) {
//             res.sendStatus(404);
//             return;
//         }
//         res.json(results);
//     });
// });
router.route('/')
    .post(oauth2.accessControl, function (req, res) {
        // 無權限
        if (res.customError) {
            res.status(res.customStatus).json(res.customError);
            return;
        }
        accounts.add(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
            res.status(201).json(results.insertId);
        });
    });

router.route('/:id')
    // .get(function (req, res) {
    //     accounts.item(req, function (err, results, fields) {
    //         if (err) {
    //             res.sendStatus(500);
    //             return console.error(err);
    //         }
    //         // 沒有找到指定的資源
    //         if (!results.length) {
    //             res.sendStatus(404);
    //             return;
    //         }
    //         res.json(results);
    //     });
    // })
    .delete(oauth2.accessControl, function (req, res) {
        accounts.delete(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
            // 指定的資源已不存在
            // SQL DELETE 成功 results.affectedRows 會返回 1，反之 0
            if (!results.affectedRows) {
                res.status(410).send({err: 'no auth!'});
                return;
            }
            res.sendStatus(204);
        });
    })
    .put(oauth2.accessControl, function (req, res) {
        // 無權限
        if (res.customError) {
            res.status(res.customStatus).json(res.customError);
            return;
        }
        accounts.put(req, function (err, results) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
            if (!results.affectedRows) {
                res.status(410).send({err: 'no auth!'});
                return;
            }
            // response 被更新的資源欄位，但因 request 主體的欄位不包含 id，因此需自行加入
            req.body.id = req.params.id;
            res.json([req.body]);
        });
    });
module.exports = router;