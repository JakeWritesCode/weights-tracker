import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { validateSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user } = await parent();

	const day = await prisma.workoutDay.findUnique({
		where: { id: params.dayId },
		include: {
			workoutWeek: {
				include: {
					workoutPlan: true
				}
			},
			plannedExercises: {
				orderBy: { exerciseOrder: 'asc' },
				include: {
					exerciseTemplate: true
				}
			}
		}
	});

	if (!day || day.workoutWeek.workoutPlan.userId !== user!.id) {
		error(404, 'Day not found');
	}

	// Get all exercise templates for the selector
	const exerciseTemplates = await prisma.exerciseTemplate.findMany({
		orderBy: { name: 'asc' }
	});

	return {
		day,
		plan: day.workoutWeek.workoutPlan,
		exerciseTemplates
	};
};

export const actions: Actions = {
	addExercise: async ({ request, params, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });
		const data = await request.formData();
		const exerciseTemplateId = data.get('exerciseTemplateId')?.toString();
		const targetSets = parseInt(data.get('targetSets')?.toString() || '3');
		const targetReps = parseInt(data.get('targetReps')?.toString() || '10');

		if (!exerciseTemplateId) {
			return fail(400, { error: 'Exercise is required' });
		}

		const day = await prisma.workoutDay.findUnique({
			where: { id: params.dayId },
			include: {
				workoutWeek: { include: { workoutPlan: true } },
				plannedExercises: true
			}
		});

		if (!day || day.workoutWeek.workoutPlan.userId !== user!.id) {
			return fail(404, { error: 'Day not found' });
		}

		await prisma.plannedExercise.create({
			data: {
				exerciseOrder: day.plannedExercises.length,
				targetSets,
				targetReps,
				workoutDayId: params.dayId,
				exerciseTemplateId
			}
		});

		return { success: true };
	},

	updateExercise: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });
		const data = await request.formData();
		const exerciseId = data.get('exerciseId')?.toString();
		const targetSets = parseInt(data.get('targetSets')?.toString() || '3');
		const targetReps = parseInt(data.get('targetReps')?.toString() || '10');

		if (!exerciseId) {
			return fail(400, { error: 'Exercise ID is required' });
		}

		const exercise = await prisma.plannedExercise.findUnique({
			where: { id: exerciseId },
			include: {
				workoutDay: {
					include: {
						workoutWeek: { include: { workoutPlan: true } }
					}
				}
			}
		});

		if (!exercise || exercise.workoutDay.workoutWeek.workoutPlan.userId !== user!.id) {
			return fail(404, { error: 'Exercise not found' });
		}

		await prisma.plannedExercise.update({
			where: { id: exerciseId },
			data: { targetSets, targetReps }
		});

		return { success: true };
	},

	deleteExercise: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });
		const data = await request.formData();
		const exerciseId = data.get('exerciseId')?.toString();

		if (!exerciseId) {
			return fail(400, { error: 'Exercise ID is required' });
		}

		const exercise = await prisma.plannedExercise.findUnique({
			where: { id: exerciseId },
			include: {
				workoutDay: {
					include: {
						workoutWeek: { include: { workoutPlan: true } }
					}
				}
			}
		});

		if (!exercise || exercise.workoutDay.workoutWeek.workoutPlan.userId !== user!.id) {
			return fail(404, { error: 'Exercise not found' });
		}

		await prisma.plannedExercise.delete({ where: { id: exerciseId } });

		return { success: true };
	},

	createExerciseTemplate: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const muscleGroup = data.get('muscleGroup')?.toString().trim() || null;

		if (!name) {
			return fail(400, { error: 'Exercise name is required' });
		}

		const template = await prisma.exerciseTemplate.create({
			data: { name, muscleGroup }
		});

		return { success: true, templateId: template.id };
	}
};
