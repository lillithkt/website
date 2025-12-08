<script lang="ts">
	import tooltip from "$lib/components/tooltip/index.svelte";
	import { MetaTags } from 'svelte-meta-tags';

	const birthday = "2006-11-17T05:00:00.000Z";

  const smallThings: (string | string[])[] = [
    [`I'm ${new Date().getFullYear() - new Date(birthday).getFullYear()} years old.`, new Date(birthday).toLocaleDateString()],
  ];
  const languages: (string | { name: string, url?: string, tooltip?: string })[] = [
    "Typescript",
    "Svelte",
    {
      name: "Rust",
      tooltip: "What I'm learning for work!"
    },
    {
      name: "C#",
      tooltip: "Most of my C# work is for unity editor tools, namely my framework for creating Animator Controllers from code."
    },
    { name: "U#", url: "https://udonsharp.docs.vrchat.com/", tooltip: "VRChat's restricted C#, compiled down to bytecode" },
    "Python",
  ];
</script>

<MetaTags description="My personal site!" />

<div class="flex flex-col gap-2">
	<h1 class="text-3xl">Hey there, I'm LillithRosePup!</h1>
	<hr/>
  <p class="text-red-200">Disclaimer: This website is a heavy work in progress, things may break!</p>
  <hr/>
  <div class="size-fit">
    <p>I'm a programmer, namely working in Typescript and Svelte, and interested in others!</p>
    <p>You can always find me around the <a use:tooltip={"Hey, i wonder who made that website?"} href="https://abyssalfragments.org" target="_blank">Abyssal Fragments</a> community!</p>
  </div>
  <div class="size-fit">
    <h2 class="text-xl">Small things about me</h2>
    <ul class="list-disc list-inside">
      {#each smallThings as thing}
        {#if typeof thing === 'string'}
          <li>{thing}</li>
        {:else}
          <li use:tooltip={{ text: thing[1], underline: false }}>{thing[0]}</li>
        {/if}
      {/each}
    </ul>
  </div>
  <div class="size-fit">
    <h2 class="text-xl">Languages I Know</h2>
    <ul class="list-disc list-inside">
      {#each languages as language}
        {#if typeof language === 'string'}
          <li>{language}</li>
        {:else}
          <li use:tooltip={language.tooltip}>
            {#if language.url}
              <a href={language.url} target="_blank" class="underline">{language.name}</a>
            {:else}
              {language.name}
            {/if}
          </li>
        {/if}
      {/each}
    </ul>
  </div>

  <!-- Category -->
  <div class="bg-background-secondary p-5 border-border border rounded-lg mt-10">
    <span>Site Key</span>
    <ul class="list-disc list-inside text-sm flex flex-col">
      <li>Underlined text <span use:tooltip={"Like this!"}>Has a Tooltip</span></li>
      <li class="italic">Italic text is a link</li>
      <li><a href="https://catoftheday.com/" target="_blank" use:tooltip={"oo cat!"}>Links can have tooltips too</a></li>
      <li><a href="https://dogoftheday.com/" class="not-italic" target="_blank" use:tooltip={{ text: "sneaky :3", underline: false }}>Links and tooltips don't have to be visible</a></li>
    </ul>
  </div>
</div>