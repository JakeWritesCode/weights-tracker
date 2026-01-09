<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card } from 'flowbite-svelte';

	let { data } = $props();

	function formatDate(date: Date | string) {
		const d = new Date(date);
		return d.toLocaleDateString('en-GB', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatTime(date: Date | string) {
		const d = new Date(date);
		return d.toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<PageHeader title={data.session.workoutDay.name} backHref="/history" />

<div class="p-4">
	<!-- Header Info -->
	<div class="mb-4">
		<p class="text-gray-400">{data.session.workoutDay.workoutWeek.workoutPlan.name}</p>
		<p class="text-sm text-gray-500">
			{formatDate(data.session.completedAt!)} at {formatTime(data.session.completedAt!)}
		</p>
	</div>

	<!-- Stats Grid -->
	<div class="mb-6 grid grid-cols-2 gap-3">
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

	<!-- Exercises -->
	<h2 class="mb-3 text-lg font-semibold text-white">Exercises</h2>
	<div class="space-y-3">
		{#each data.session.completedExercises as exercise, index}
			<Card class="px-4 py-3 dark:bg-gray-800">
				<div class="flex items-start gap-3">
					<span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs text-gray-300">
						{index + 1}
					</span>
					<div class="flex-1">
						<h3 class="font-medium text-white">{exercise.exerciseTemplate.name}</h3>
						{#if exercise.exerciseTemplate.muscleGroup}
							<p class="text-sm text-gray-500">{exercise.exerciseTemplate.muscleGroup}</p>
						{/if}
						<div class="mt-2 space-y-1">
							{#each exercise.sets as set}
								<div class="flex items-center gap-2 text-sm">
									<span class="text-gray-500">Set {set.setNumber}:</span>
									<span class="text-white">{set.weight} kg × {set.reps} reps</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</Card>
		{/each}
	</div>
</div>
