import type { ServerInit } from "@sveltejs/kit";
import environment from "$lib/server/environment";

export const init: ServerInit = () => {
  console.log(environment);
  if (!environment) throw new Error("Failed to load environment variables");
}