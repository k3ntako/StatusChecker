import LoggerWrapper from "./LoggerWrapper";
import StatusChecker from "./StatusChecker";

const logger = new LoggerWrapper();
const statusChecker = new StatusChecker(logger);

statusChecker.start();
