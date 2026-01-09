<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card, Modal, Input, Label } from 'flowbite-svelte';
	import {
		PlusOutline,
		ChevronRightOutline,
		TrashBinSolid,
		CopyOutline
	} from 'flowbite-svelte-icons';

	let { data } = $props();

	let showAddDayModal = $state(false);
	let selectedWeekId = $state<string | null>(null);
	let newDayName = $state('');

	function openAddDayModal(weekId: string) {
		selectedWeekId = weekId;
		newDayName = '';
		showAddDayModal = true;
	}
</script>

<PageHeader title={data.plan.name} backHref="/plans">
	{#snippet action()}
		<form method="POST" action="?/deletePlan" use:enhance>
			<button
				type="submit"
				class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400"
				onclick={(e) => {
					if (!confirm('Delete this plan?')) e.preventDefault();
				}}
			>
				<TrashBinSolid class="h-5 w-5" />
			</button>
		</form>
	{/snippet}
</PageHeader>

<div class="space-y-4 p-4">
	{#if data.plan.description}
		<p class="text-sm text-gray-400">{data.plan.description}</p>
	{/if}

	{#each data.plan.weeks as week}
		<Card class="px-4 py-3 dark:bg-gray-800">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="font-semibold text-white">{week.name}</h3>
				<div class="flex items-center gap-2">
					<form method="POST" action="?/cloneWeek" use:enhance>
						<input type="hidden" name="weekId" value={week.id} />
						<button
							type="submit"
							class="text-gray-500 hover:text-blue-400"
							title="Clone week"
						>
							<CopyOutline class="h-4 w-4" />
						</button>
					</form>
					<form method="POST" action="?/deleteWeek" use:enhance>
						<input type="hidden" name="weekId" value={week.id} />
						<button
							type="submit"
							class="text-gray-500 hover:text-red-400"
							onclick={(e) => {
								if (!confirm('Delete this week and all its days?')) e.preventDefault();
							}}
						>
							<TrashBinSolid class="h-4 w-4" />
						</button>
					</form>
				</div>
			</div>

			{#if week.days.length === 0}
				<p class="mb-3 text-sm text-gray-500">No days yet</p>
			{:else}
				<div class="mb-3 space-y-2">
					{#each week.days as day}
						<a
							href="/plans/{data.plan.id}/days/{day.id}"
							class="flex items-center justify-between rounded-lg bg-gray-700 px-3 py-2 hover:bg-gray-600"
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
						</a>
					{/each}
				</div>
			{/if}

			<button
				type="button"
				onclick={() => openAddDayModal(week.id)}
				class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-600 px-3 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-300"
			>
				<PlusOutline class="h-4 w-4" />
				Add Day
			</button>
		</Card>
	{/each}

	<form method="POST" action="?/addWeek" use:enhance>
		<button
			type="submit"
			class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-600 px-4 py-3 text-gray-400 hover:border-gray-500 hover:text-gray-300"
		>
			<PlusOutline class="h-5 w-5" />
			Add Week
		</button>
	</form>
</div>

<Modal title="Add Day" bind:open={showAddDayModal} size="xs" class="dark:bg-gray-800">
	<form method="POST" action="?/addDay" use:enhance onsubmit={() => (showAddDayModal = false)}>
		<input type="hidden" name="weekId" value={selectedWeekId} />
		<div class="mb-4">
			<Label for="dayName" class="mb-2 text-white">Day Name</Label>
			<Input
				id="dayName"
				name="dayName"
				type="text"
				placeholder="e.g. Push, Pull, Legs"
				required
				bind:value={newDayName}
				class="dark:bg-gray-700 dark:text-white"
			/>
		</div>
		<button
			type="submit"
			class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
		>
			Add Day
		</button>
	</form>
</Modal>
