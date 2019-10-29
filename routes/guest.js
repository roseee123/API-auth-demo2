var express = require('express');
var accounts = require('../models/accounts');

var router = express.Router();

router.route('/total')
    .get(function (req, res) {
        accounts.items(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
            // 沒有找到指定的資源
            if (!results.length) {
                res.sendStatus(404);
                return;
            }
            res.json(results);
        });
    });

router.route('/:id')
    .get(function (req, res) {
        accounts.item(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
            // 沒有找到指定的資源
            if (!results.length) {
                res.sendStatus(404);
                return;
            }
            res.json(results);
        });
    });

module.exports = router;