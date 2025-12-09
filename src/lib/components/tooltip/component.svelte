<script lang="ts">
	import type { Component, SvelteComponent } from "svelte";
	import { browser } from '$app/environment';

  interface Props {
    text?: string;
    x: number;
    y: number;
		hidden: boolean;
		isTouch?: boolean;
  }
  const { text, x, y, hidden, isTouch = false }: Props = $props();

  let tooltipElement = $state<HTMLDivElement | null>(null);
  let tooltipWidth = $state(0);
  let tooltipHeight = $state(0);

  const adjustedX = $derived(() => {
    const baseOffset = isTouch ? 0 : 5;
    if (!tooltipWidth) {
      return { left: x + baseOffset, useTransform: false };
    }
    
    const offset = isTouch ? -tooltipWidth / 2 : 5;
    let left = x + offset;
    const padding = 8; // Padding from viewport edge
    
    // Check right edge overflow
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
      // If we adjusted, don't use centering transform
      return { left, useTransform: false };
    }
    
    // Check left edge overflow
    if (left < padding) {
      left = padding;
      return { left, useTransform: false };
    }
    
    return { left, useTransform: isTouch };
  });

  const adjustedY = $derived(() => {
    const baseOffset = isTouch ? 0 : 5;
    if (!tooltipHeight) {
      return y + baseOffset;
    }
    
    const offset = isTouch ? -tooltipHeight - 10 : 5; // 10px gap above touch point
    let top = y + offset;
    const padding = 8; // Padding from viewport edge
    
    // Check top edge overflow
    if (top < padding) {
      // If would overflow top, show below instead
      top = y + (isTouch ? 10 : 5);
    }
    
    // Check bottom edge overflow
    if (top + tooltipHeight > window.innerHeight - padding) {
      // If would overflow bottom, try showing above
      const topPosition = y - tooltipHeight - (isTouch ? 10 : 5);
      if (topPosition >= padding) {
        top = topPosition;
      } else {
        // Can't fit above either, just constrain to viewport
        top = window.innerHeight - tooltipHeight - padding;
      }
    }
    
    return top;
  });

  $effect(() => {
    if (tooltipElement && !hidden && browser) {
      // Use requestAnimationFrame to ensure element is rendered
      requestAnimationFrame(() => {
        if (tooltipElement) {
          tooltipWidth = tooltipElement.offsetWidth;
          tooltipHeight = tooltipElement.offsetHeight;
        }
      });
    }
  });
</script>

{#if text && !hidden}
	<div
		bind:this={tooltipElement}
		class="border-2 border-border text-text bg-background-secondary rounded-md p-1 absolute flex flex-col pointer-events-none z-50"
		style="
			top: {adjustedY()}px;
			left: {adjustedX().left}px;
			transform: {adjustedX().useTransform ? 'translateX(-50%)' : 'none'};"
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