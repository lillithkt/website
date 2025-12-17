import { getNowPlaying } from "$lib/lastfm"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  return {
    trackData: await getNowPlaying()
  }
}