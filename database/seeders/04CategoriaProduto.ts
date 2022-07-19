import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import { faker } from "@faker-js/faker";
import Categoria from "App/Models/Categoria";
import Produto from "App/Models/Produto";

export default class extends BaseSeeder {
  public async run() {
    for (let iEst = 3; iEst <= 18; iEst++) {
      let categoria = await Categoria.create({
        nome: faker.commerce.department(),
        descricao: faker.lorem.sentence(),
        posicao: 1,
        ativo: true,
        estabelecimento_id: iEst,
      });

      await Produto.createMany([
        {
          nome: faker.commerce.productName(),
          imagem: faker.image.imageUrl(300, 300),
          descricao: faker.lorem.sentence(),
          preco: faker.datatype.number({ min: 5, max: 100, precision: 0.1 }),
          unidade: "UNI",
          categoria_id: categoria.id,
          posicao: 1,
        },
        {
          nome: faker.commerce.productName(),
          imagem: faker.image.imageUrl(300, 300),
          descricao: faker.lorem.sentence(),
          preco: faker.datatype.number({ min: 5, max: 100, precision: 0.1 }),
          unidade: "KG",
          categoria_id: categoria.id,
          posicao: 2,
        },
        {
          nome: faker.commerce.productName(),
          imagem: faker.image.imageUrl(300, 300),
          descricao: faker.lorem.sentence(),
          preco: faker.datatype.number({ min: 5, max: 100, precision: 0.1 }),
          unidade: "KG",
          categoria_id: categoria.id,
          posicao: 3,
        },
      ]);
    }
  }
}
