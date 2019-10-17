const mysql = require('mysql');
const con = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '1111',
	database : 'wallet'
});

con.connect();
console.log('DB Connect complete 3306 port');

module.exports = con;
