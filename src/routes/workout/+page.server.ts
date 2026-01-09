import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { validateSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const plans = await prisma.workoutPlan.findMany({
		where: { userId: user!.id },
		orderBy: { createdAt: 'desc' },
		include: {
			weeks: {
				orderBy: { weekOrder: 'asc' },
				include: {
					days: {
						orderBy: { dayOrder: 'asc' },
						include: {
							_count: {
								select: { plannedExercises: true }
							}
						}
					}
				}
			}
		}
	});

	// Check for any active workout session
	const activeSession = await prisma.workoutSession.findFirst({
		where: {
			userId: user!.id,
			completedAt: null
		},
		include: {
			workoutDay: {
				include: {
					workoutWeek: {
						include: { workoutPlan: true }
					}
				}
			}
		}
	});

	return { plans, activeSession };
};

export const actions: Actions = {
	startWorkout: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });

		const data = await request.formData();
		const dayId = data.get('dayId')?.toString();

		if (!dayId) {
			return fail(400, { error: 'Day ID is required' });
		}

		// Verify the day belongs to this user
		const day = await prisma.workoutDay.findUnique({
			where: { id: dayId },
			include: {
				workoutWeek: { include: { workoutPlan: true } },
				plannedExercises: true
			}
		});

		if (!day || day.workoutWeek.workoutPlan.userId !== user.id) {
			return fail(404, { error: 'Day not found' });
		}

		if (day.plannedExercises.length === 0) {
			return fail(400, { error: 'This day has no exercises' });
		}

		// Check if there's already an active session
		const existingSession = await prisma.workoutSession.findFirst({
			where: {
				userId: user.id,
				completedAt: null
			}
		});

		if (existingSession) {
			// Resume the existing session
			redirect(302, '/workout/active');
		}

		// Create new workout session
		await prisma.workoutSession.create({
			data: {
				userId: user.id,
				workoutDayId: dayId,
				workoutPlanId: day.workoutWeek.workoutPlan.id
			}
		});

		redirect(302, '/workout/active');
	},

	resumeWorkout: async ({ cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });

		const session = await prisma.workoutSession.findFirst({
			where: {
				userId: user.id,
				completedAt: null
			}
		});

		if (!session) {
			return fail(404, { error: 'No active workout' });
		}

		redirect(302, '/workout/active');
	},

	cancelWorkout: async ({ cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });

		// Delete the active session and all its data
		await prisma.workoutSession.deleteMany({
			where: {
				userId: user.id,
				completedAt: null
			}
		});

		return { success: true };
	}
};
