const MongoClient = require('mongodb').MongoClient;

module.exports = class Users{
	static async login(username,password){
		const conn = await MongoClient.connect('mongodb://127.0.0.1:27017/projweb2');
		const db = conn.db();

		let result =  await db.collection('users').find({username:username,password:password}).toArray();

		conn.close();
		return result.length
	}


}