import type { ServerInit } from "@sveltejs/kit";
import environment from "$lib/server/environment";

export const init: ServerInit = () => {
  // this will never happen
  // but we do it to load the env in the init function so it fails fast
  // instead of at request time
  if (environment === undefined) throw new Error("Failed to load environment variables");
  if (!environment) throw new Error("Failed to load environment variables");
}