
import type { PageServerLoad } from "./$types";
import { testPage } from "$lib/server/utils/pageBlock";
import vrc from "$lib/server/vrchat";

export const load: PageServerLoad = async () => {
  testPage();
  const currentUser = await vrc().getCurrentUser();
  return {
    currentUser: currentUser.data
  }
}