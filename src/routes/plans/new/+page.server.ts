import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/server/db';
import { validateSession } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) redirect(302, '/login');
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const description = data.get('description')?.toString().trim() || null;

		if (!name) {
			return fail(400, { error: 'Plan name is required', name, description });
		}

		const plan = await prisma.workoutPlan.create({
			data: {
				name,
				description,
				userId: user!.id,
				// Create a default first week
				weeks: {
					create: {
						name: 'Week 1',
						weekOrder: 0
					}
				}
			}
		});

		redirect(302, `/plans/${plan.id}`);
	}
};
