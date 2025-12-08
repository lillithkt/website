<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import favicon from '$lib/assets/favicon.png';
	import './app.css';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="darkreader-lock">
	<link href="/font/ComicCodeLigatures/font.css" rel="stylesheet">
</svelte:head>

<MetaTags title="LillithRosePup's Site" additionalMetaTags={[{ name: 'theme-color', content: '#E1B6EB' }]} />

<div id="root" class="bg-background-secondary text-text size-full p-5 flex flex-col gap-5">

	<div id="header" class="p-5 border-border border rounded-lg flex justify-between items-center">
		<h1 class="text-2xl font-bold">
			<a href="/" class="not-italic">LillithRosePup's Site</a></h1>
		<nav>
			<a class="not-italic" href="/">Home</a>
			{#if data.vrcApiAccess}<a class="not-italic" href="/vrchat">VRChat</a>{/if}
			<a class="not-italic" href="/contact">Contact</a>
		</nav>
	</div>

	<div id="content" class="bg-background p-5 border-border border rounded-lg overflow-auto">
		{@render children()}
	</div>
	
</div>