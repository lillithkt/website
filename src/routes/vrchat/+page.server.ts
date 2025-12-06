import vrc from "$lib/server/vrchat";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const currentUser = await vrc.getCurrentUser();
  console.log(currentUser);
  return {
    currentUser: currentUser.data
  }
}