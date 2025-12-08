<script lang="ts">
	import Code from "$lib/components/Code.svelte";

  let { data } = $props();
</script>
<h1 class="text-2xl text-red-500">WARNING: this fetches instantly. do not spam!</h1>
<Code code={JSON.stringify(data.currentUser, null, 2)} language="json" />