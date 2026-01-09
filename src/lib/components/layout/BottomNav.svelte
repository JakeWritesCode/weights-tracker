<script lang="ts">
	import { page } from '$app/stores';
	import {
		HomeOutline,
		ClipboardListOutline,
		FireOutline,
		ClockOutline
	} from 'flowbite-svelte-icons';

	const navItems = [
		{ href: '/dashboard', label: 'Home', icon: HomeOutline },
		{ href: '/plans', label: 'Plans', icon: ClipboardListOutline },
		{ href: '/workout', label: 'Workout', icon: FireOutline },
		{ href: '/history', label: 'History', icon: ClockOutline }
	];

	function isActive(href: string, pathname: string): boolean {
		if (href === '/dashboard') {
			return pathname === '/' || pathname === '/dashboard';
		}
		return pathname.startsWith(href);
	}
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-700 bg-gray-800">
	<div class="grid h-16 grid-cols-4">
		{#each navItems as item}
			{@const active = isActive(item.href, $page.url.pathname)}
			<a
				href={item.href}
				class="flex flex-col items-center justify-center hover:bg-gray-700 {active
					? 'text-blue-500'
					: 'text-gray-400'}"
			>
				<item.icon class="h-5 w-5" />
				<span class="mt-1 text-xs">{item.label}</span>
			</a>
		{/each}
	</div>
</nav>
