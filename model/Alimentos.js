const MongoClient = require('mongodb').MongoClient;

module.exports = class Alimentos{
	static async cadastrar(nome,qtdGramas,marca,nutriscore,qtdGordura,qtdSaturada,qtdAcucar,qtdSal,imagem){
		const conn = await MongoClient.connect('mongodb://127.0.0.1:27017/projweb2');
		const db = conn.db();

		db.collection('alimentos').insertOne({nome: nome,qtdGramas:qtdGramas,marca:marca,nutriscore:nutriscore,qtdGordura:qtdGordura,qtdSaturada:qtdSaturada,qtdAcucar:qtdAcucar,qtdSal:qtdSal,imagem:imagem});

		conn.close();
	}
}