<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Input, Label, Card, Alert } from 'flowbite-svelte';

	let { form } = $props();
</script>

<PageHeader title="New Plan" backHref="/plans" />

<div class="p-4">
	<Card class="px-4 py-4 dark:bg-gray-800">
		{#if form?.error}
			<Alert color="red" class="mb-4">{form.error}</Alert>
		{/if}

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<Label for="name" class="mb-2 text-white">Plan Name</Label>
				<Input
					id="name"
					name="name"
					type="text"
					placeholder="e.g. Push Pull Legs"
					required
					value={form?.name ?? ''}
					class="dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<Label for="description" class="mb-2 text-white">Description (optional)</Label>
				<Input
					id="description"
					name="description"
					type="text"
					placeholder="e.g. 3-day split focusing on compound movements"
					value={form?.description ?? ''}
					class="dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
			>
				Create Plan
			</button>
		</form>
	</Card>
</div>
