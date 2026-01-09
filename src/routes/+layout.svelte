<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Weights Tracker</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-900">
	<!-- Main content area with padding for bottom nav -->
	<main class="flex-1 pb-16">
		{@render children()}
	</main>

	<!-- Fixed bottom navigation -->
	<BottomNav />
</div>
