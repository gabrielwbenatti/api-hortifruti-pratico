import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Cliente from "App/Models/Cliente";
import Endereco from "App/Models/Endereco";
import CreateEditEnderecoValidator from "App/Validators/CreateEditEnderecoValidator";

export default class EnderecosController {
  public async destroy({ response, params }: HttpContextContract) {
    try {
      const resp = await Endereco.query().where("id", params.id).delete();

      if (resp.includes(1)) {
        return response.noContent();
      } else {
        return response.notFound();
      }
    } catch (error) {
      return response.badRequest();
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const payload = await request.validate(CreateEditEnderecoValidator);
    const endereco = await Endereco.findByOrFail("id", params.id);

    endereco.merge(payload);

    await endereco.save();

    return response.ok(endereco);
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(CreateEditEnderecoValidator);
    const userAuth = await auth.use("api").authenticate();
    const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

    const endereco = await Endereco.create({
      cidade_id: payload.cidade_id,
      cliente_id: cliente.id,
      rua: payload.rua,
      numero: payload.numero,
      bairro: payload.bairro,
      complemento: payload.complemento,
      ponto_de_referencia: payload.ponto_de_referencia,
    });

    return response.ok(endereco);
  }

  public async index({ response, auth }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();
    const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

    const getCliente = await Cliente.query()
      .where("id", cliente.id)
      .preload("enderecos", (cidadeQuery) => {
        cidadeQuery.preload("cidade", (queryEstado) => {
          queryEstado.preload("estado");
        });
      })
      .firstOrFail();

    response.ok(getCliente.enderecos);
  }
}
