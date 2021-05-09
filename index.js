let http = require('http'),
path = require('path'),
cookieParser = require('cookie-parser'),
cache = require('express-redis-cache'),
express =require('express'),
multer = require('multer'),
upload = multer({ dest: 'public/uploads' }),
app = express();
Users = require ('./model/Users')
Alimentos = require ('./model/Alimentos')


cache = cache({
	prefix:'redis-cache',
	host:'127.0.0.1',
	port: 6379
});

cache.invalidate = (name) => {
	return (req, res, next) => {
		const route_name = name ? name : req.url;
		if (!cache.connected) {
			next();
			return ;
		}
		cache.del(route_name, (err) => console.log(err));
		next();
	};
};

app.set('view engine','hbs');
app.set('views',path.join(__dirname,'view'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.get('/',async (req, res) =>{
	if(req.cookies && req.cookies.login){
		res.redirect('/busca');
	}else{
		res.render('login');
	}
})

app.get('/busca',  async (req, res) =>{
	if(req.cookies && req.cookies.login){
		const 	busca = req.query.busca,
		alimentos = await Alimentos.buscar(busca);
		res.render('busca',{username: req.cookies.login,alimentos:alimentos});
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

app.post('/',async (req,res) =>{
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

app.post('/cadastro',  async (req,res) =>{
	const email = req.body.email,
	username = req.body.username,
	password = req.body.password;
	Users.cadastrar(email,username,password);
	res.redirect('/');
})

app.post('/alimento', upload.single('file'), async (req,res) =>{
	const nome = req.body.nome,
	qtdGramas = req.body.qtdGramas,
	marca = req.body.marca,
	nutriscore = req.body.nutriscore,
	qtdGordura = req.body.qtdGordura,
	qtdSaturada = req.body.qtdSaturada,
	qtdAcucar = req.body.qtdAcucar,
	qtdSal = req.body.qtdSal,
	imagem = req.file.path;
	Alimentos.cadastrar(nome,qtdGramas,marca,nutriscore,qtdGordura,qtdSaturada,qtdAcucar,qtdSal,imagem);
	res.redirect('/alimento');
})


app.listen(3000);