
import type { PageServerLoad } from "./$types";
import devPage from "$lib/server/utils/pageBlock";
import vrc from "$lib/server/vrchat";
import type { CurrentUser, CurrentUserPresence, World, WorldId } from "vrchat";
import ratelimit from "$lib/utils/ratelimit";
import ms from "ms";

const getCurrentUser = ratelimit(async () => {
  const currentUser = await vrc().getCurrentUser();
  if (!currentUser.data) throw new Error("Failed to get VRChat profile");
  return currentUser.data;
}, ms("3m"));

const getWorld = ratelimit(async (worldId: WorldId) => {
  const world = await vrc().getWorld({ path: { worldId } });
  if (!world.data) throw new Error("Failed to get VRChat world");
  return world.data;
}, ms("1 hour"));

export const load: PageServerLoad = async () => {
  const { result: currentUser, lastRanAt: currentUserFetchedAt } = await getCurrentUser();
  if (!currentUser) throw new Error("Failed to get VRChat profile");

  const isOffline = currentUser.presence?.world === "offline" || !currentUser.presence?.world;
  let worldId: WorldId | null = null;
  if (!isOffline) {
    if (currentUser.presence?.world?.startsWith('wrld_')) {
      worldId = currentUser.presence?.world as WorldId;
    } else if (currentUser.presence?.travelingToWorld?.startsWith('wrld_')) {
      worldId = currentUser.presence?.travelingToWorld as WorldId;
    }
  }

  let world: World | null = null;
  if (worldId) {
    world = await getWorld(worldId).then(result => result.result);
    if (world?.id !== worldId) {
      getWorld.invalidate();
      world = await getWorld(worldId).then(result => result.result);
    }
  }

  return {
    currentUser: {
      id: currentUser.id,
      badges: currentUser.badges,
      bio: currentUser.bio,
      bioLinks: currentUser.bioLinks,
      currentAvatarImageUrl: currentUser.currentAvatarImageUrl,
      displayName: currentUser.displayName,
      pronouns: currentUser.pronouns,
      status: currentUser.status,
      statusDescription: currentUser.statusDescription,
      profilePicOverride: currentUser.profilePicOverride,
    },
    currentUserFetchedAt: new Date(currentUserFetchedAt),
    world: world ? {
      id: world.id,
      name: world.name,
      description: world.description,
      imageUrl: world.imageUrl,
    } : null,
  }
}