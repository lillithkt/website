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

	const componentProps = $state({ x: 0, y: 0, text: text, hidden: false, isTouch: false });

	let tooltipComponent: Tooltip;
	let touchTimeout: ReturnType<typeof setTimeout> | null = null;
	let isTouchDevice = false;
	let activeTouchId: number | null = null;
	let isTouchOverElement = false;

	function isPointOverElement(x: number, y: number): boolean {
		const rect = element.getBoundingClientRect();
		return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
	}

	function showTooltip(x: number, y: number, touch = false) {
		// On touch devices, offset the tooltip above the touch point to avoid finger coverage
		if (touch) {
			componentProps.x = x;
			componentProps.y = y - 50; // Offset above the touch point
			componentProps.isTouch = true;
		} else {
			componentProps.x = x;
			componentProps.y = y;
			componentProps.isTouch = false;
		}
		componentProps.hidden = false;
		if (!tooltipComponent) {
			tooltipComponent = mount(Tooltip, {
				props: componentProps,
				target: document.body
			});
		}
	}

	function hideTooltip() {
		componentProps.hidden = true;
		if (tooltipComponent) {
			unmount(tooltipComponent);
			tooltipComponent = undefined as any;
		}
		if (touchTimeout) {
			clearTimeout(touchTimeout);
			touchTimeout = null;
		}
	}

	function mouseOver(event: MouseEvent) {
		if (!isTouchDevice) {
			showTooltip(event.pageX, event.pageY, false);
		}
	}
	function mouseMove(event: MouseEvent) {
		if (!isTouchDevice && !componentProps.hidden) {
			componentProps.x = event.pageX;
			componentProps.y = event.pageY;
		}
	}
	function mouseLeave() {
		if (!isTouchDevice) {
			hideTooltip();
		}
	}

	function touchStart(event: TouchEvent) {
		isTouchDevice = true;
		const touch = event.touches[0];
		if (touch) {
			// Only track if we don't already have an active touch
			if (activeTouchId === null) {
				activeTouchId = touch.identifier;
				const isOver = isPointOverElement(touch.clientX, touch.clientY);
				
				if (isOver) {
					// If tooltip is already visible, hide it (toggle behavior)
					if (!componentProps.hidden) {
						hideTooltip();
						isTouchOverElement = false;
					} else {
						showTooltip(touch.pageX, touch.pageY, true);
						isTouchOverElement = true;
					}
				} else {
					isTouchOverElement = false;
				}
			}
		}
	}

	function globalTouchStart(event: TouchEvent) {
		// Track touches that start outside the element
		const touch = event.touches[0];
		if (touch && activeTouchId === null && !element.contains(event.target as Node)) {
			isTouchDevice = true;
			activeTouchId = touch.identifier;
			isTouchOverElement = false;
		}
	}

	function touchMove(event: TouchEvent) {
		if (activeTouchId === null) return;
		
		const touch = Array.from(event.touches).find(t => t.identifier === activeTouchId);
		if (!touch) return;

		const isOver = isPointOverElement(touch.clientX, touch.clientY);
		
		if (isOver && !isTouchOverElement) {
			// Touch moved over element
			showTooltip(touch.pageX, touch.pageY, true);
			isTouchOverElement = true;
		} else if (!isOver && isTouchOverElement) {
			// Touch moved away from element
			hideTooltip();
			isTouchOverElement = false;
		} else if (isOver && isTouchOverElement) {
			// Touch still over element, update position
			componentProps.x = touch.pageX;
			componentProps.y = touch.pageY - 50;
		}
	}

	function touchEnd(event: TouchEvent) {
		// Check if this is the active touch ending
		if (activeTouchId !== null && event.changedTouches) {
			const endedTouch = Array.from(event.changedTouches).find(t => t.identifier === activeTouchId);
			if (endedTouch) {
				activeTouchId = null;
				
				// Hide tooltip immediately when touch ends
				if (touchTimeout) {
					clearTimeout(touchTimeout);
					touchTimeout = null;
				}
				hideTooltip();
				isTouchOverElement = false;
			}
		}
	}

	function handleClickOutside(event: MouseEvent) {
		// Hide tooltip if clicking outside the element (mouse only, touch handled separately)
		const target = event.target as Node;
		if (!element.contains(target) && !isTouchDevice) {
			hideTooltip();
		}
	}

	// Detect if device supports touch
	if (browser) {
		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	}

	element.addEventListener('mouseover', mouseOver);
	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);
	element.addEventListener('touchstart', touchStart);
	
	// Track touch movements globally to support dragging over element
	if (browser) {
		document.addEventListener('touchstart', globalTouchStart, { passive: true });
		document.addEventListener('touchmove', touchMove, { passive: true });
		document.addEventListener('touchend', touchEnd);
		document.addEventListener('click', handleClickOutside);
	}

	const shouldShowBoundingBox = $derived(browser && new URLSearchParams(window.location.search).has('bb'));

	$effect(() => {
		if (shouldShowBoundingBox && text) {
			element.classList.add(...BOUNDING_BOX_CLASSES);
		} else {
			element.classList.remove(...BOUNDING_BOX_CLASSES);
		}
	});

	const destroyAction = () => {
		element.removeEventListener('mouseover', mouseOver);
		element.removeEventListener('mouseleave', mouseLeave);
		element.removeEventListener('mousemove', mouseMove);
		element.removeEventListener('touchstart', touchStart);
		if (browser) {
			document.removeEventListener('touchstart', globalTouchStart);
			document.removeEventListener('touchmove', touchMove);
			document.removeEventListener('touchend', touchEnd);
			document.removeEventListener('click', handleClickOutside);
		}
		if (touchTimeout) {
			clearTimeout(touchTimeout);
			touchTimeout = null;
		}
		activeTouchId = null;
		isTouchOverElement = false;
		hideTooltip();
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