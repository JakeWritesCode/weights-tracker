import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	// Get the most recently completed workout
	const session = await prisma.workoutSession.findFirst({
		where: {
			userId: user!.id,
			completedAt: { not: null }
		},
		orderBy: { completedAt: 'desc' },
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

	if (!session) {
		redirect(302, '/workout');
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

	// Duration
	const startTime = session.startedAt;
	const endTime = session.completedAt!;
	const durationMs = endTime.getTime() - startTime.getTime();
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
