import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const workouts = await prisma.workoutSession.findMany({
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
					sets: true
				}
			}
		}
	});

	return { workouts };
};
