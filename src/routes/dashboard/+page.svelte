<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Button, Card } from 'flowbite-svelte';
	import { FireSolid, ArrowRightToBracketOutline } from 'flowbite-svelte-icons';
</script>

<PageHeader title="Dashboard">
	{#snippet action()}
		<form method="POST" action="/logout" use:enhance>
			<button
				type="submit"
				class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
			>
				<ArrowRightToBracketOutline class="h-5 w-5" />
			</button>
		</form>
	{/snippet}
</PageHeader>

<div class="space-y-4 p-4">
	<!-- Quick Start Card -->
	<Card class="px-4 py-2 dark:bg-gray-800">
		<h2 class="mb-2 text-lg font-semibold text-white">Ready to train?</h2>
		<p class="mb-4 text-gray-400">Start your next workout session</p>
		<Button href="/workout" color="primary" class="w-full">
			<FireSolid class="mr-2 h-5 w-5" />
			Start Workout
		</Button>
	</Card>

	<!-- Recent Workouts -->
	<div>
		<h2 class="mb-3 text-lg font-semibold text-white">Recent Workouts</h2>
		<Card class="px-4 py-2 dark:bg-gray-800">
			<p class="text-center text-gray-400">No workouts yet. Get started!</p>
		</Card>
	</div>

	<!-- Stats -->
	<div>
		<h2 class="mb-3 text-lg font-semibold text-white">This Week</h2>
		<div class="grid grid-cols-2 gap-3">
			<Card class="px-4 py-2 dark:bg-gray-800">
				<p class="text-2xl font-bold text-white">0</p>
				<p class="text-sm text-gray-400">Workouts</p>
			</Card>
			<Card class="px-4 py-2 dark:bg-gray-800">
				<p class="text-2xl font-bold text-white">0 kg</p>
				<p class="text-sm text-gray-400">Volume</p>
			</Card>
		</div>
	</div>
</div>
