var mstrApi = require('./mstrApi')(),
  Q = require("q"),
  _ = require("underscore"),
  moment = require('moment')

module.exports = function() {

  var getRevenue = function(req, res) {
    console.log(req.query)
    mstrApi.getReportData()
      .then(function(response) {
        var query;
        var revenue;
        var region = req.query.region
        var FUNC = req.query.func

        if (region && !FUNC) {
          console.log('region')
          var groups = _(response).groupBy('region');
          var out = _(groups).map(function(g, key) {
            return {
              region: key,
              totalRevenue: _(g).reduce(function(m, x) {
                return m + x.revenueRV;
              }, 0)
            };
          });
          var value = _.find(out, function(key) {
            return key.region === region
          })
          revenue = Math.round(value.totalRevenue).toLocaleString()
        } else if (FUNC == 'avg' && !region) {
          var types = _.groupBy(response, 'region');
          let sum = response.reduce((s, f) => {
            return f.revenueRV + s; // return the sum of the accumulator and the current time. (as the the new accumulator)
          }, 0);
          var length = Object.keys(types).length
          revenue = Math.round(sum / length).toLocaleString()

        } else if ((FUNC == 'min' || FUNC == 'max') && !region) {
          var groups = _(response).groupBy('region');
          var out = _(groups).map(function(g, key) {
            return {
              region: key,
              totalRevenue: _(g).reduce(function(m, x) {
                return m + x.revenueRV;
              }, 0)
            };
          });
          var value = _[FUNC](out, function(data) {
            return data.totalRevenue;
          })
          revenue = Math.round(value.totalRevenue).toLocaleString()

        } else if (!region && !FUNC) {
          // query = "";
          let sum = response.reduce((s, f) => {
            return f.revenueRV + s; // return the sum of the accumulator and the current time. (as the the new accumulator)
          }, 0);
          revenue = Math.round(sum).toLocaleString()
        }
        res.send({ revenue: revenue })
      })
  }

  var getCost = function(req, res) {
    console.log(req.query)
    mstrApi.getReportData()
      .then(function(response) {
        var query;
        var cost;
        var region = req.query.region
        var FUNC = req.query.func

        if (region && !FUNC) {
          var groups = _(response).groupBy('region');
          var out = _(groups).map(function(g, key) {
            return {
              region: key,
              totalCost: _(g).reduce(function(m, x) {
                return m + x.costRV;
              }, 0)
            };
          });
          var value = _.find(out, function(key) {
            return key.region === region
          })
          cost = Math.round(value.totalCost).toLocaleString()
          // console.log(revenue)
          // console.log(out)
        } else if (FUNC == 'avg' && !region) {
          var types = _.groupBy(response, 'region');
          let sum = response.reduce((s, f) => {
            return f.costRV + s; // return the sum of the accumulator and the current time. (as the the new accumulator)
          }, 0);
          var length = Object.keys(types).length
          cost = Math.round(sum / length).toLocaleString()

        } else if ((FUNC == 'min' || FUNC == 'max') && !region) {
          var groups = _(response).groupBy('region');
          var out = _(groups).map(function(g, key) {
            return {
              region: key,
              totalCost: _(g).reduce(function(m, x) {
                return m + x.costRV;
              }, 0)
            };
          });
          var value = _[FUNC](out, function(data) {
            return data.totalCost;
          })
          cost = Math.round(value.totalCost).toLocaleString()

        } else if (!region && !FUNC) {
          // query = "";
          let sum = response.reduce((s, f) => {
            return f.costRV + s; // return the sum of the accumulator and the current time. (as the the new accumulator)
          }, 0);
          cost = Math.round(sum).toLocaleString()
        }
        res.send({ cost: cost })
      })
  }

  var compareRevenue = function(req, res) {
    console.log(req.query)
    mstrApi.getReportData()
      .then(function(response) {

        var groups = _(response).groupBy('year');
        var out = _(groups).map(function(g, key) {
          return {
            year: key,
            totalRevenue: _(g).reduce(function(m, x) {
              return Math.round(m + x.revenueRV)
            }, 0)
          };
        });
        console.log(out)
        for(var i=0; i<out.length;i++){
          out[i].totalRevenue = Math.round( out[i].totalRevenue).toLocaleString()
        }
        res.send( out)
      })
  }
  var compareCost = function(req, res) {
    console.log(req.query)
    mstrApi.getReportData()
      .then(function(response) {

        var groups = _(response).groupBy('year');
        var out = _(groups).map(function(g, key) {
          return {
            year: key,
            totalCost: _(g).reduce(function(m, x) {
              return Math.round(m + x.costRV)
            }, 0)
          };
        });
        console.log(out)
        for(var i=0; i<out.length;i++){
          out[i].totalCost = Math.round( out[i].totalCost).toLocaleString()
        }
        res.send(out)
      })
  }

  return {
    getRevenue: getRevenue,
    getCost: getCost,
    compareRevenue:compareRevenue,
    compareCost:compareCost
  }
}