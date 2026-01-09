<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Card } from 'flowbite-svelte';
</script>

<PageHeader title="Start Workout" />

<div class="p-4">
	<Card class="dark:bg-gray-800">
		<p class="text-center text-gray-400">
			No workout plans yet.<br />
			Create a plan first to start tracking your workouts.
		</p>
	</Card>
</div>
