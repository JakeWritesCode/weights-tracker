<script lang="ts">
	import { page } from '$app/stores';
	import { BottomNav, BottomNavItem } from 'flowbite-svelte';
	import {
		HomeSolid,
		ClipboardListSolid,
		FireSolid,
		ClockSolid
	} from 'flowbite-svelte-icons';

	const navItems = [
		{ href: '/dashboard', label: 'Home', icon: HomeSolid },
		{ href: '/plans', label: 'Plans', icon: ClipboardListSolid },
		{ href: '/workout', label: 'Workout', icon: FireSolid },
		{ href: '/history', label: 'History', icon: ClockSolid }
	];

	function isActive(href: string, pathname: string): boolean {
		if (href === '/dashboard') {
			return pathname === '/' || pathname === '/dashboard';
		}
		return pathname.startsWith(href);
	}
</script>

<BottomNav
	position="fixed"
	navType="application"
	classInner="grid-cols-4"
	classOuter="dark:bg-gray-800 border-t border-gray-700"
>
	{#each navItems as item}
		{@const active = isActive(item.href, $page.url.pathname)}
		<BottomNavItem
			btnName={item.label}
			href={item.href}
			active={active}
			activeClass="text-primary-500 dark:text-primary-400"
			class="dark:hover:bg-gray-700"
		>
			<item.icon
				class="mb-1 h-5 w-5 {active
					? 'text-primary-500 dark:text-primary-400'
					: 'text-gray-500 dark:text-gray-400'}"
			/>
		</BottomNavItem>
	{/each}
</BottomNav>
