<script lang="ts">
	import tooltip from "$lib/components/tooltip/index.svelte";
  import { MetaTags } from 'svelte-meta-tags';

</script>

<MetaTags description="Contact me!" />

<div class="flex flex-col gap-2">
  <h1 class="text-3xl">Contact Me</h1>
  <hr/>
  <p>
    You can either contact me via
    <a use:tooltip={"LillithRosePup"} href="https://discord.com/users/799319081723232267" target="_blank">Discord</a>
    , or if you know how git works, you can get my email from my <a href="https://github.com/lillithkt" target="_blank">GitHub</a>
    , where my email is not set to private
  </p>
</div>