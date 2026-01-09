import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const plans = await prisma.workoutPlan.findMany({
		where: { userId: user!.id },
		include: {
			weeks: {
				include: {
					days: {
						include: {
							_count: {
								select: { plannedExercises: true }
							}
						}
					}
				}
			}
		},
		orderBy: { createdAt: 'desc' }
	});

	return { plans };
};
