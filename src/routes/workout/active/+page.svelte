<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card, Progressbar } from 'flowbite-svelte';
	import { PlusOutline, TrashBinSolid, ChevronRightOutline, CheckOutline } from 'flowbite-svelte-icons';

	let { data } = $props();

	// Track current exercise index
	let currentIndex = $state(0);

	// Initialize sets from saved data or last time data
	let sets = $state<{ weight: number; reps: number }[]>([]);

	// Current planned exercise
	let currentPlanned = $derived(data.plannedExercises[currentIndex]);
	let currentTemplate = $derived(currentPlanned?.exerciseTemplate);
	let lastTime = $derived(currentTemplate ? data.lastTimeMap[currentTemplate.id] : null);

	// Check if current exercise has been saved
	let savedExercise = $derived(
		data.completedExercises.find((e) => e.exerciseTemplateId === currentTemplate?.id)
	);

	// Progress
	let totalExercises = $derived(data.plannedExercises.length);
	let completedCount = $derived(data.completedExercises.length);
	let progress = $derived(totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0);

	// Initialize sets when exercise changes
	$effect(() => {
		if (currentTemplate) {
			if (savedExercise && savedExercise.sets.length > 0) {
				// Load saved sets
				sets = savedExercise.sets.map((s) => ({ weight: s.weight, reps: s.reps }));
			} else if (lastTime && lastTime.sets.length > 0) {
				// Pre-fill from last time
				sets = lastTime.sets.map((s) => ({ weight: s.weight, reps: s.reps }));
			} else {
				// Default sets based on target
				const targetSets = currentPlanned?.targetSets || 3;
				const targetReps = currentPlanned?.targetReps || 10;
				sets = Array(targetSets)
					.fill(null)
					.map(() => ({ weight: 0, reps: targetReps }));
			}
		}
	});

	function addSet() {
		const lastSet = sets[sets.length - 1];
		sets = [...sets, { weight: lastSet?.weight || 0, reps: lastSet?.reps || 10 }];
	}

	function removeSet(index: number) {
		sets = sets.filter((_, i) => i !== index);
	}

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		const now = new Date();
		const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
		return date.toLocaleDateString();
	}

	function goToExercise(index: number) {
		if (index >= 0 && index < totalExercises) {
			currentIndex = index;
		}
	}

	let saving = $state(false);
</script>

<PageHeader title={data.session.workoutDay.name} backHref="/workout" />

