let http = require('http'),
path = require('path'),
cookieParser = require('cookie-parser'),
express =require('express'),
app = express();
Users = require ('./model/Users')
Alimentos = require ('./model/Alimentos')



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
		res.redirect('/');
	}
})

app.get('/cadastro', (req, res) =>{
	if(req.cookies && req.cookies.login){
		res.redirect('/busca');
	}else{
		res.render('cadastro');

	}
})

app.get('/alimento', (req, res) =>{
	if(req.cookies && req.cookies.login==='teste'){
		res.render('alimento');
	}else{
		res.redirect('/');
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
		if (username === 'teste'){
			res.redirect('/alimento');
		}else{
			res.redirect('/busca');
		}
		return;
	}else{
		res.redirect('/')
	}


})

app.post('/',(req,res) =>{
	res.redirect('/cadastro');
})

app.post('/cadastro', async (req,res) =>{
	const email = req.body.email,
	username = req.body.username,
	password = req.body.password;
	Users.cadastrar(email,username,password);
	res.redirect('/');
})

app.post('/alimento', async (req,res) =>{
	const nome = req.body.nome,
	qtdGramas = req.body.qtdGramas,
	marca = req.body.marca,
	nutriscore = req.body.nutriscore,
	qtdGordura = req.body.qtdGordura,
	qtdSaturada = req.body.qtdSaturada,
	qtdAcucar = req.body.qtdAcucar,
	qtdSal = req.body.qtdSal,
	imagem = req.body.imagem;
	Alimentos.cadastrar(nome,qtdGramas,marca,nutriscore,qtdGordura,qtdSaturada,qtdAcucar,qtdSal,imagem);
	res.redirect('/alimento');
})

app.listen(3000);