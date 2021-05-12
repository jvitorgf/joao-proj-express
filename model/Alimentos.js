const MongoClient = require('mongodb').MongoClient;

var mongoURL = 'mongodb+srv://UserDBProj:Iu5HJHNYWVuZxcup@projweb2.sdmpj.mongodb.net/projweb2?retryWrites=true&w=majority' || 'mongodb://127.0.0.1:27017/projweb2'

module.exports = class Alimentos{
	static async cadastrar(nome,qtdGramas,marca,nutriscore,qtdGordura,qtdSaturada,qtdAcucar,qtdSal,imagem){
		const conn = await MongoClient.connect(mongoURL);
		const db = conn.db();
		let qualidadeinfo;
		let flag = 0;
		imagem = imagem.substr(7)

		switch(nutriscore){
			case "A":
			qualidadeinfo = "Qualidade nutricional muito boa"
			break;
			case "B":
			qualidadeinfo = "Qualidade nutricional boa"
			break;
			case "C":
			qualidadeinfo = "Qualidade nutricional mediana"
			break;
			case "D":
			qualidadeinfo = "Qualidade nutricional ruim"
			break;
			case "E":
			qualidadeinfo = "Qualidade nutricional muito ruim"
			break;

		}
		let alimentosArray =  await db.collection('alimentos').find({ nome: nome,qtdGramas:qtdGramas,marca:marca,nutriscore:nutriscore,qtdGordura:qtdGordura,qtdSaturada:qtdSaturada,qtdAcucar:qtdAcucar,qtdSal:qtdSal,imagem:imagem}).toArray();

		if (alimentosArray.length===0&&nome!==""&&qtdGramas!==""&&marca!==""&&qtdGordura!==""&&qtdSaturada!==""&&qtdAcucar!==""&&qtdSal!==""&&imagem!==""){
			db.collection('alimentos').insertOne({nome: nome,qtdGramas:qtdGramas,marca:marca,nutriscore:nutriscore,qtdGordura:qtdGordura,qtdSaturada:qtdSaturada,qtdAcucar:qtdAcucar,qtdSal:qtdSal,imagem:imagem,qualidadeinfo:qualidadeinfo});
			flag=1;
		}


		conn.close();

		return flag;
	}

	static async buscar(busca){
		const conn = await MongoClient.connect(mongoURL);
		const db = conn.db();
		let result = null;

		if(busca){
			result =  await db.collection('alimentos').find({ nome: new RegExp('^' + busca)} ).toArray();
		}


		conn.close();
		return result
	}
}