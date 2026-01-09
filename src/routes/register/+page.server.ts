import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { hashPassword, createSession, validateSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await validateSession(cookies);
	if (user) {
		redirect(302, '/dashboard');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const email = data.get('email')?.toString().trim().toLowerCase();
		const password = data.get('password')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		if (!name || !email || !password || !confirmPassword) {
			return fail(400, { error: 'All fields are required', name, email });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', name, email });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', name, email });
		}

		// Check if email already exists
		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return fail(400, { error: 'An account with this email already exists', name, email });
		}

		// Create user
		const passwordHash = await hashPassword(password);
		const user = await prisma.user.create({
			data: {
				name,
				email,
				passwordHash
			}
		});

		// Create session and redirect
		await createSession(user.id, cookies);
		redirect(302, '/dashboard');
	}
};
