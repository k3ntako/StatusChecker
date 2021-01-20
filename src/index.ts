import App from "./App";
import Setup from "./Setup";

(async () => {
  const setup = new Setup();
  const app: App | null = await setup.setup();

  app && (await app.run());
})();
