import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "pedidos_statuses";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table
        .integer("pedido_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("pedidos");
      table
        .integer("status_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("statuses");
      table.string("observacao").nullable();
      table.timestamp("created_at", { useTz: true }).notNullable();
      table.primary(["pedido_id", "status_id"]);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
