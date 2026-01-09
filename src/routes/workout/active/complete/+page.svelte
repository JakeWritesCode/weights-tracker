<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card } from 'flowbite-svelte';
	import { CheckCircleOutline } from 'flowbite-svelte-icons';

	let { data } = $props();
</script>

<PageHeader title="Workout Complete" />

<div class="flex flex-col items-center p-4">
	<!-- Success Icon -->
	<div class="mb-4 mt-4">
		<CheckCircleOutline class="h-20 w-20 text-green-500" />
	</div>

	<h1 class="mb-2 text-2xl font-bold text-white">Great Work!</h1>
	<p class="mb-6 text-gray-400">
		{data.session.workoutDay.workoutWeek.workoutPlan.name} - {data.session.workoutDay.name}
	</p>

	<!-- Stats Grid -->
	<div class="mb-6 grid w-full grid-cols-2 gap-3">
		<Card class="px-4 py-3 text-center dark:bg-gray-800">
			<p class="text-2xl font-bold text-white">{data.stats.totalExercises}</p>
			<p class="text-sm text-gray-400">Exercises</p>
		</Card>
		<Card class="px-4 py-3 text-center dark:bg-gray-800">
			<p class="text-2xl font-bold text-white">{data.stats.totalSets}</p>
			<p class="text-sm text-gray-400">Sets</p>
		</Card>
		<Card class="px-4 py-3 text-center dark:bg-gray-800">
			<p class="text-2xl font-bold text-white">{data.stats.totalVolume} kg</p>
			<p class="text-sm text-gray-400">Volume</p>
		</Card>
		<Card class="px-4 py-3 text-center dark:bg-gray-800">
			<p class="text-2xl font-bold text-white">{data.stats.durationMins} min</p>
			<p class="text-sm text-gray-400">Duration</p>
		</Card>
	</div>

	<!-- Exercise Summary -->
	<Card class="mb-6 w-full px-4 py-4 dark:bg-gray-800">
		<h2 class="mb-3 font-semibold text-white">Exercises Completed</h2>
		<div class="space-y-3">
			{#each data.session.completedExercises as exercise}
				<div class="border-b border-gray-700 pb-2 last:border-0 last:pb-0">
					<p class="font-medium text-white">{exercise.exerciseTemplate.name}</p>
					<p class="text-sm text-gray-400">
						{exercise.sets.map((s) => `${s.weight}kg × ${s.reps}`).join(', ')}
					</p>
				</div>
			{/each}
		</div>
	</Card>

	<!-- Done Button -->
	<a
		href="/dashboard"
		class="w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700"
	>
		Done
	</a>
</div>
