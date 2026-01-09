<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card } from 'flowbite-svelte';
	import { FireOutline, ArrowRightToBracketOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

	let { data } = $props();

	function formatDate(date: Date | string) {
		const d = new Date(date);
		const now = new Date();
		const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
		return d.toLocaleDateString();
	}

	function getVolume(workout: (typeof data.recentWorkouts)[0]) {
		return Math.round(
			workout.completedExercises.reduce(
				(acc, e) => acc + e.sets.reduce((sAcc, s) => sAcc + s.weight * s.reps, 0),
				0
			)
		);
	}
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
	<Card class="px-4 py-4 dark:bg-gray-800">
		<h2 class="mb-2 text-lg font-semibold text-white">Ready to train?</h2>
		{#if data.nextDay}
			<p class="mb-4 text-gray-400">
				Up next: {data.nextDay.weekName} - {data.nextDay.name}
				<span class="text-gray-500">({data.nextDay.exerciseCount} exercises)</span>
			</p>
			<form method="POST" action="/workout?/startWorkout" use:enhance class="mb-2">
				<input type="hidden" name="dayId" value={data.nextDay.id} />
				<button
					type="submit"
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
				>
					<FireOutline class="h-5 w-5" />
					Do {data.nextDay.name}
				</button>
			</form>
			<a
				href="/workout"
				class="block w-full rounded-lg bg-gray-700 px-4 py-2 text-center text-sm text-gray-300 hover:bg-gray-600"
			>
				Choose different day
			</a>
		{:else if data.currentPlan}
			<p class="mb-4 text-gray-400">Continue with {data.currentPlan.name}</p>
			<a
				href="/workout"
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
			>
				<FireOutline class="h-5 w-5" />
				Start Workout
			</a>
		{:else}
			<p class="mb-4 text-gray-400">Create a plan to get started</p>
			<a
				href="/plans/new"
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
			>
				Create Plan
			</a>
		{/if}
	</Card>

	<!-- Recent Workouts -->
	<div>
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-white">Recent Workouts</h2>
			{#if data.recentWorkouts.length > 0}
				<a href="/history" class="text-sm text-blue-500 hover:text-blue-400">View all</a>
			{/if}
		</div>
		{#if data.recentWorkouts.length === 0}
			<Card class="px-4 py-4 dark:bg-gray-800">
				<p class="text-center text-gray-400">No workouts yet. Get started!</p>
			</Card>
		{:else}
			<div class="space-y-2">
				{#each data.recentWorkouts as workout}
					<a href="/history/{workout.id}" class="block">
						<Card class="px-4 py-3 dark:bg-gray-800">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-medium text-white">{workout.workoutDay.name}</p>
									<p class="text-sm text-gray-400">
										{workout.workoutDay.workoutWeek.workoutPlan.name}
									</p>
								</div>
								<div class="flex items-center gap-3">
									<div class="text-right">
										<p class="text-sm text-white">{getVolume(workout)} kg</p>
										<p class="text-xs text-gray-500">{formatDate(workout.completedAt!)}</p>
									</div>
									<ChevronRightOutline class="h-4 w-4 text-gray-500" />
								</div>
							</div>
						</Card>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Stats -->
	<div>
		<h2 class="mb-3 text-lg font-semibold text-white">This Week</h2>
		<div class="grid grid-cols-2 gap-3">
			<Card class="px-4 py-3 dark:bg-gray-800">
				<p class="text-2xl font-bold text-white">{data.weeklyStats.workouts}</p>
				<p class="text-sm text-gray-400">Workouts</p>
			</Card>
			<Card class="px-4 py-3 dark:bg-gray-800">
				<p class="text-2xl font-bold text-white">{data.weeklyStats.volume} kg</p>
				<p class="text-sm text-gray-400">Volume</p>
			</Card>
		</div>
	</div>
</div>
