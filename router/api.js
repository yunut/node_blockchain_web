const Web3 = require('web3');
const web3 = new Web3();
const db = require('../db/db_conn');
const cookieParser = require('cookie-parser');
const url = 'http://localhost:8545';

web3.setProvider(new Web3.providers.HttpProvider(url));

module.exports = function(app) {
	app.get('/api/test', function (req,res) {
		res.send('api test !!');
	});
	
	app.get('/api/getCoinbase', async(req,res) => {
		let accounts = await web3.eth.getCoinbase();
		res.send('Coinbase is ' + accounts);
	});

	app.get('/api/getAccountList', async(req,res) => {
		let accounts;
		accounts = await web3.eth.getAccounts();
		res.send('now create Account is ' + accounts);
	});

	app.get('/api/getBalance', async(req,res) => {
		let account = req.query.account;
		let result = await web3.eth.getBalance(account);
		result = web3.utils.fromWei(result,"ether");
		res.send(result);
	});

	app.post('/api/newAccount', async(req, res) => {
		let email = req.body.email;
		let password = req.body.password;
		let result = await web3.eth.personal.newAccount(password);
		let sql = `INSERT INTO member(user_email,user_password,user_pub_key) values('${email}','${password}','${result}')`;

		db.query(sql,function(err, rows, fields) {
			if(err) {
				console.log(err);
			} else {
				console.log(rows);
				res.send();
			}
		})
		console.log(password);
		console.log(email);
		res.send('post success');
	});

	app.post('/api/balance_search', async(req, res) => {
		let key = req.body.key;
		console.log(key);
		let result = await web3.eth.getBalance(key);
		result = web3.utils.fromWei(result,"ether");
		res.send(result);
	});

	app.post('/api/login', async(req, res) => {
		let email = req.body.email;
		let password = req.body.password;
		let sql = `SELECT user_pub_key FROM member WHERE user_email='${email}' AND user_password='${password}'`;

		db.query(sql,function(err, rows, fields) {
			if(err) {
				console.log(err);
			} else {
				console.log(rows[0].user_pub_key);
				res.cookie('pub_key',rows[0].user_pub_key)
				.send(rows[0].user_pub_key);
			}
		})
		
	});

	app.post('/api/trans_eth', async(req, res) => {
		var target_account = req.body.target_account;
		var myaccount = req.body.myaccount;
		var price_num = req.body.price_num;

	
		let passwords = await serachUser_psw(myaccount);
		let tmp = await web3.eth.personal.unlockAccount(myaccount,passwords,0);
		let result = await web3.eth.sendTransaction({
			from: myaccount,
			to: target_account,
			value: price_num
		});
		res.send(result);
	});

	app.get('/api/get_eth', async(req,res) => {
		let key = req.query.key;
		let coinBase = await web3.eth.getCoinbase();
		console.log(`coinBase : ${coinBase}`);
		
		let unlock_result = await web3.eth.personal.unlockAccount(coinBase,'',0);
		console.log(`unlock_result : ${unlock_result}`);
		
		let send_result = await web3.eth.sendTransaction({
			from: coinBase,
			to: key,
			value : web3.utils.toWei('10','ether')
		});
		console.log(`send_result : ${send_result}`)
		res.send(send_result);
	});

	const serachUser_psw = async(myAccount) => {
		return new Promise((resolve, reject) => {
			let sql = `SELECT user_password FROM member WHERE user_pub_key='${myAccount}'`;
			db.query(sql, function(err, rows, fields) {
				if(err) {
					reject(err)
				} else {
					resolve(rows[0].user_password);
				}
			});
		})
	}
}


