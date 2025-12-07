<script lang="ts">
	import type { Component, SvelteComponent } from "svelte";

  interface Props {
    text?: string;
    x: number;
    y: number;
		hidden: boolean;
  }
  const { text, x, y, hidden }: Props = $props();
</script>

{#if text && !hidden}
	<div
		class="border-2 border-border text-text bg-background-secondary rounded-md p-1 absolute flex flex-col"
		style="
			top: {y + 5}px;
			left: {x + 5}px;"
	>
		{#each text.split('\n') as line}
			<span>{line}</span>
		{/each}
	</div>

	<style>
		:global(.tooltip_underline) {
			text-decoration: underline;
		}
	</style>
{/if}