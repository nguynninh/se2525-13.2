import i18next from "i18next";
import Backend from "i18next-fs-backend";
import * as middleware from "i18next-http-middleware";
import fs from "fs";
import path from "path";

const localesDir = path.join(__dirname, "locales/en");
const namespaces = fs
  .readdirSync(localesDir)
  .filter(f => f.endsWith(".json"))
  .map(f => path.basename(f, ".json"));

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "vi",
    preload: ["en", "vi", "cn", "jp"],
    ns: namespaces,
    defaultNS: "common",
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}/{{ns}}.json"),
    },
    detection: {
      order: ["header"],
    },
  });

export default middleware.handle(i18next);