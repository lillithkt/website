<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import favicon from '$lib/assets/favicon.svg';
	import './app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="darkreader-lock">
	<link href="/font/ComicCodeLigatures/font.css" rel="stylesheet">
</svelte:head>

<MetaTags title="LillithRosePup's Site" description="unknown page" additionalMetaTags={[{ name: 'theme-color', content: '#E1B6EB' }]} />

<div id="root" class="bg-background-secondary text-text size-full p-5 flex flex-col gap-5">

	<div id="header" class="p-5 border-border border rounded-lg flex justify-between items-center">
		<h1 class="text-2xl font-bold"><a href="/" class="no-italic">LillithRosePup's Site</a></h1>
		<nav>
			<a href="/">Home</a>
			<a href="https://vrchat.lilyy.gay" target="_blank">VRChat</a>
			<a href="/contact">Contact</a>
		</nav>
	</div>

	<div id="content" class="bg-background p-5 border-border border rounded-lg overflow-auto">
		{@render children()}
	</div>
	
</div>