import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { validateSession } from '$lib/server/auth';

const PUBLIC_ROUTES = ['/login', '/register'];

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const user = await validateSession(cookies);

	// Allow public routes without auth
	if (PUBLIC_ROUTES.some((route) => url.pathname.startsWith(route))) {
		return { user };
	}

	// Redirect to login if not authenticated
	if (!user) {
		redirect(302, '/login');
	}

	return { user };
};
