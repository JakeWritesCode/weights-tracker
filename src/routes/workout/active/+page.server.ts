import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { validateSession } from '$lib/server/auth';
import { getLastTimeForExercises } from '$lib/server/queries/exercises';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	// Get active workout session
	const session = await prisma.workoutSession.findFirst({
		where: {
			userId: user!.id,
			completedAt: null
		},
		include: {
			workoutDay: {
				include: {
					plannedExercises: {
						orderBy: { exerciseOrder: 'asc' },
						include: {
							exerciseTemplate: true
						}
					}
				}
			},
			completedExercises: {
				include: {
					exerciseTemplate: true,
					sets: {
						orderBy: { setNumber: 'asc' }
					}
				}
			}
		}
	});

	if (!session) {
		redirect(302, '/workout');
	}

	// Get last time data for all exercises
	const templateIds = session.workoutDay.plannedExercises.map((e) => e.exerciseTemplateId);
	const lastTimeData = await getLastTimeForExercises(user!.id, templateIds, session.id);

	// Convert Map to plain object for serialization
	const lastTimeMap: Record<
		string,
		{ sessionDate: string; sets: { setNumber: number; weight: number; reps: number }[] }
	> = {};
	lastTimeData.forEach((value, key) => {
		lastTimeMap[key] = {
			sessionDate: value.sessionDate.toISOString(),
			sets: value.sets
		};
	});

	return {
		session,
		plannedExercises: session.workoutDay.plannedExercises,
		completedExercises: session.completedExercises,
		lastTimeMap
	};
};

export const actions: Actions = {
	saveExercise: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });

		const data = await request.formData();
		const sessionId = data.get('sessionId')?.toString();
		const exerciseTemplateId = data.get('exerciseTemplateId')?.toString();
		const setsJson = data.get('sets')?.toString();

		if (!sessionId || !exerciseTemplateId || !setsJson) {
			return fail(400, { error: 'Missing required fields' });
		}

		// Verify session belongs to user
		const session = await prisma.workoutSession.findUnique({
			where: { id: sessionId }
		});

		if (!session || session.userId !== user.id) {
			return fail(404, { error: 'Session not found' });
		}

		// Parse sets
		let sets: { setNumber: number; weight: number; reps: number }[];
		try {
			sets = JSON.parse(setsJson);
		} catch {
			return fail(400, { error: 'Invalid sets data' });
		}

		// Find or create completed exercise
		let completedExercise = await prisma.completedExercise.findFirst({
			where: {
				sessionId: sessionId,
				exerciseTemplateId
			}
		});

		if (completedExercise) {
			// Delete existing sets and recreate
			await prisma.completedSet.deleteMany({
				where: { completedExerciseId: completedExercise.id }
			});
		} else {
			// Get exercise count for ordering
			const existingCount = await prisma.completedExercise.count({
				where: { sessionId: sessionId }
			});
			completedExercise = await prisma.completedExercise.create({
				data: {
					sessionId: sessionId,
					exerciseTemplateId,
					exerciseOrder: existingCount
				}
			});
		}

		// Create sets
		if (sets.length > 0) {
			await prisma.completedSet.createMany({
				data: sets.map((s) => ({
					completedExerciseId: completedExercise.id,
					setNumber: s.setNumber,
					weight: s.weight,
					reps: s.reps
				}))
			});
		}

		return { success: true };
	},

	completeWorkout: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });

		const data = await request.formData();
		const sessionId = data.get('sessionId')?.toString();

		if (!sessionId) {
			return fail(400, { error: 'Session ID required' });
		}

		const session = await prisma.workoutSession.findUnique({
			where: { id: sessionId }
		});

		if (!session || session.userId !== user.id) {
			return fail(404, { error: 'Session not found' });
		}

		await prisma.workoutSession.update({
			where: { id: sessionId },
			data: { completedAt: new Date() }
		});

		redirect(302, '/workout/active/complete');
	},

	skipExercise: async ({ request, cookies }) => {
		const user = await validateSession(cookies);
		if (!user) return fail(401, { error: 'Unauthorized' });

		// Just returns success - the UI handles advancing to next exercise
		return { success: true, skipped: true };
	}
};
