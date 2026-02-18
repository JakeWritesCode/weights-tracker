import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const exercises = [
	// Chest
	{ name: 'Bench Press', muscleGroup: 'Chest' },
	{ name: 'Incline Bench Press', muscleGroup: 'Chest' },
	{ name: 'Dumbbell Bench Press', muscleGroup: 'Chest' },
	{ name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
	{ name: 'Dumbbell Flyes', muscleGroup: 'Chest' },
	{ name: 'Close-Grip Dumbbell Press', muscleGroup: 'Chest' },
	{ name: 'Cable Crossover', muscleGroup: 'Chest' },
	{ name: 'Push Ups', muscleGroup: 'Chest' },
	{ name: 'Dips', muscleGroup: 'Chest' },

	// Back
	{ name: 'Deadlift', muscleGroup: 'Back' },
	{ name: 'Barbell Row', muscleGroup: 'Back' },
	{ name: 'Pull Ups', muscleGroup: 'Back' },
	{ name: 'Lat Pulldown', muscleGroup: 'Back' },
	{ name: 'Seated Cable Row', muscleGroup: 'Back' },
	{ name: 'Dumbbell Row', muscleGroup: 'Back' },
	{ name: 'Single-Arm Dumbbell Row', muscleGroup: 'Back' },
	{ name: 'Kettlebell Bent-Over Row', muscleGroup: 'Back' },
	{ name: 'Dumbbell Pullover', muscleGroup: 'Back' },

	// Shoulders
	{ name: 'Overhead Press', muscleGroup: 'Shoulders' },
	{ name: 'Lateral Raises', muscleGroup: 'Shoulders' },
	{ name: 'Front Raises', muscleGroup: 'Shoulders' },
	{ name: 'Face Pulls', muscleGroup: 'Shoulders' },
	{ name: 'Reverse Flyes', muscleGroup: 'Shoulders' },
	{ name: 'Resistance Band Pull-Aparts', muscleGroup: 'Shoulders' },
	{ name: 'Kettlebell Halo', muscleGroup: 'Shoulders' },

	// Biceps
	{ name: 'Barbell Curl', muscleGroup: 'Biceps' },
	{ name: 'Dumbbell Curl', muscleGroup: 'Biceps' },
	{ name: 'Hammer Curl', muscleGroup: 'Biceps' },
	{ name: 'Preacher Curl', muscleGroup: 'Biceps' },

	// Triceps
	{ name: 'Tricep Pushdown', muscleGroup: 'Triceps' },
	{ name: 'Skull Crushers', muscleGroup: 'Triceps' },
	{ name: 'Dumbbell Skull Crushers', muscleGroup: 'Triceps' },
	{ name: 'Overhead Tricep Extension', muscleGroup: 'Triceps' },
	{ name: 'Resistance Band Tricep Pushdowns', muscleGroup: 'Triceps' },

	// Legs
	{ name: 'Squat', muscleGroup: 'Legs' },
	{ name: 'Leg Press', muscleGroup: 'Legs' },
	{ name: 'Romanian Deadlift', muscleGroup: 'Legs' },
	{ name: 'Dumbbell Romanian Deadlifts', muscleGroup: 'Legs' },
	{ name: 'Leg Curl', muscleGroup: 'Legs' },
	{ name: 'Leg Extension', muscleGroup: 'Legs' },
	{ name: 'Calf Raises', muscleGroup: 'Legs' },
	{ name: 'Dumbbell Calf Raises', muscleGroup: 'Legs' },
	{ name: 'Lunges', muscleGroup: 'Legs' },
	{ name: 'Bulgarian Split Squat', muscleGroup: 'Legs' },
	{ name: 'Goblet Squat', muscleGroup: 'Legs' },
	{ name: 'Dumbbell Step-Ups', muscleGroup: 'Legs' },
	{ name: 'Kettlebell Front Squats', muscleGroup: 'Legs' },
	{ name: 'Glute Band Leg Extensions', muscleGroup: 'Legs' },
	{ name: 'Kettlebell Swings', muscleGroup: 'Legs' },
	{ name: 'Dumbbell Hip Thrusts', muscleGroup: 'Legs' },
	{ name: 'Glute Band Walks', muscleGroup: 'Legs' },
	{ name: 'Single-Leg Dumbbell Deadlift', muscleGroup: 'Legs' },

	// Core
	{ name: 'Plank', muscleGroup: 'Core' },
	{ name: 'Crunches', muscleGroup: 'Core' },
	{ name: 'Hanging Leg Raises', muscleGroup: 'Core' },
	{ name: 'Cable Woodchop', muscleGroup: 'Core' },
	{ name: 'Dumbbell Weighted Sit-Ups', muscleGroup: 'Core' },
	{ name: 'Powerband Pallof Press', muscleGroup: 'Core' },

	// Cardio
	{ name: 'Battle Rope Finisher', muscleGroup: 'Cardio' }
];

async function main() {
	console.log('Seeding exercise templates...');

	for (const exercise of exercises) {
		const existing = await prisma.exerciseTemplate.findFirst({
			where: { name: exercise.name }
		});

		if (!existing) {
			await prisma.exerciseTemplate.create({
				data: {
					name: exercise.name,
					muscleGroup: exercise.muscleGroup
				}
			});
		}
	}

	console.log(`Seeded ${exercises.length} exercise templates`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	});
