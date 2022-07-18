import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Estabelecimento from "App/Models/Estabelecimento";
import { faker } from "@faker-js/faker";
import User from "App/Models/User";
import Estado from "App/Models/Estado";
import Cidade from "App/Models/Cidade";
import CidadesEstabelecimento from "App/Models/CidadesEstabelecimento";

export default class extends BaseSeeder {
  public async run() {
    for (let i = 3; i <= 20; i++) {
      const user = await User.create({
        email: `estabelecimento${i}@email.com.br`,
        password: "1234567",
        tipo: "estabelecimentos",
      });

      await Estabelecimento.create({
        nome: `estabelecimento ${i}`,
        logo: `https://picsum.photos/id/${i}/200/200`,
        online: true,
        bloqueado: false,
        userId: user.id,
      });
    }

    await Estado.createMany([
      {
        nome: "São Paulo",
        uf: "SP",
      },
      {
        nome: "Minas Gerais",
        uf: "MG",
      },
      {
        nome: "Rio de Janeiro",
        uf: "RJ",
      },
    ]);

    await Cidade.createMany([
      {
        ativo: true,
        estado_id: 1,
        nome: "Mogi Mirim",
      },
      {
        estado_id: 2,
        nome: "Mogi Guaçu",
      },
      {
        estado_id: 3,
        nome: "Itapira",
      },
    ]);

    for (let i = 1; i <= 18; i++) {
      await CidadesEstabelecimento.create({
        cidade_id: faker.datatype.number({ min: 1, max: 3 }),
        estabelecimento_id: i,
        custo_entrega: faker.datatype.float({
          min: 0,
          max: 10,
          precision: 0.01,
        }),
      });
    }
  }
}
