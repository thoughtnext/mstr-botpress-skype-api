var request = require("request"),
  _ = require("underscore"),
  Q = require("q")

module.exports = function() {
  var authToken = ''
  var getReportData = function(req, res) {
    console.log('getReportData')
    var deferred = Q.defer();

    var options = {
      method: 'POST',
      url: 'https://env-68274.trial.cloud.microstrategy.com:10443/json-data-api/reports/C464647211E784C4770D0080EFB58C58/instances',
      qs: { offset: '0', limit: '1000' },
      headers: {
        'x-mstr-authtoken': authToken,
        accept: 'application/vnd.mstr.dataapi.v0+json',
        'content-type': 'application/vnd.mstr.dataapi.v0+json'
      },
      body: '{\n  "requestedObjects": {\n    "attributes": [\n      {\n        "id": "string",\n        "name": "Region"\n      },\n      {\n        "id": "string",\n        "name": "Year"\n      }\n    ],\n    "metrics": [\n      {\n        "id": "string",\n        "name": "Revenue"\n      },\n      {\n        "id": "string",\n        "name": "Cost"\n      }]\n  }\n}'
    };


    request(options, function(error, response, body) {
      if (error) {
        deferred.reject(error);
      } else {
        var response = JSON.parse(body)
        // console.log(response.result)
        if (response.result != undefined) {
          var a = response.result.data.root.children
          console.log(5646464)
          var arr = []
          for (var j = 0; j < a.length; j++) {
            for (var i = 0; i < a[j].children.length; i++) {
              var temp = {
                region: a[j].element.name,
                year: a[j].children[i].element.formValues.ID,
                revenueRV: a[j].children[i].metrics.Revenue.rv,
                costRV: a[j].children[i].metrics.Cost.rv
              }
              // console.log(temp)
              arr.push(temp)
            }
          }
          deferred.resolve(arr)
        } else if (response.status === 401) { // console.log()

          return createSession()
            .then(function(token) {
              authToken = token
              // console.log()
              return getReportData(req, res)
            })
        }

      }
    });
    return deferred.promise;
  }


  var createSession = function() {
    var deferred = Q.defer();

    var options = {
      method: 'POST',
      url: 'https://env-68274.trial.cloud.microstrategy.com:10443/json-data-api/sessions',
      headers: {
        'x-authmode': '1',
        'x-password': 'DiGm2zJzfRw2',
        'x-username': 'mstr',
        'x-projectname': 'MicroStrategy Tutorial',
        'x-port': '34952',
        'x-iservername': '10.0.0.141',
        accept: 'application/vnd.mstr.dataapi.v0+json',
        'content-type': 'application/json'
      }
    };

    request(options, function(error, response, body) {
      if (error) {
        deferred.reject(error);
      } else {
        var response = JSON.parse(body).authToken
        console.log(response)
        deferred.resolve(response)
      }
    });
    return deferred.promise;
  }

  return {
    getReportData: getReportData
  }
}