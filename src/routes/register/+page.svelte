<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Label, Card, Alert } from 'flowbite-svelte';

	let { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<Card class="w-full max-w-md px-4 py-2 dark:bg-gray-800">
		<h1 class="mb-6 text-center text-2xl font-bold text-white">Create Account</h1>

		{#if form?.error}
			<Alert color="red" class="mb-4">{form.error}</Alert>
		{/if}

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<Label for="name" class="mb-2 text-white">Name</Label>
				<Input
					id="name"
					name="name"
					type="text"
					placeholder="Your name"
					required
					value={form?.name ?? ''}
					class="dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<Label for="email" class="mb-2 text-white">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="you@example.com"
					required
					value={form?.email ?? ''}
					class="dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<Label for="password" class="mb-2 text-white">Password</Label>
				<Input
					id="password"
					name="password"
					type="password"
					required
					minlength={8}
					class="dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<Label for="confirmPassword" class="mb-2 text-white">Confirm Password</Label>
				<Input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					required
					minlength={8}
					class="dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
			>
				Create Account
			</button>
		</form>

		<a
			href="/login"
			class="mt-4 block w-full rounded-lg border border-gray-600 px-5 py-2.5 text-center text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
		>
			Sign In
		</a>
	</Card>
</div>
