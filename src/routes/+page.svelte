<script lang="ts">
	import tooltip from "$lib/components/tooltip/index.svelte";

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
          <li use:tooltip={language.url ? undefined : language.tooltip}>
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
</div>