<script lang="ts">
	import { page } from '$app/state';
  import errorGif from '$lib/assets/error.gif';
	import Emoji from '$lib/components/Emoji.svelte';
	import { MetaTags } from 'svelte-meta-tags';
</script>

<MetaTags title="Error" description={page.error?.message ?? 'idk'} />

<div class="flex flex-col items-center justify-center">
	<img src={errorGif} alt="oh no! our table! it's broken!" width="128px" />
	{#if page.error}
		<h1 class="text-2xl font-bold">{page.error.message}</h1>
	{:else}
		<h1 class="text-2xl font-bold">No error?</h1>
		<p>You somehow hit the error page. without an error. how the FUCK did you do that??????</p>
	{/if}
  <p>sorry about that. the table couldnt hold enough weight. i'll try again <Emoji discord="<:uwaaaaa:1273423281659314187>"/></p>
</div>
