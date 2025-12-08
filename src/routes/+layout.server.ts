import environment from "$lib/server/environment";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = () => ({
  vrcApiAccess: !!environment.AUTHPROXY_KEY
})