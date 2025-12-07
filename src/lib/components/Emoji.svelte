<script lang="ts">
  import { regex } from 'arkregex';
  /**
   * Emoji component that can display emoji from different platforms
   * currently just supports discord emojis and unicode emojis
   */
  type Props =
      { discord: `<:${string}:${number}>` } |
      { unicode: string };

  const props: Props = $props();

  const discord = "discord" in props ? props.discord : undefined;
  const unicode = "unicode" in props ? props.unicode : undefined;

  const discordEmojiRegex = regex("<:(?<name>.+):(?<id>\\d+)>")
  const discordEmojiResult = $derived.by(() => {
      if (!discord) return null;
      if (/^\d+$/.test(discord)) return [null, discord] as [string | null, string];
      const match = discordEmojiRegex.exec(discord);
      if (!match) return null
      return [match.groups.name, match.groups.id] as [string, string];
  });
  const discordEmojiName = $derived(discordEmojiResult?.[0] ?? null);
  const discordEmojiId = $derived(discordEmojiResult?.[1] ?? null);

  const discordEmojiUrl = $derived.by(() => {
      if (!discordEmojiId) return undefined;
      return `https://cdn.discordapp.com/emojis/${discordEmojiId}.png`;
  });
</script>

<div class="emoji">
  
  {#if unicode}
      <span>{unicode}</span>
  {/if}

  {#if discord}
      <img src={`https://cdn.discordapp.com/emojis/${discordEmojiId}.png?size=256`} alt={`Discord emoji "${discordEmojiName ?? discordEmojiId}"`} />
  {/if}

</div>

<style>
  .emoji {
      display: inline-block;
      width: 1em;
      height: 1em;
      vertical-align: -0.1em;
  }
</style>