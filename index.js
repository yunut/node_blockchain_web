const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 80;

app.set('views',__dirname + '/public');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

let router = require('./router/main')(app);
let api = require('./router/api')(app)

app.listen(port, () => {
	console.log('connected 80 port');
});

