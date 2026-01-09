import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { validateSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user } = await parent();

	const plan = await prisma.workoutPlan.findUnique({
		where: { id: params.planId },
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

	if (!plan || plan.userId !== user!.id) {
		error(404, 'Plan not found');
	}

	return { plan };
};

export const actions: Actions = {
	addWeek: async ({ params, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });
		const plan = await prisma.workoutPlan.findUnique({
			where: { id: params.planId },
			include: { weeks: true }
		});

		if (!plan || plan.userId !== user!.id) {
			return fail(404, { error: 'Plan not found' });
		}

		const weekNumber = plan.weeks.length + 1;
		await prisma.workoutWeek.create({
			data: {
				name: `Week ${weekNumber}`,
				weekOrder: plan.weeks.length,
				workoutPlanId: plan.id
			}
		});

		return { success: true };
	},

	addDay: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });
		const data = await request.formData();
		const weekId = data.get('weekId')?.toString();
		const dayName = data.get('dayName')?.toString().trim();

		if (!weekId || !dayName) {
			return fail(400, { error: 'Week ID and day name are required' });
		}

		const week = await prisma.workoutWeek.findUnique({
			where: { id: weekId },
			include: { workoutPlan: true, days: true }
		});

		if (!week || week.workoutPlan.userId !== user!.id) {
			return fail(404, { error: 'Week not found' });
		}

		await prisma.workoutDay.create({
			data: {
				name: dayName,
				dayOrder: week.days.length,
				workoutWeekId: weekId
			}
		});

		return { success: true };
	},

	deleteDay: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });
		const data = await request.formData();
		const dayId = data.get('dayId')?.toString();

		if (!dayId) {
			return fail(400, { error: 'Day ID is required' });
		}

		const day = await prisma.workoutDay.findUnique({
			where: { id: dayId },
			include: { workoutWeek: { include: { workoutPlan: true } } }
		});

		if (!day || day.workoutWeek.workoutPlan.userId !== user!.id) {
			return fail(404, { error: 'Day not found' });
		}

		await prisma.workoutDay.delete({ where: { id: dayId } });

		return { success: true };
	},

	deleteWeek: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });
		const data = await request.formData();
		const weekId = data.get('weekId')?.toString();

		if (!weekId) {
			return fail(400, { error: 'Week ID is required' });
		}

		const week = await prisma.workoutWeek.findUnique({
			where: { id: weekId },
			include: { workoutPlan: true }
		});

		if (!week || week.workoutPlan.userId !== user!.id) {
			return fail(404, { error: 'Week not found' });
		}

		await prisma.workoutWeek.delete({ where: { id: weekId } });

		return { success: true };
	},

	deletePlan: async ({ params, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });

		const plan = await prisma.workoutPlan.findUnique({
			where: { id: params.planId }
		});

		if (!plan || plan.userId !== user!.id) {
			return fail(404, { error: 'Plan not found' });
		}

		await prisma.workoutPlan.delete({ where: { id: params.planId } });

		redirect(302, '/plans');
	},

	cloneWeek: async ({ request, params, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });

		const data = await request.formData();
		const weekId = data.get('weekId')?.toString();

		if (!weekId) {
			return fail(400, { error: 'Week ID is required' });
		}

		// Get source week with all days and exercises
		const sourceWeek = await prisma.workoutWeek.findUnique({
			where: { id: weekId },
			include: {
				workoutPlan: true,
				days: {
					orderBy: { dayOrder: 'asc' },
					include: {
						plannedExercises: {
							orderBy: { exerciseOrder: 'asc' }
						}
					}
				}
			}
		});

		if (!sourceWeek || sourceWeek.workoutPlan.userId !== user.id) {
			return fail(404, { error: 'Week not found' });
		}

		// Get current week count for naming
		const weekCount = await prisma.workoutWeek.count({
			where: { workoutPlanId: params.planId }
		});

		// Create new week with all days and exercises
		await prisma.workoutWeek.create({
			data: {
				name: `Week ${weekCount + 1}`,
				weekOrder: weekCount,
				workoutPlanId: params.planId!,
				days: {
					create: sourceWeek.days.map((day) => ({
						name: day.name,
						dayOrder: day.dayOrder,
						plannedExercises: {
							create: day.plannedExercises.map((exercise) => ({
								exerciseOrder: exercise.exerciseOrder,
								targetSets: exercise.targetSets,
								targetReps: exercise.targetReps,
								targetWeight: exercise.targetWeight,
								restSeconds: exercise.restSeconds,
								notes: exercise.notes,
								exerciseTemplateId: exercise.exerciseTemplateId
							}))
						}
					}))
				}
			}
		});

		return { success: true };
	}
};
