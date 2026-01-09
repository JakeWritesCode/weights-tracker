<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card } from 'flowbite-svelte';
	import { PlusOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

	let { data } = $props();
</script>

<PageHeader title="Workout Plans">
	{#snippet action()}
		<a
			href="/plans/new"
			class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
		>
			<PlusOutline class="h-5 w-5" />
		</a>
	{/snippet}
</PageHeader>

<div class="p-4">
	{#if data.plans.length === 0}
		<Card class="px-4 py-6 dark:bg-gray-800">
			<p class="text-center text-gray-400">
				No workout plans yet.<br />
				Create your first plan to get started!
			</p>
			<a
				href="/plans/new"
				class="mt-4 block w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
			>
				Create Plan
			</a>
		</Card>
	{:else}
		<div class="space-y-3">
			{#each data.plans as plan (plan.id)}
				{@const totalDays = plan.weeks.reduce((acc, week) => acc + week.days.length, 0)}
				{@const totalExercises = plan.weeks.reduce(
					(acc, week) =>
						acc + week.days.reduce((dayAcc, day) => dayAcc + day._count.plannedExercises, 0),
					0
				)}
				<a href="/plans/{plan.id}" class="block">
					<Card class="px-4 py-3 dark:bg-gray-800 hover:dark:bg-gray-750">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="font-semibold text-white">{plan.name}</h3>
								<p class="text-sm text-gray-400">
									{plan.weeks.length} week{plan.weeks.length !== 1 ? 's' : ''} · {totalDays} day{totalDays !== 1 ? 's' : ''} · {totalExercises} exercise{totalExercises !== 1 ? 's' : ''}
								</p>
							</div>
							<ChevronRightOutline class="h-5 w-5 text-gray-400" />
						</div>
					</Card>
				</a>
			{/each}

			<a
				href="/plans/new"
				class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-600 px-4 py-3 text-gray-400 hover:border-gray-500 hover:text-gray-300"
			>
				<PlusOutline class="h-5 w-5" />
				New Plan
			</a>
		</div>
	{/if}
</div>
