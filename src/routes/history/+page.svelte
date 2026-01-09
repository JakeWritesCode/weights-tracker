<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card } from 'flowbite-svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';

	let { data } = $props();

	function formatDate(date: Date | string) {
		const d = new Date(date);
		return d.toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'short'
		});
	}

	function getVolume(workout: (typeof data.workouts)[0]) {
		return Math.round(
			workout.completedExercises.reduce(
				(acc, e) => acc + e.sets.reduce((sAcc, s) => sAcc + s.weight * s.reps, 0),
				0
			)
		);
	}

	function getDuration(workout: (typeof data.workouts)[0]) {
		const start = new Date(workout.startedAt);
		const end = new Date(workout.completedAt!);
		return Math.round((end.getTime() - start.getTime()) / 60000);
	}
</script>

<PageHeader title="History" />

<div class="p-4">
	{#if data.workouts.length === 0}
		<Card class="px-4 py-6 dark:bg-gray-800">
			<p class="text-center text-gray-400">No workout history yet.</p>
			<p class="mt-2 text-center text-sm text-gray-500">Complete a workout to see it here.</p>
		</Card>
	{:else}
		<div class="space-y-2">
			{#each data.workouts as workout}
				<a href="/history/{workout.id}" class="block">
					<Card class="px-4 py-3 dark:bg-gray-800">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<p class="font-medium text-white">{workout.workoutDay.name}</p>
									<span class="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
										{workout.completedExercises.length} exercises
									</span>
								</div>
								<p class="text-sm text-gray-400">
									{workout.workoutDay.workoutWeek.workoutPlan.name}
								</p>
								<div class="mt-1 flex gap-4 text-xs text-gray-500">
									<span>{formatDate(workout.completedAt!)}</span>
									<span>{getDuration(workout)} min</span>
									<span>{getVolume(workout)} kg</span>
								</div>
							</div>
							<ChevronRightOutline class="h-4 w-4 text-gray-500" />
						</div>
					</Card>
				</a>
			{/each}
		</div>
	{/if}
</div>
