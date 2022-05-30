// This module is to handle mysql connectivity
// all in 1 place, so it can be re-usable.

const mysql = require("mysql");
module.exports.mysqlConnect = function () {
    var con = mysql.createConnection({
        host: "localhost",
        user: "coder",
        database: "smarthome",
        multipleStatements: true
    });
    con.connect(function (err) {
        //if (err) throw err;
    })
    return con;
}


module.exports.mysqlRelease = function(con) {
    con.end(function () {
        console.log("Connection Closed")
    })

}

module.exports.getMysql = function () {
    return mysql;
}

module.exports.executeQueries = function (query, successcallback, unsucessfulcallback) {
    var con = this.mysqlConnect();
    con.query(query, (err, results) => {
        if (err) {
            console.log(err);
            unsucessfulcallback(err);
        } else {
            successcallback(err);
        }
        
    });

}