let http = require('http'),
path = require('path'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
cache = require('express-redis-cache'),
express =require('express'),
multer = require('multer'),
upload = multer({ dest: 'public/uploads' }),
port = process.env.PORT || 3000,
app = express();

Users = require ('./model/Users')
Alimentos = require ('./model/Alimentos')

login = 0;
cadastro = 0;
getAdmin = 0;
item = 0;


cache = cache({
	prefix:'redis-cache',
	host:'redis-18868.c114.us-east-1-4.ec2.cloud.redislabs.com',
	port: 18868,
	auth_pass:'mfrt9yTmBrn8wGnhH0TgcRsZBXqUSOAf'
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
app.use(session({
	secret: 'cDJASdj9S0AFAd656',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))


app.get('/', cache.invalidate(),async (req, res) =>{
	getAdmin = 0;
	if(req.cookies && req.cookies.login && req.session && req.session.login){
		res.redirect('/busca');
	}else{

		res.render('login',{login:login,cadastro:cadastro});
		cadastro = 0;
		login = 0;
	}
})

app.get('/busca', cache.route(),  async (req, res) =>{
	if(req.cookies && req.cookies.login && req.session && req.session.login){
		const 	busca = req.query.busca,
		alimentos = await Alimentos.buscar(busca);
		res.render('busca',{username: req.cookies.login,alimentos:alimentos});
	}else{
		res.redirect('/');
	}
})


app.get('/cadastro', (req, res) =>{
	if(req.cookies && req.cookies.login && req.session && req.session.login){
		res.redirect('/busca');
	}else{
		res.render('cadastro');

	}
})

app.get('/alimento',  (req, res) =>{
	if(req.cookies && getAdmin===1 && req.session && req.session.login){
		res.render('alimento',{item:item});
		item = 0;
	}else{
		res.redirect('/');
	}
})

app.post('/busca', cache.invalidate(), async (req,res) =>{
	req.session.destroy();
	res.clearCookie('login');
	res.clearCookie('connect.sid');
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
			req.session.login = username;
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
	if(nome!==""&&qtdGramas!==""&&marca!==""&&qtdGordura!==""&&qtdSaturada!==""&&qtdAcucar!==""&&qtdSal!==""&&imagem!==""){
		item = await Alimentos.cadastrar(nome,qtdGramas,marca,nutriscore,qtdGordura,qtdSaturada,qtdAcucar,qtdSal,imagem);
	}
	res.redirect('/alimento');

})


app.listen(port);
