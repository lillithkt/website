<svelte:head>
	<title>Lily's Site</title>
	<meta name="darkreader-lock" content="nuh uh" />
</svelte:head>

<div class="root bg-ctp-base text-text min-h-full w-full">
	<!-- <div class="header flex flex-row w-full items-center">
		<nav>
			<a href="/">Home</a>
		</nav>
	</div> -->
	<div class="content min-h-full w-full flex flex-col pt-20 items-center">
		<slot />
	</div>
</div>
