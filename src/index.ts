import LoggerWrapper from "./LoggerWrapper";
import App from "./App";
import Setup from "./Setup";

(async () => {
  const logger = new LoggerWrapper();
  const setup = new Setup(logger);
  const app: App | null = await setup.setup();

  app && (await app.run());
})();
