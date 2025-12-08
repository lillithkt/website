<script lang="ts">
	import { MetaTags } from "svelte-meta-tags";

  let { data } = $props();

  const profilePic = $derived(
    data.currentUser.profilePicOverride || data.currentUser.currentAvatarImageUrl
  );

  const preconnectDomains = [
    "https://icons.duckduckgo.com",
    "https://api.vrchat.cloud",
    "https://files.vrchat.cloud",
    "https://assets.vrchat.com"
  ]
</script>

<MetaTags description="{data.currentUser.displayName}'s VRChat profile" openGraph={{ images: [{ url: profilePic }] }} />
<svelte:head>
  <title>{data.currentUser.displayName}'s' VRChat profile</title>
  {#each preconnectDomains as domain}
    <link rel="preconnect" href={domain} crossorigin="anonymous" />
  {/each}
</svelte:head>

<div class="flex flex-col gap-5">
  <div class="flex flex-col gap-5">
    <!-- Profile Header -->
    <a class="flex gap-5 items-start not-italic" href="https://vrchat.com/home/user/{data.currentUser.id}">
      {#if profilePic}
        <img
          src={profilePic}
          alt="{data.currentUser.displayName}'s avatar"
          class="h-32 rounded-lg border border-border object-cover"
        />
      {/if}
      
      <div class="flex flex-col gap-2 flex-1">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-3xl font-bold">{data.currentUser.displayName}</h1>
          {#if data.currentUser.pronouns}
            <span class="text-gray-400 text-lg">({data.currentUser.pronouns})</span>
          {/if}
        </div>
        
        {#if data.currentUser.status}
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold">Status:</span>
              <span class="capitalize">{data.currentUser.status}</span>
            </div>
            {#if data.currentUser.statusDescription}
              <p class="text-gray-300 italic">{data.currentUser.statusDescription}</p>
            {/if}
          </div>
        {/if}
      </div>
    </a>

    <!-- World Information -->
    <div class="border border-border rounded-lg p-4 bg-background-secondary">
      <h2 class="text-xl font-semibold mb-3">Location</h2>
      {#if data.world}
        <a href="https://vrchat.com/home/world/{data.world.id}" class="flex gap-4 not-italic">
          {#if data.world.imageUrl}
            <img
              src={data.world.imageUrl}
              alt={data.world.name}
              class="h-24 rounded-lg border border-border object-cover shrink-0"
            />
          {/if}
          <div class="flex flex-col gap-2 flex-1">
            <div>
              <h3 class="text-lg font-semibold">{data.world.name}</h3>
              {#if data.world.description}
                <p class="text-gray-300 text-sm mt-1">{data.world.description}</p>
              {/if}
            </div>
            <div class="text-xs text-gray-400 font-mono">{data.world.id}</div>
          </div>
        </a>
      {:else}
        <div class="text-gray-400">Offline</div>
      {/if}
    </div>

    {#if data.currentUser.bio}
      <div class="border border-border rounded-lg p-4 bg-background-secondary">
        <h2 class="text-xl font-semibold mb-2">Bio</h2>
        <p class="text-gray-300 whitespace-pre-wrap">{data.currentUser.bio}</p>
      </div>
    {/if}

    <!-- Bio Links -->
    {#if data.currentUser.bioLinks && data.currentUser.bioLinks.length > 0}
      <div class="border border-border rounded-lg p-4 bg-background-secondary">
        <h2 class="text-xl font-semibold mb-2">Links</h2>
        <div class="flex flex-col gap-2">
          {#each data.currentUser.bioLinks as link}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              class="text-purple-300 hover:text-purple-200 underline"
            >
              <img src="https://icons.duckduckgo.com/ip2/{new URL(link).hostname}.ico" onload={(ev) => {
                ev.currentTarget.classList.remove('hidden');
                ev.currentTarget.classList.add('inline-block');
              }} alt="Link icon" class="w-4 h-4 hidden" />
              {link
                .replace(/^https?:\/\//, '')
                .replace(/\/$/, '')
              }
            </a>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Badges -->
    {#if data.currentUser.badges && data.currentUser.badges.length > 0}
      <div class="border border-border rounded-lg p-4 bg-background-secondary">
        <h2 class="text-xl font-semibold mb-3">Badges</h2>
        <div class="flex flex-wrap gap-3">
          {#each data.currentUser.badges as badge}
            <div
              class="flex flex-col items-center gap-1 p-2 rounded border border-border bg-background hover:bg-button transition-colors"
              title={badge.badgeDescription}
            >
              <img
                src={badge.badgeImageUrl}
                alt={badge.badgeName}
                class="w-16 h-16 object-contain"
              />
              <span class="text-sm text-center max-w-[100px]">{badge.badgeName}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  <div class="text-sm text-gray-400">
    Last fetched at {data.currentUserFetchedAt.toLocaleString()}
  </div>
</div>