var mysql = require('mysql');
var conf = require('../conf');

var connection = mysql.createConnection(conf.db);
var tableName = 'article';
var sql;

module.exports = {
    itemsTitle: function (req, callback) {
        sql = mysql.format('SELECT id,title FROM ' + tableName);
        return connection.query(sql, callback);
    },
    items: function (req, callback) {
        sql = mysql.format('SELECT * FROM ' + tableName);
        return connection.query(sql, callback);
    },
    item: function (req, callback) {
        sql = mysql.format('SELECT * FROM ' + tableName + ' WHERE id = ?', [req.params.id]);
        return connection.query(sql, callback);
    },
    add: function (req, callback) {
        req.body.author = req.user.iss;
        sql = mysql.format('INSERT INTO ' + tableName + ' SET ?', req.body);
        return connection.query(sql, callback);
    },
    delete: function (req, callback) {
        var username = String(req.user.iss);
        var author;
        var role = req.user.role;
        sql = mysql.format('SELECT * FROM ' + tableName + ' WHERE id = ?', [req.params.id]);
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            author = String(results[0].author);
            if (role === 'admin') {
                console.log('you are admin, so you can delete article!');
                sql = mysql.format('DELETE FROM ' + tableName + ' WHERE id = ?', [req.params.id]);
            } else {
                if (username === author) {
                    console.log('you are author, so you can delete article!');
                    sql = mysql.format('DELETE FROM ' + tableName + ' WHERE id = ?', [req.params.id]);
                } else {
                    console.log('you are not author!');
                }
            }
            connection.query(sql, callback);
        });

    },
    put: function (req, callback) {
        var username = String(req.user.iss);
        var author;
        var role = req.user.role;
        sql = mysql.format('SELECT * FROM ' + tableName + ' WHERE id = ?', [req.params.id]);
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            author = String(results[0].author);
            if (role === 'admin') {
                console.log('you are admin, so you can updaate article!');
                sql = mysql.format('UPDATE ' + tableName + ' SET ? WHERE id = ?', [req.body, req.params.id]);
            } else {
                if (username === author) {
                    console.log('you are author, so you can updaate article!');
                    sql = mysql.format('UPDATE ' + tableName + ' SET ? WHERE id = ?', [req.body, req.params.id]);
                } else {
                    console.log('you are not author!');
                }
            }
            connection.query(sql, callback);
        });

        // sql = mysql.format('UPDATE ' + tableName + ' SET ? WHERE id = ?', [req.body, req.params.id]);
        // return connection.query(sql, callback);
    }
};