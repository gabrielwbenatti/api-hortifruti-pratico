import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";

import Cliente from "App/Models/Cliente";
import PedidoStatus from "App/Models/PedidoStatus";
import Estabelecimento from "App/Models/Estabelecimento";
import PedidoProduto from "App/Models/PedidoProduto";
import MeiosPagamento from "App/Models/MeiosPagamento";
import PedidoEndereco from "App/Models/PedidoEndereco";

export default class Pedido extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public hash_id: string;

  @column()
  public cliente_id: number;

  @column()
  public estabelecimento_id: number;

  @column()
  public meio_pagamento_id: number;

  @column()
  public pedido_endereco_id: number;

  @column()
  public valor: number;

  @column()
  public troco_para: number | null;

  @column()
  public custo_entrega: number;

  @column()
  public observacao: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @hasOne(() => Cliente, { foreignKey: "id", localKey: "cliente_id" })
  public cliente: HasOne<typeof Cliente>;

  @hasMany(() => PedidoStatus, {
    foreignKey: "id",
    localKey: "pedido_id",
  })
  public pedido_status: HasMany<typeof PedidoStatus>;

  @hasOne(() => Estabelecimento, {
    localKey: "estabelecimento_id",
    foreignKey: "id",
  })
  public estabelecimento: HasOne<typeof Estabelecimento>;

  @hasMany(() => PedidoProduto, { localKey: "id", foreignKey: "pedido_id" })
  public produtos: HasMany<typeof PedidoProduto>;

  @hasOne(() => PedidoEndereco, {
    localKey: "endereco_id",
    foreignKey: "id",
  })
  public endereco: HasOne<typeof PedidoEndereco>;

  @hasOne(() => MeiosPagamento, {
    localKey: "meio_pagamento_id",
    foreignKey: "id",
  })
  public meio_pagamento: HasOne<typeof MeiosPagamento>;
}
