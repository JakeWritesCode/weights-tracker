<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Weights Tracker</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-900">
	<!-- Main content area with padding for bottom nav -->
	<main class={data.user ? 'flex-1 pb-16' : 'flex-1'}>
		{@render children()}
	</main>

	<!-- Only show nav when logged in -->
	{#if data.user}
		<BottomNav />
	{/if}
</div>
