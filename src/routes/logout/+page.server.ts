import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { destroySession } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	redirect(302, '/login');
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		await destroySession(cookies);
		redirect(302, '/login');
	}
};
