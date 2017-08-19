var mysql = require("mysql");

var Q = require("q");
var moment = require('moment');
var options = {
  "host": process.env.MYSQL_HOST || "thoughtnext.com",
  "port": process.env.MYSQL_PORT || "3306",
  "user": process.env.MYSQL_USER || "restokit_socialsurvey",
  "password": process.env.MYSQL_PASSWORD || "social@123",
  "database": process.env.MYSQL_DATABASE || "restokit_socialsurvey"
};

function Adapter() {
  if (this instanceof Adapter) {
    // this.root = new Firebase(process.env.FIREBASE_URL || "https://glaring-heat-2025.firebaseio.com/");
    this.db = mysql.createPool(options);
  } else {
    return new Adapter();
  }
}

Adapter.prototype.getReport = function(req, res) {

  const query = "SELECT * FROM report";
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          res.send(err)
          deferred.reject(err);

        } else {
          // callback(results)
          res.send(results)
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getdetails function finished")
  return deferred.promise;
}

Adapter.prototype.getRevenue = function(req, res) {
console.log(req.query)
  var query;
  var region = req.query.region
  var FUNC = req.query.func

  if(region && !FUNC)
  	query = "SELECT SUM(revenue) AS revenue FROM report WHERE UPPER(region) LIKE UPPER('%"+region+"%')"
  else if(FUNC && !region)
  	query = "SELECT "+FUNC+"(sum) AS revenue FROM (SELECT Sum(revenue) AS sum FROM report GROUP BY region) a ";
  else if(!region && !FUNC)
  	query = "SELECT SUM(revenue) as revenue FROM report";
  // else if()
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          res.send(err)
          deferred.reject(err);

        } else {
          // callback(results)
          res.send(results[0])
          deferred.resolve(results[0]);
        }
      });
    }
  });
  console.log("getdetails function finished")
  return deferred.promise;
}
Adapter.prototype.getExpenses = function(req, res) {
console.log(req.query)
  var query;
  var region = req.query.region
  var FUNC = req.query.func

  if(region && !FUNC)
  	query = "SELECT SUM(expense) AS cost FROM report WHERE UPPER(region) LIKE UPPER('%"+region+"%')";
  else if(FUNC && !region)
  	query = "SELECT "+FUNC+"(sum) AS cost FROM (SELECT Sum(expense) AS sum FROM report GROUP BY region) a ";
  else if(!region && !FUNC)
  	query = "SELECT SUM(expense) as cost FROM report";
  // else if()
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          res.send(err)
          deferred.reject(err);

        } else {
          // callback(results)
          res.send(results[0])
          deferred.resolve(results[0]);
        }
      });
    }
  });
  console.log("getExpenses function finished")
  return deferred.promise;
}

module.exports = Adapter;