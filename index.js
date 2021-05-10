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

login = 0;
cadastro = 0;
getAdmin = 0;


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


app.get('/', cache.invalidate(),async (req, res) =>{
	getAdmin = 0;
	if(req.cookies && req.cookies.login){
		res.redirect('/busca');
	}else{

		res.render('login',{login:login,cadastro:cadastro});
		cadastro = 0;
		login = 0;
	}
})

app.get('/busca', cache.route(),  async (req, res) =>{
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
	if(req.cookies && getAdmin===1){
		res.render('alimento');
	}else{
		res.redirect('/');
	}
})

app.post('/busca', cache.invalidate(), async (req,res) =>{
	res.clearCookie('login');
	res.redirect('/');
})


app.post('/',async (req,res) =>{
	const 	username = req.body.username,
	password = req.body.password;
	if(username!==""&&password!==""){
		result = await Users.login(username,password);
		admin = await Users.adminCheck(username,password);
		getAdmin = admin;
		if(result>0){
			res.cookie('login', username);
			if (admin === 1){
				res.redirect('/alimento');
			}else{

				res.redirect('/busca');
			}
			return;
		}else{
			login = 1;
			res.redirect('/')
		}
	} else{
		login = 0;
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
	if(email!==""&&username!==""&&password!==""){
		cadastro =  await Users.cadastrar(email,username,password);
		if(cadastro === 0){
			cadastro = 3;
		}
	}
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
	qtdSal = req.body.qtdSal;
	if(req.file !== undefined){
		imagem = req.file.path;
	}else{
		imagem = "";
	}
	Alimentos.cadastrar(nome,qtdGramas,marca,nutriscore,qtdGordura,qtdSaturada,qtdAcucar,qtdSal,imagem);
	res.redirect('/alimento');
})


app.listen(3000);