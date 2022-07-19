import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

import Cliente from "App/Models/Cliente";
import Endereco from "App/Models/Endereco";
import Pedido from "App/Models/Pedido";
import PedidoEndereco from "App/Models/PedidoEndereco";
import PedidoProduto from "App/Models/PedidoProduto";
import PedidoStatus from "App/Models/PedidoStatus";
import Produto from "App/Models/Produto";
import CidadesEstabelecimento from "App/Models/CidadesEstabelecimento";
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

      //Busca do custo de entrega
      const estabeCidade = await CidadesEstabelecimento.query()
        .where("estabelecimento_id", payload.estabelecimento_id)
        .where("cidade_id", endereco.cidade_id)
        .firstOrFail();

      let valorTotal = 0;
      for await (const produto of payload.produtos) {
        const prod = await Produto.findByOrFail("id", produto.produto_id);
        valorTotal += produto.quantidade * prod.preco;
      }

      valorTotal = estabeCidade
        ? valorTotal + estabeCidade.custo_entrega
        : valorTotal;
      valorTotal = parseFloat(valorTotal.toFixed(2));

      if (payload.troco_para != null && payload.troco_para < valorTotal) {
        trx.rollback();
        return response.badRequest(
          "O valor do troco não pode ser menor que o valor total do pedido"
        );
      }

      const pedido = await Pedido.create({
        hash_id: hash_id,
        cliente_id: cliente.id,
        estabelecimento_id: payload.estabelecimento_id,
        meio_pagamento_id: payload.meio_pagamento_id,
        pedido_endereco_id: pedidoEndereco.id,
        troco_para: payload.troco_para,
        custo_entrega: estabeCidade ? estabeCidade.custo_entrega : 0,
        valor: valorTotal,
      });

      payload.produtos.forEach(async (produto) => {
        let getProduto = await Produto.findByOrFail("id", produto.produto_id);

        await PedidoProduto.create({
          produto_id: produto.produto_id,
          pedido_id: pedido.id,
          valor: getProduto.preco,
          quantidade: produto.quantidade,
          observacao: produto.observacao,
        });
      });

      await PedidoStatus.create({
        pedido_id: pedido.id,
        status_id: 1,
      });

      //Confirma as transações
      await trx.commit();

      return response.ok(pedido);
    } catch (error) {
      await trx.rollback();
      return response.badRequest("Something wrong in the request; " + error);
    }
  }

  public async index({ auth, response }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();
    const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

    const pedidos = await Pedido.query()
      .where("cliente_id", cliente.id)
      .preload("estabelecimento")
      .preload("pedido_status", (statusQuery) => {
        statusQuery.preload("status");
      })
      .orderBy("id", "desc");

    return response.ok(pedidos);
  }

  public async show({ response, params }: HttpContextContract) {
    const idPedido = params.hash_id;
    const pedido = Pedido.query()
      .where("hash_id", idPedido)
      .preload("produtos", (produtoQuery) => {
        produtoQuery.preload("produto");
      })
      .preload("cliente")
      .preload("endereco")
      .preload("estabelecimento")
      .preload("meio_pagamento")
      .preload("pedido_status", (statusQuery) => {
        statusQuery.preload("status");
      })
      .firstOrFail();

    if (pedido == null) {
      return response.notFound("Pedido não encontrado");
    }
    return response.ok(pedido);
  }
}
