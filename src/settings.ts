import * as fs from "fs";

const SETTINGS_FILE = "settings.json";

interface Settings {
  cookies: string;
}

let CACHED_SETTINGS: Settings;

export function getSettings() {
  if (CACHED_SETTINGS) {
    return CACHED_SETTINGS;
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    throw new Error("settings.json does not exist. Please create it first.");
  }
  const configJsonText = fs.readFileSync("settings.json", "utf-8");
  const configJson = JSON.parse(configJsonText) as Settings;

  CACHED_SETTINGS = configJson;
  return CACHED_SETTINGS;
}
