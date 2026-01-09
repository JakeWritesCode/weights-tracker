<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card, Modal, Input, Label, Select } from 'flowbite-svelte';
	import { PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';

	let { data } = $props();

	let showAddModal = $state(false);
	let showCreateModal = $state(false);
	let selectedTemplateId = $state('');
	let targetSets = $state(3);
	let targetReps = $state(10);
	let newExerciseName = $state('');
	let newMuscleGroup = $state('');

	function resetAddForm() {
		selectedTemplateId = '';
		targetSets = 3;
		targetReps = 10;
	}
</script>

<PageHeader title={data.day.name} backHref="/plans/{data.plan.id}" />

<div class="space-y-3 p-4">
	{#if data.day.plannedExercises.length === 0}
		<Card class="px-4 py-6 dark:bg-gray-800">
			<p class="text-center text-gray-400">No exercises yet. Add some to get started!</p>
		</Card>
	{:else}
		{#each data.day.plannedExercises as exercise, index}
			<Card class="px-4 py-3 dark:bg-gray-800">
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs text-gray-300">
								{index + 1}
							</span>
							<h3 class="font-medium text-white">{exercise.exerciseTemplate.name}</h3>
						</div>
						{#if exercise.exerciseTemplate.muscleGroup}
							<p class="ml-8 text-sm text-gray-500">{exercise.exerciseTemplate.muscleGroup}</p>
						{/if}
						<form method="POST" action="?/updateExercise" use:enhance class="ml-8 mt-2 flex items-center gap-2">
							<input type="hidden" name="exerciseId" value={exercise.id} />
							<div class="flex items-center gap-1">
								<input
									type="number"
									name="targetSets"
									value={exercise.targetSets}
									min="1"
									max="20"
									class="w-14 rounded bg-gray-700 px-2 py-1 text-center text-sm text-white"
								/>
								<span class="text-sm text-gray-400">sets</span>
							</div>
							<span class="text-gray-500">×</span>
							<div class="flex items-center gap-1">
								<input
									type="number"
									name="targetReps"
									value={exercise.targetReps}
									min="1"
									max="100"
									class="w-14 rounded bg-gray-700 px-2 py-1 text-center text-sm text-white"
								/>
								<span class="text-sm text-gray-400">reps</span>
							</div>
							<button type="submit" class="rounded bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-500">
								Save
							</button>
						</form>
					</div>
					<form method="POST" action="?/deleteExercise" use:enhance>
						<input type="hidden" name="exerciseId" value={exercise.id} />
						<button type="submit" class="text-gray-500 hover:text-red-400">
							<TrashBinSolid class="h-4 w-4" />
						</button>
					</form>
				</div>
			</Card>
		{/each}
	{/if}

	<button
		type="button"
		onclick={() => {
			resetAddForm();
			showAddModal = true;
		}}
		class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-600 px-4 py-3 text-gray-400 hover:border-gray-500 hover:text-gray-300"
	>
		<PlusOutline class="h-5 w-5" />
		Add Exercise
	</button>
</div>

<Modal title="Add Exercise" bind:open={showAddModal} size="xs" class="dark:bg-gray-800">
	<form
		method="POST"
		action="?/addExercise"
		use:enhance
		onsubmit={() => (showAddModal = false)}
		class="space-y-4"
	>
		<div>
			<Label for="exerciseTemplateId" class="mb-2 text-white">Exercise</Label>
			{#if data.exerciseTemplates.length === 0}
				<p class="text-sm text-gray-400">No exercises yet. Create one first!</p>
			{:else}
				<Select
					id="exerciseTemplateId"
					name="exerciseTemplateId"
					bind:value={selectedTemplateId}
					class="dark:bg-gray-700 dark:text-white"
					required
				>
					<option value="">Select an exercise</option>
					{#each data.exerciseTemplates as template}
						<option value={template.id}>{template.name}</option>
					{/each}
				</Select>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<Label for="targetSets" class="mb-2 text-white">Sets</Label>
				<Input
					id="targetSets"
					name="targetSets"
					type="number"
					min="1"
					max="20"
					bind:value={targetSets}
					class="dark:bg-gray-700 dark:text-white"
				/>
			</div>
			<div>
				<Label for="targetReps" class="mb-2 text-white">Reps</Label>
				<Input
					id="targetReps"
					name="targetReps"
					type="number"
					min="1"
					max="100"
					bind:value={targetReps}
					class="dark:bg-gray-700 dark:text-white"
				/>
			</div>
		</div>

		<button
			type="submit"
			disabled={!selectedTemplateId}
			class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
		>
			Add Exercise
		</button>
	</form>

	<div class="mt-4 border-t border-gray-700 pt-4">
		<button
			type="button"
			onclick={() => {
				showAddModal = false;
				showCreateModal = true;
			}}
			class="w-full text-center text-sm text-gray-400 hover:text-white"
		>
			+ Create new exercise
		</button>
	</div>
</Modal>

<Modal title="Create Exercise" bind:open={showCreateModal} size="xs" class="dark:bg-gray-800">
	<form
		method="POST"
		action="?/createExerciseTemplate"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					showCreateModal = false;
					showAddModal = true;
					newExerciseName = '';
					newMuscleGroup = '';
				}
				update();
			};
		}}
		class="space-y-4"
	>
		<div>
			<Label for="name" class="mb-2 text-white">Exercise Name</Label>
			<Input
				id="name"
				name="name"
				type="text"
				placeholder="e.g. Bench Press"
				required
				bind:value={newExerciseName}
				class="dark:bg-gray-700 dark:text-white"
			/>
		</div>

		<div>
			<Label for="muscleGroup" class="mb-2 text-white">Muscle Group (optional)</Label>
			<Input
				id="muscleGroup"
				name="muscleGroup"
				type="text"
				placeholder="e.g. Chest"
				bind:value={newMuscleGroup}
				class="dark:bg-gray-700 dark:text-white"
			/>
		</div>

		<button
			type="submit"
			class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
		>
			Create Exercise
		</button>
	</form>
</Modal>
