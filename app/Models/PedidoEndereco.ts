import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Cidade from "./Cidade";

export default class PedidoEndereco extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public cidade_id: number;

  @column()
  public rua: string;

  @column()
  public numero: string | null;

  @column()
  public bairro: string;

  @column()
  public ponto_de_referencia: string | null;

  @column()
  public complemento: string | null;

  @hasOne(() => Cidade, { localKey: "cidade_id", foreignKey: "id" })
  public cidade: HasOne<typeof Cidade>;
}
