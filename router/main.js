const db = require('../db/db_conn');

module.exports = function(app) {
	app.get('/',(req,res) => {
		res.render('wallet.html');
	});
}
