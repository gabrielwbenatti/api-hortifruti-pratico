import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

import Cliente from "App/Models/Cliente";
import Endereco from "App/Models/Endereco";
import Pedido from "App/Models/Pedido";
import PedidoEndereco from "App/Models/PedidoEndereco";
import CreatePedidoValidator from "App/Validators/CreatePedidoValidator";

var randomString = require("randomstring");

export default class PedidosController {
  public async store({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(CreatePedidoValidator);
    const userAuth = await auth.use("api").authenticate();
    const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

    let hash_ok: boolean = false;
    let hash_id: string = "";

    while (!hash_ok) {
      hash_id = randomString.generate({
        length: 6,
        charset: "alphanumeric",
        capitalization: "uppercase",
      });
      const hash = await Pedido.findBy("hash_id", hash_id);

      if (!hash) {
        hash_ok = true;
      }
    }

    //Transaction criando
    const trx = await Database.transaction();
    const endereco = await Endereco.findByOrFail("id", payload.endereco_id);

    try {
      const pedidoEndereco = await PedidoEndereco.create({
        cidade_id: endereco.cidade_id,
        rua: endereco.rua,
        bairro: endereco.bairro,
        numero: endereco.numero,
        ponto_de_referencia: endereco.ponto_de_referencia,
        complemento: endereco.complemento,
      });
    } catch (error) {
      await trx.rollback();
      return response.badRequest("Something wrong in the request");
    }
  }
}
