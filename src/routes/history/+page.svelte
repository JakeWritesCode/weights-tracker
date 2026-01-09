<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card } from 'flowbite-svelte';
</script>

<PageHeader title="Workout History" />

<div class="p-4">
	<Card class="px-4 py-2 dark:bg-gray-800">
		<p class="text-center text-gray-400">
			No workout history yet.<br />
			Complete your first workout to see it here!
		</p>
	</Card>
</div>
