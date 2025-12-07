
import type { PageServerLoad } from "./$types";
import devPage from "$lib/server/utils/devPage";
import vrc from "$lib/server/vrchat";

export const load: PageServerLoad = async () => {
  devPage();
  const currentUser = await vrc().getCurrentUser();
  console.log(currentUser);
  return {
    currentUser: currentUser.data
  }
}