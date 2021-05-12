const MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb+srv://UserDBProj:Iu5HJHNYWVuZxcup@projweb2.sdmpj.mongodb.net/projweb2?retryWrites=true&w=majority' || 'mongodb://127.0.0.1:27017/projweb2'

module.exports = class Users{
	static async login(username,password){
		const conn = await MongoClient.connect(mongoURL);
		const db = conn.db();

		let result =  await db.collection('users').find({username:username,password:password}).toArray();
		
		conn.close();
		return result.length
	}

	static async cadastrar(email,username,password){
		const conn = await MongoClient.connect(mongoURL);
		const db = conn.db();
		let usernameArray =  await db.collection('users').find({username:username}).toArray();
		let emailArray =  await db.collection('users').find({email:email}).toArray();
		let result = usernameArray.length + emailArray.length
		if (usernameArray.length===0&&emailArray.length===0&&email!==""&&username!==""&&password!==""){
			db.collection('users').insertOne({email: email,username:username,password:password,admin:0});
		}
		conn.close();
		return result;
	}

	static async adminCheck(username,password){
		const conn = await MongoClient.connect(mongoURL);
		const db = conn.db();

		let result =  await db.collection('users').find({username:username,password:password,admin:1}).toArray();
		
		conn.close();
		return result.length
	}


}