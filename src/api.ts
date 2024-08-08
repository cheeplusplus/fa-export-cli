import { FurAffinityClient } from "fa.js";
import { getSettings } from "./settings";

let CACHED_CLIENT: FurAffinityClient;

export function getClient() {
  if (CACHED_CLIENT) {
    return CACHED_CLIENT;
  }

  const settings = getSettings();
  if (!settings.cookies) {
    throw new Error("Cookies are missing from your settings.json");
  }

  CACHED_CLIENT = new FurAffinityClient({
    cookies: settings.cookies,
    throwErrors: true,
  });
  return CACHED_CLIENT;
}
