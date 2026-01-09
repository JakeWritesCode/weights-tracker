<script lang="ts">
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		backHref?: string;
		action?: Snippet;
	}

	let { title, backHref, action }: Props = $props();
</script>

<header class="sticky top-0 z-10 border-b border-gray-700 bg-gray-900 px-4 py-3">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			{#if backHref}
				<a
					href={backHref}
					class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
				>
					<ArrowLeftOutline class="h-5 w-5" />
				</a>
			{/if}
			<h1 class="text-lg font-semibold text-white">{title}</h1>
		</div>
		{#if action}
			<div>
				{@render action()}
			</div>
		{/if}
	</div>
</header>
