import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Estabelecimento from "App/Models/Estabelecimento";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const user = await User.create({
      email: "estabelecimentos@email.com",
      password: "123456",
      tipo: "estabelecimentos",
    });

    await Estabelecimento.create({
      nome: "Estabelecimento",
      logo: "https://via.placeholder.com/150",
      online: true,
      bloqueado: false,
      userId: user.id,
    });
  }
}
