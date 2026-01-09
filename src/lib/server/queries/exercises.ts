import { prisma } from '$lib/server/db';

export type LastTimeData = {
	sessionDate: Date;
	sets: {
		setNumber: number;
		weight: number;
		reps: number;
	}[];
};

/**
 * Get the last time a user performed an exercise (by template)
 * Returns the most recent completed exercise with all its sets
 */
export async function getLastTimeForExercise(
	userId: string,
	exerciseTemplateId: string,
	excludeSessionId?: string
): Promise<LastTimeData | null> {
	const lastExercise = await prisma.completedExercise.findFirst({
		where: {
			exerciseTemplateId,
			session: {
				userId,
				completedAt: { not: null },
				...(excludeSessionId ? { id: { not: excludeSessionId } } : {})
			}
		},
		orderBy: {
			session: { completedAt: 'desc' }
		},
		include: {
			session: {
				select: { completedAt: true }
			},
			sets: {
				orderBy: { setNumber: 'asc' }
			}
		}
	});

	if (!lastExercise || !lastExercise.session.completedAt) {
		return null;
	}

	return {
		sessionDate: lastExercise.session.completedAt,
		sets: lastExercise.sets.map((s) => ({
			setNumber: s.setNumber,
			weight: s.weight,
			reps: s.reps
		}))
	};
}

/**
 * Get last time data for multiple exercises at once
 */
export async function getLastTimeForExercises(
	userId: string,
	exerciseTemplateIds: string[],
	excludeSessionId?: string
): Promise<Map<string, LastTimeData>> {
	const result = new Map<string, LastTimeData>();

	// Query in parallel for better performance
	const promises = exerciseTemplateIds.map(async (templateId) => {
		const data = await getLastTimeForExercise(userId, templateId, excludeSessionId);
		if (data) {
			result.set(templateId, data);
		}
	});

	await Promise.all(promises);
	return result;
}
