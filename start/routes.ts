import Route from "@ioc:Adonis/Core/Route";

//Login para os 3 tipos de User

Route.post("/login", "AuthController.login");
Route.post("/logout", "AuthController.logout");

Route.post("/cliente/cadastro", "ClientesController.store");

Route.get("/cidades", "CidadesController.index");
Route.get(
  "/cidades/:id/estabelecimentos",
  "CidadesController.Estabelecimentos"
);

Route.get("/estabelecimentos/:id", "EstabelecimentosController.show");

Route.group(() => {
  Route.get("auth/me", "AuthController.me");

  Route.resource("/enderecos", "EnderecosController").only([
    "store",
    "update",
    "index",
    "destroy",
  ]);

  Route.get("/estabelecimentos/pedidos", "EstabelecimentosController.pedidos");

  Route.put("/cliente", "ClientesController.update");
}).middleware("auth");

Route.get("/", async () => {
  return {
    hortifruti: "pratico",
  };
});
