import vrc from "$lib/server/vrchat";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const currentUser = await vrc.getCurrentUser();
  return {
    currentUser: currentUser.data
  }
}