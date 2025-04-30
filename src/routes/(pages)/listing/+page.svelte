<script lang="ts">
	const subdomains = {
		zap: 'OpenShock Instance',
		localfiles: 'My Local Music Index',
		shig: 'Kemomimichan API :3',
		img: 'Immich (Invite Only)',
		vault: 'Vaultwarden Instance (Invite Only)'
	};
</script>

<div class="size-full *:text-xl *:p-3 underline flex flex-col items-center justify-center">
	<a href="/">This Website</a>
	{#each Object.entries(subdomains) as [sub, title]}
		<a href="https://{sub}.lilyy.gay">{title}</a>
	{/each}
</div>
