var configuration = require('./configuration'),
  foo = require('./implementation'),
  implement = foo(),
  Adapter = require("./Adapter")()

module.exports = {
  configure: function(app) {
    /*
     * Use your own validation token. Check that the token used in the Webhook 
     * setup is the same token used here.
     *
     */
    app.get('/details', function(req, res) {
      return Adapter.getReport(req, res)
    });
    app.get('/revenue', function(req, res) {
    	return implement.getRevenue(req, res)
      // return Adapter.getRevenue(req, res)
    });
    app.get('/cost', function(req, res) {
      return implement.getCost(req, res)
    });
    app.get('/comparison/revenue', function(req, res) {
      return implement.compareRevenue(req, res)
    });
    app.get('/comparison/cost', function(req, res) {
      return implement.compareCost(req, res)
    });


  }
};