import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { verifyPassword, createSession, validateSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await validateSession(cookies);
	if (user) {
		redirect(302, '/dashboard');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return fail(400, { error: 'Invalid email or password', email });
		}

		const valid = await verifyPassword(password, user.passwordHash);
		if (!valid) {
			return fail(400, { error: 'Invalid email or password', email });
		}

		await createSession(user.id, cookies);
		redirect(302, '/dashboard');
	}
};
