import { mount, unmount } from 'svelte';
import Tooltip from './component.svelte';
import type { Action } from 'svelte/action';
import z from 'zod';
import { browser } from '$app/environment';
const BOUNDING_BOX_CLASSES = ["outline-2", "outline-red-500/15"];

const propsSchema =
z.union([
	z.object({
		text: z.string().optional(),
		underline: z.boolean().optional(),
	}),
	z.string()
]).transform((val) => {
	if (typeof val === 'string') return { text: val, underline: undefined };
	return val;
});

// inferred doesnt like the union type
type TooltipProps = string | { text?: string; underline?: boolean } | undefined;

const tooltip: Action<HTMLElement, TooltipProps> = (element, props) => {
	const { text: text, underline } = propsSchema.parse(props);
	if (underline !== false && text) element.classList.add('underline');

	const componentProps = $state({ x: 0, y: 0, text: text, hidden: false });

	let tooltipComponent: Tooltip;
	function mouseOver(event: MouseEvent) {
		componentProps.x = event.pageX;
		componentProps.y = event.pageY;
		componentProps.hidden = false;
		tooltipComponent = mount(Tooltip, {
			props: componentProps,
			target: document.body
		});
	}
	function mouseMove(event: MouseEvent) {
		componentProps.x = event.pageX;
		componentProps.y = event.pageY;
	}
	function mouseLeave() {
		componentProps.hidden = true;
		unmount(tooltipComponent);
	}

	element.addEventListener('mouseover', mouseOver);
	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);

	const shouldShowBoundingBox = $derived(browser && new URLSearchParams(window.location.search).has('bb'));

	if (shouldShowBoundingBox && text) {
		element.classList.add(...BOUNDING_BOX_CLASSES);
	}

	const destroyAction = () => {
		element.removeEventListener('mouseover', mouseOver);
		element.removeEventListener('mouseleave', mouseLeave);
		element.removeEventListener('mousemove', mouseMove);
		element.classList.remove('underline', ...BOUNDING_BOX_CLASSES);
	};

	const updateAction = (newProps: TooltipProps) => {
		const { text: text, underline } = propsSchema.parse(newProps);
		if (!text) return destroyAction();
		if (underline !== false && text) element.classList.add('underline');
		if (!text || !underline) element.classList.remove('underline');
		componentProps.text = text;
	};

	return {
		destroy() {
			destroyAction();
		},
		update(newProps: TooltipProps) {
			updateAction(newProps);
		}
	};
}

export default tooltip;