<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card } from 'flowbite-svelte';
	import { PlayOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

	let { data } = $props();
</script>

<PageHeader title="Start Workout" />

<div class="space-y-4 p-4">
	{#if data.activeSession}
		<Card class="border-blue-500 px-4 py-4 dark:bg-gray-800">
			<h3 class="mb-2 font-semibold text-white">Workout in Progress</h3>
			<p class="mb-3 text-sm text-gray-400">
				{data.activeSession.workoutDay.workoutWeek.workoutPlan.name} -
				{data.activeSession.workoutDay.name}
			</p>
			<div class="flex gap-2">
				<form method="POST" action="?/resumeWorkout" use:enhance class="flex-1">
					<button
						type="submit"
						class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
					>
						<PlayOutline class="h-4 w-4" />
						Resume
					</button>
				</form>
				<form method="POST" action="?/cancelWorkout" use:enhance>
					<button
						type="submit"
						class="rounded-lg bg-gray-700 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-600"
						onclick={(e) => {
							if (!confirm('Cancel this workout? All progress will be lost.')) e.preventDefault();
						}}
					>
						Cancel
					</button>
				</form>
			</div>
		</Card>
	{/if}

	{#if data.plans.length === 0}
		<Card class="px-4 py-6 dark:bg-gray-800">
			<p class="mb-3 text-center text-gray-400">No workout plans yet.</p>
			<a
				href="/plans/new"
				class="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
			>
				Create a Plan
			</a>
		</Card>
	{:else}
		{#each data.plans as plan}
			<div>
				<h2 class="mb-2 text-lg font-semibold text-white">{plan.name}</h2>
				{#each plan.weeks as week}
					<Card class="mb-3 px-4 py-3 dark:bg-gray-800">
						<h3 class="mb-2 text-sm font-medium text-gray-400">{week.name}</h3>
						{#if week.days.length === 0}
							<p class="text-sm text-gray-500">No days configured</p>
						{:else}
							<div class="space-y-2">
								{#each week.days as day}
									<form method="POST" action="?/startWorkout" use:enhance>
										<input type="hidden" name="dayId" value={day.id} />
										<button
											type="submit"
											disabled={day._count.plannedExercises === 0 || !!data.activeSession}
											class="flex w-full items-center justify-between rounded-lg bg-gray-700 px-3 py-2.5 text-left hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
										>
											<div>
												<span class="text-white">{day.name}</span>
												<span class="ml-2 text-sm text-gray-400">
													{day._count.plannedExercises} exercise{day._count.plannedExercises !== 1
														? 's'
														: ''}
												</span>
											</div>
											<ChevronRightOutline class="h-4 w-4 text-gray-400" />
										</button>
									</form>
								{/each}
							</div>
						{/if}
					</Card>
				{/each}
			</div>
		{/each}
	{/if}
</div>
