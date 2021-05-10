const MongoClient = require('mongodb').MongoClient;


module.exports = class Alimentos{
	static async cadastrar(nome,qtdGramas,marca,nutriscore,qtdGordura,qtdSaturada,qtdAcucar,qtdSal,imagem){
		const conn = await MongoClient.connect('mongodb://127.0.0.1:27017/projweb2');
		const db = conn.db();
		let qualidadeinfo;

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