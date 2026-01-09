import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	// Get recent workouts (last 5)
	const recentWorkouts = await prisma.workoutSession.findMany({
		where: {
			userId: user!.id,
			completedAt: { not: null }
		},
		orderBy: { completedAt: 'desc' },
		take: 5,
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

	// Get this week's stats
	const startOfWeek = new Date();
	startOfWeek.setHours(0, 0, 0, 0);
	startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

	const weekWorkouts = await prisma.workoutSession.findMany({
		where: {
			userId: user!.id,
			completedAt: {
				not: null,
				gte: startOfWeek
			}
		},
		include: {
			completedExercises: {
				include: { sets: true }
			}
		}
	});

	const weeklyStats = {
		workouts: weekWorkouts.length,
		volume: Math.round(
			weekWorkouts.reduce(
				(acc, session) =>
					acc +
					session.completedExercises.reduce(
						(eAcc, exercise) =>
							eAcc + exercise.sets.reduce((sAcc, set) => sAcc + set.weight * set.reps, 0),
						0
					),
				0
			)
		)
	};

	// Get user's current plan (most recent)
	const currentPlan = await prisma.workoutPlan.findFirst({
		where: { userId: user!.id },
		orderBy: { createdAt: 'desc' }
	});

	// Figure out "next day" based on last workout
	let nextDay: {
		id: string;
		name: string;
		weekName: string;
		planName: string;
		planId: string;
		exerciseCount: number;
	} | null = null;

	if (recentWorkouts.length > 0) {
		const lastWorkout = recentWorkouts[0];
		const lastDay = lastWorkout.workoutDay;
		const lastWeek = lastDay.workoutWeek;
		const planId = lastWeek.workoutPlan.id;

		// Get the full plan structure to find next day
		const plan = await prisma.workoutPlan.findUnique({
			where: { id: planId },
			include: {
				weeks: {
					orderBy: { weekOrder: 'asc' },
					include: {
						days: {
							orderBy: { dayOrder: 'asc' },
							include: {
								_count: { select: { plannedExercises: true } }
							}
						}
					}
				}
			}
		});

		if (plan) {
			// Find current position and get next day
			let foundCurrent = false;
			outer: for (const week of plan.weeks) {
				for (const day of week.days) {
					if (foundCurrent && day._count.plannedExercises > 0) {
						nextDay = {
							id: day.id,
							name: day.name,
							weekName: week.name,
							planName: plan.name,
							planId: plan.id,
							exerciseCount: day._count.plannedExercises
						};
						break outer;
					}
					if (day.id === lastDay.id) {
						foundCurrent = true;
					}
				}
			}

			// If no next day found (end of plan), wrap to first day
			if (!nextDay && plan.weeks.length > 0) {
				const firstWeek = plan.weeks[0];
				const firstDay = firstWeek.days.find((d) => d._count.plannedExercises > 0);
				if (firstDay) {
					nextDay = {
						id: firstDay.id,
						name: firstDay.name,
						weekName: firstWeek.name,
						planName: plan.name,
						planId: plan.id,
						exerciseCount: firstDay._count.plannedExercises
					};
				}
			}
		}
	}

	return {
		recentWorkouts,
		weeklyStats,
		currentPlan,
		nextDay
	};
};