<div class="flex flex-col p-4" style="min-height: calc(100vh - 8rem);">
	<!-- Progress -->
	<div class="mb-4">
		<div class="mb-1 flex justify-between text-sm text-gray-400">
			<span>Exercise {currentIndex + 1} of {totalExercises}</span>
			<span>{completedCount} completed</span>
		</div>
		<Progressbar {progress} color="blue" size="h-2" />
	</div>

	{#if currentPlanned && currentTemplate}
		<!-- Exercise Card -->
		<Card class="mb-4 px-4 py-4 dark:bg-gray-800">
			<h2 class="text-xl font-bold text-white">{currentTemplate.name}</h2>
			{#if currentTemplate.muscleGroup}
				<p class="text-sm text-gray-500">{currentTemplate.muscleGroup}</p>
			{/if}
			<p class="mt-1 text-gray-400">
				Target: {currentPlanned.targetSets} sets × {currentPlanned.targetReps} reps
			</p>
		</Card>

		<!-- Last Time -->
		{#if lastTime}
			<div class="mb-4 rounded-lg bg-gray-800/50 px-4 py-3">
				<p class="mb-1 text-sm text-gray-500">Last time ({formatDate(lastTime.sessionDate)})</p>
				<p class="text-sm text-gray-300">
					{lastTime.sets.map((s) => `${s.weight}kg × ${s.reps}`).join(', ')}
				</p>
			</div>
		{/if}

		<!-- Sets Entry -->
		<div class="mb-4 flex-1">
			<div class="mb-2 grid grid-cols-12 gap-2 text-sm text-gray-400">
				<div class="col-span-2 text-center">Set</div>
				<div class="col-span-4 text-center">Weight (kg)</div>
				<div class="col-span-4 text-center">Reps</div>
				<div class="col-span-2"></div>
			</div>

			{#each sets as _, index}
				<div class="mb-2 grid grid-cols-12 items-center gap-2">
					<div class="col-span-2 text-center">
						<span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-sm text-white">
							{index + 1}
						</span>
					</div>
					<div class="col-span-4">
						<input
							type="number"
							step="0.5"
							min="0"
							max="500"
							bind:value={sets[index].weight}
							class="w-full rounded bg-gray-700 px-3 py-2 text-center text-white"
						/>
					</div>
					<div class="col-span-4">
						<input
							type="number"
							min="1"
							max="100"
							bind:value={sets[index].reps}
							class="w-full rounded bg-gray-700 px-3 py-2 text-center text-white"
						/>
					</div>
					<div class="col-span-2 flex justify-center">
						{#if sets.length > 1}
							<button
								type="button"
								onclick={() => removeSet(index)}
								class="text-gray-500 hover:text-red-400"
							>
								<TrashBinSolid class="h-4 w-4" />
							</button>
						{/if}
					</div>
				</div>
			{/each}

			<button
				type="button"
				onclick={addSet}
				class="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-600 px-3 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-300"
			>
				<PlusOutline class="h-4 w-4" />
				Add Set
			</button>
		</div>

		<!-- Navigation dots -->
		<div class="mb-4 flex justify-center gap-2">
			{#each data.plannedExercises as _, i}
				<button
					type="button"
					onclick={() => goToExercise(i)}
					class="h-2 w-2 rounded-full transition-all {i === currentIndex
						? 'w-6 bg-blue-500'
						: data.completedExercises.find(
									(e) => e.exerciseTemplateId === data.plannedExercises[i].exerciseTemplateId
							  )
							? 'bg-green-500'
							: 'bg-gray-600'}"
				></button>
			{/each}
		</div>

		<!-- Action Buttons -->
		<div class="space-y-2">
			<form
				method="POST"
				action="?/saveExercise"
				use:enhance={() => {
					saving = true;
					return async ({ update }) => {
						await update();
						saving = false;
						// Move to next exercise if not at the end
						if (currentIndex < totalExercises - 1) {
							currentIndex++;
						}
						invalidateAll();
					};
				}}
			>
				<input type="hidden" name="sessionId" value={data.session.id} />
				<input type="hidden" name="exerciseTemplateId" value={currentTemplate.id} />
				<input
					type="hidden"
					name="sets"
					value={JSON.stringify(sets.map((s, i) => ({ setNumber: i + 1, ...s })))}
				/>
				<button
					type="submit"
					disabled={saving || sets.length === 0}
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{#if currentIndex === totalExercises - 1}
						<CheckOutline class="h-5 w-5" />
						Save & Finish
					{:else}
						<ChevronRightOutline class="h-5 w-5" />
						{saving ? 'Saving...' : 'Save & Next'}
					{/if}
				</button>
			</form>

			{#if currentIndex === totalExercises - 1 && completedCount === totalExercises}
				<form method="POST" action="?/completeWorkout" use:enhance>
					<input type="hidden" name="sessionId" value={data.session.id} />
					<button
						type="submit"
						class="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
					>
						<CheckOutline class="h-5 w-5" />
						Complete Workout
					</button>
				</form>
			{/if}

			<button
				type="button"
				onclick={() => {
					if (currentIndex < totalExercises - 1) currentIndex++;
				}}
				disabled={currentIndex >= totalExercises - 1}
				class="w-full rounded-lg bg-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 disabled:opacity-50"
			>
				Skip Exercise
			</button>
		</div>
	{:else}
		<Card class="px-4 py-6 dark:bg-gray-800">
			<p class="text-center text-gray-400">No exercises found.</p>
		</Card>
	{/if}
</div>
