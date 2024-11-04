import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * DB SCHEMA
 */
// CREATE TABLE `objects` (
//   `keyword` varchar(255),
//   `xpos` float,
//   `ypos` float,
//   `zpos` float,
//   `user_id` integer,
//   `created_at` timestamp
// );

// CREATE TABLE `users` (
//   `id` integer PRIMARY KEY,
//   `username` varchar(255),
//   `created_at` timestamp
// );

// CREATE TABLE `responses` (
//   `id` integer PRIMARY KEY,
//   `q1` integer,
//   `q2` integer,
//   `body1` text,
//   `body2` text,
//   `body3` text,
//   `user_id` integer,
//   `created_at` timestamp
// );

// ALTER TABLE `responses` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

// ALTER TABLE `objects` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

