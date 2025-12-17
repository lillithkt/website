<script lang="ts">
	import { getNowPlaying, type TrackData } from "$lib/lastfm";

  type Props = {
    trackData?: TrackData | null;
  }
  let { trackData = $bindable() }: Props = $props();

  async function fetchTrackData(): Promise<TrackData | null> {
    try {
      return await getNowPlaying();
    } catch (e) {
      console.error(`Error fetching track data: ${e instanceof Error ? e.message : String(e)}`);
      return null;
    }
  }

  async function updateTrack() {
    trackData = await fetchTrackData();
  }

  $effect(() => {
    updateTrack();
    // Refresh every 15 seconds
    const interval = setInterval(updateTrack, 5000);
    return () => clearInterval(interval);
  });
</script>

{#if trackData}
<div class="bg-background-secondary p-5 border-border border rounded-lg">
  <h2 class="text-xl mb-2">Now Playing</h2>
    <div class="flex gap-4 items-center">
      {#if trackData.imageUrl}
        <img
          src={trackData.imageUrl}
          alt="{trackData.artist} - {trackData.name}"
          class="w-16 h-16 rounded object-cover"
        />
      {/if}
      <div class="flex-1">
        <p class="font-semibold">
          {#if trackData.url}
            <a href={trackData.url} target="_blank" rel="noopener noreferrer">
              {trackData.name}
            </a>
          {:else}
            {trackData.name}
          {/if}
        </p>
        <p class="text-sm text-muted-foreground">{trackData.artist}</p>
        {#if trackData.album}
          <p class="text-xs text-muted-foreground">{trackData.album}</p>
        {/if}
      </div>
    </div>
  </div>
{/if}