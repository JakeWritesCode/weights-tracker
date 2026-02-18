-- Add home gym exercises (dumbbells, kettlebells, resistance bands, battle rope)

INSERT INTO "ExerciseTemplate" ("id", "name", "muscleGroup", "equipment", "updatedAt") VALUES
-- Chest
('ex_close_grip_db_press', 'Close-Grip Dumbbell Press', 'Chest', 'Dumbbells', CURRENT_TIMESTAMP),

-- Triceps
('ex_band_tricep_pushdown', 'Resistance Band Tricep Pushdowns', 'Triceps', 'Resistance Band', CURRENT_TIMESTAMP),
('ex_db_skull_crusher', 'Dumbbell Skull Crushers', 'Triceps', 'Dumbbells', CURRENT_TIMESTAMP),

-- Back
('ex_single_arm_db_row', 'Single-Arm Dumbbell Row', 'Back', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_kb_bent_over_row', 'Kettlebell Bent-Over Row', 'Back', 'Kettlebell', CURRENT_TIMESTAMP),
('ex_db_pullover', 'Dumbbell Pullover', 'Back', 'Dumbbells', CURRENT_TIMESTAMP),

-- Shoulders
('ex_band_pull_aparts', 'Resistance Band Pull-Aparts', 'Shoulders', 'Resistance Band', CURRENT_TIMESTAMP),
('ex_kb_halo', 'Kettlebell Halo', 'Shoulders', 'Kettlebell', CURRENT_TIMESTAMP),

-- Legs
('ex_db_step_ups', 'Dumbbell Step-Ups', 'Legs', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_kb_front_squat', 'Kettlebell Front Squats', 'Legs', 'Kettlebell', CURRENT_TIMESTAMP),
('ex_band_leg_extension', 'Glute Band Leg Extensions', 'Legs', 'Resistance Band', CURRENT_TIMESTAMP),
('ex_db_rdl', 'Dumbbell Romanian Deadlifts', 'Legs', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_kb_swings', 'Kettlebell Swings', 'Legs', 'Kettlebell', CURRENT_TIMESTAMP),
('ex_db_hip_thrust', 'Dumbbell Hip Thrusts', 'Legs', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_band_walks', 'Glute Band Walks', 'Legs', 'Resistance Band', CURRENT_TIMESTAMP),
('ex_single_leg_db_deadlift', 'Single-Leg Dumbbell Deadlift', 'Legs', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_db_calf_raise', 'Dumbbell Calf Raises', 'Legs', 'Dumbbells', CURRENT_TIMESTAMP),

-- Core
('ex_db_weighted_situp', 'Dumbbell Weighted Sit-Ups', 'Core', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_pallof_press', 'Powerband Pallof Press', 'Core', 'Resistance Band', CURRENT_TIMESTAMP),

-- Cardio
('ex_battle_rope', 'Battle Rope Finisher', 'Cardio', 'Battle Rope', CURRENT_TIMESTAMP);
