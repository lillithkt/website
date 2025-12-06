<script lang="ts">
  let { data } = $props();
</script>
<pre>{JSON.stringify(data.currentUser, null, 2)}</pre>