const MongoClient = require('mongodb').MongoClient;


module.exports = class Alimentos{
	static async cadastrar(nome,qtdGramas,marca,nutriscore,qtdGordura,qtdSaturada,qtdAcucar,qtdSal,imagem){
		const conn = await MongoClient.connect('mongodb://127.0.0.1:27017/projweb2');
		const db = conn.db();

		let alimentosArray =  await db.collection('alimentos').find({ nome: nome,qtdGramas:qtdGramas,marca:marca,nutriscore:nutriscore,qtdGordura:qtdGordura,qtdSaturada:qtdSaturada,qtdAcucar:qtdAcucar,qtdSal:qtdSal,imagem:file}).toArray();

		if (alimentosArray.length===0){
			db.collection('alimentos').insertOne({nome: nome,qtdGramas:qtdGramas,marca:marca,nutriscore:nutriscore,qtdGordura:qtdGordura,qtdSaturada:qtdSaturada,qtdAcucar:qtdAcucar,qtdSal:qtdSal,imagem:file});
		}


		conn.close();
	}

	static async buscar(busca){
		const conn = await MongoClient.connect('mongodb://127.0.0.1:27017/projweb2');
		const db = conn.db();
		let result = null;

		if(busca){
			result =  await db.collection('alimentos').find({ nome: new RegExp('^' + busca)} ).toArray();
		}


		conn.close();
		return result
	}
}