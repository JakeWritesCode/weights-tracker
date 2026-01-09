<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Button, Card } from 'flowbite-svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';
</script>

<PageHeader title="Workout Plans">
	{#snippet action()}
		<Button href="/plans/new" size="sm" color="primary">
			<PlusSolid class="mr-1 h-4 w-4" />
			New
		</Button>
	{/snippet}
</PageHeader>

<div class="p-4">
	<Card class="dark:bg-gray-800">
		<p class="text-center text-gray-400">
			No workout plans yet.<br />
			Create your first plan to get started!
		</p>
	</Card>
</div>
