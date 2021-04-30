let http = require('http'),
path = require('path'),
cookieParser = require('cookie-parser'),
express =require('express'),
app = express();
Users = require ('./model/Users')



app.set('view engine','hbs');
app.set('views',path.join(__dirname,'view'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.get('/', (req, res) =>{
	if(req.cookies && req.cookies.login){
		res.redirect('/busca');
	}else{
		res.render('login');
	}
})

app.get('/busca', (req, res) =>{
	if(req.cookies && req.cookies.login){
		res.render('busca',{username: req.cookies.login});
	}else{
		res.redirect('/')
	}
})

app.get('/cadastro', (req, res) =>{
	if(req.cookies && req.cookies.login){
		res.redirect('/busca');
	}else{
		res.end('Cadastro');

	}
})

app.post('/busca', async (req,res) =>{
	res.clearCookie('login');
	res.redirect('/');
})

app.post('/', async (req,res) =>{
	const 	username = req.body.username,
	password = req.body.password;
	result = await Users.login(username,password);

	if(result>0){
		res.cookie('login', username);
		res.redirect('/busca');
		return;
	}else{
		res.redirect('/')
	}


})

app.listen(3000);