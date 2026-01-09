import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user } = await parent();

	const session = await prisma.workoutSession.findUnique({
		where: { id: params.sessionId },
		include: {
			workoutDay: {
				include: {
					workoutWeek: {
						include: { workoutPlan: true }
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

	if (!session || session.userId !== user!.id) {
		error(404, 'Workout not found');
	}

	// Calculate stats
	const totalSets = session.completedExercises.reduce((acc, e) => acc + e.sets.length, 0);
	const totalVolume = session.completedExercises.reduce(
		(acc, e) => acc + e.sets.reduce((setAcc, s) => setAcc + s.weight * s.reps, 0),
		0
	);
	const totalReps = session.completedExercises.reduce(
		(acc, e) => acc + e.sets.reduce((setAcc, s) => setAcc + s.reps, 0),
		0
	);

	const durationMs = session.completedAt
		? session.completedAt.getTime() - session.startedAt.getTime()
		: 0;
	const durationMins = Math.round(durationMs / 60000);

	return {
		session,
		stats: {
			totalExercises: session.completedExercises.length,
			totalSets,
			totalReps,
			totalVolume: Math.round(totalVolume),
			durationMins
		}
	};
};
