<script lang="ts">
	import { onMount } from 'svelte';

	let canvas = $state<HTMLCanvasElement>();
	const ctx = $derived(canvas?.getContext('2d'));
	function draw() {
		if (!canvas || !ctx) return;

		const blockSize = 512;
		const imageData = ctx.createImageData(blockSize, blockSize);
		for (var i = 0; i < blockSize * blockSize; i++) {
			var p = i * 4;
			imageData.data[p + 0] = Math.random() >= 0.5 ? 255 : 0;
			imageData.data[p + 1] = Math.random() >= 0.5 ? 255 : 0;
			imageData.data[p + 2] = Math.random() >= 0.5 ? 255 : 0;
			imageData.data[p + 3] = 255;
		}

		for (var y = 0; y < canvas.height; y += blockSize) {
			for (var x = 0; x < canvas.width; x += blockSize) {
				ctx.putImageData(imageData, x, y);
			}
		}
	}
	onMount(() => {
		setInterval(draw, 10);
	});
</script>

<canvas bind:this={canvas} width="1920" height="1080" class="w-full h-full absolute top-0 left-0"
></canvas>
