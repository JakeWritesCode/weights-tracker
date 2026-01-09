-- Seed ExerciseTemplates

INSERT INTO "ExerciseTemplate" ("id", "name", "muscleGroup", "equipment", "updatedAt") VALUES
-- Chest
('ex_bench_press', 'Bench Press', 'Chest', 'Barbell', CURRENT_TIMESTAMP),
('ex_incline_bench', 'Incline Bench Press', 'Chest', 'Barbell', CURRENT_TIMESTAMP),
('ex_db_bench', 'Dumbbell Bench Press', 'Chest', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_db_incline_bench', 'Incline Dumbbell Press', 'Chest', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_db_flyes', 'Dumbbell Flyes', 'Chest', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_cable_crossover', 'Cable Crossover', 'Chest', 'Cable', CURRENT_TIMESTAMP),
('ex_pushups', 'Push-ups', 'Chest', 'Bodyweight', CURRENT_TIMESTAMP),
('ex_dips_chest', 'Dips (Chest)', 'Chest', 'Bodyweight', CURRENT_TIMESTAMP),

-- Back
('ex_deadlift', 'Deadlift', 'Back', 'Barbell', CURRENT_TIMESTAMP),
('ex_barbell_row', 'Barbell Row', 'Back', 'Barbell', CURRENT_TIMESTAMP),
('ex_db_row', 'Dumbbell Row', 'Back', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_lat_pulldown', 'Lat Pulldown', 'Back', 'Cable', CURRENT_TIMESTAMP),
('ex_seated_row', 'Seated Cable Row', 'Back', 'Cable', CURRENT_TIMESTAMP),
('ex_pullups', 'Pull-ups', 'Back', 'Bodyweight', CURRENT_TIMESTAMP),
('ex_chinups', 'Chin-ups', 'Back', 'Bodyweight', CURRENT_TIMESTAMP),
('ex_tbar_row', 'T-Bar Row', 'Back', 'Machine', CURRENT_TIMESTAMP),

-- Shoulders
('ex_ohp', 'Overhead Press', 'Shoulders', 'Barbell', CURRENT_TIMESTAMP),
('ex_db_shoulder_press', 'Dumbbell Shoulder Press', 'Shoulders', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_lateral_raise', 'Lateral Raise', 'Shoulders', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_front_raise', 'Front Raise', 'Shoulders', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_rear_delt_fly', 'Rear Delt Fly', 'Shoulders', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_face_pull', 'Face Pull', 'Shoulders', 'Cable', CURRENT_TIMESTAMP),
('ex_arnold_press', 'Arnold Press', 'Shoulders', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_shrugs', 'Shrugs', 'Shoulders', 'Dumbbells', CURRENT_TIMESTAMP),

-- Legs
('ex_squat', 'Squat', 'Legs', 'Barbell', CURRENT_TIMESTAMP),
('ex_front_squat', 'Front Squat', 'Legs', 'Barbell', CURRENT_TIMESTAMP),
('ex_leg_press', 'Leg Press', 'Legs', 'Machine', CURRENT_TIMESTAMP),
('ex_rdl', 'Romanian Deadlift', 'Legs', 'Barbell', CURRENT_TIMESTAMP),
('ex_leg_curl', 'Leg Curl', 'Legs', 'Machine', CURRENT_TIMESTAMP),
('ex_leg_extension', 'Leg Extension', 'Legs', 'Machine', CURRENT_TIMESTAMP),
('ex_calf_raise', 'Calf Raise', 'Legs', 'Machine', CURRENT_TIMESTAMP),
('ex_lunges', 'Lunges', 'Legs', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_bulgarian_split', 'Bulgarian Split Squat', 'Legs', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_hip_thrust', 'Hip Thrust', 'Legs', 'Barbell', CURRENT_TIMESTAMP),
('ex_goblet_squat', 'Goblet Squat', 'Legs', 'Dumbbells', CURRENT_TIMESTAMP),

-- Biceps
('ex_barbell_curl', 'Barbell Curl', 'Biceps', 'Barbell', CURRENT_TIMESTAMP),
('ex_db_curl', 'Dumbbell Curl', 'Biceps', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_hammer_curl', 'Hammer Curl', 'Biceps', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_preacher_curl', 'Preacher Curl', 'Biceps', 'Barbell', CURRENT_TIMESTAMP),
('ex_incline_curl', 'Incline Dumbbell Curl', 'Biceps', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_cable_curl', 'Cable Curl', 'Biceps', 'Cable', CURRENT_TIMESTAMP),

-- Triceps
('ex_tricep_pushdown', 'Tricep Pushdown', 'Triceps', 'Cable', CURRENT_TIMESTAMP),
('ex_skull_crusher', 'Skull Crusher', 'Triceps', 'Barbell', CURRENT_TIMESTAMP),
('ex_overhead_extension', 'Overhead Tricep Extension', 'Triceps', 'Dumbbells', CURRENT_TIMESTAMP),
('ex_tricep_dips', 'Tricep Dips', 'Triceps', 'Bodyweight', CURRENT_TIMESTAMP),
('ex_close_grip_bench', 'Close Grip Bench Press', 'Triceps', 'Barbell', CURRENT_TIMESTAMP),
('ex_tricep_kickback', 'Tricep Kickback', 'Triceps', 'Dumbbells', CURRENT_TIMESTAMP),

-- Core
('ex_plank', 'Plank', 'Core', 'Bodyweight', CURRENT_TIMESTAMP),
('ex_crunches', 'Crunches', 'Core', 'Bodyweight', CURRENT_TIMESTAMP),
('ex_leg_raise', 'Hanging Leg Raise', 'Core', 'Bodyweight', CURRENT_TIMESTAMP),
('ex_russian_twist', 'Russian Twist', 'Core', 'Bodyweight', CURRENT_TIMESTAMP),
('ex_cable_crunch', 'Cable Crunch', 'Core', 'Cable', CURRENT_TIMESTAMP),
('ex_ab_wheel', 'Ab Wheel Rollout', 'Core', 'Ab Wheel', CURRENT_TIMESTAMP);
