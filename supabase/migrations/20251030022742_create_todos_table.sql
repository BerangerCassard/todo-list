/*
  # Create todos table

  1. New Tables
    - `todos`
      - `id` (uuid, primary key) - Unique identifier for each todo
      - `user_id` (uuid) - Reference to the user who owns the todo
      - `title` (text) - The todo item text
      - `completed` (boolean) - Whether the todo is completed or not
      - `created_at` (timestamptz) - When the todo was created
      - `updated_at` (timestamptz) - When the todo was last updated

  2. Security
    - Enable RLS on `todos` table
    - Add policy for authenticated users to view their own todos
    - Add policy for authenticated users to insert their own todos
    - Add policy for authenticated users to update their own todos
    - Add policy for authenticated users to delete their own todos

  3. Important Notes
    - All todos are private to the user who created them
    - Completed status defaults to false for new todos
    - Timestamps are automatically managed
*/

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own todos
CREATE POLICY "Users can view own todos"
  ON todos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own todos
CREATE POLICY "Users can insert own todos"
  ON todos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own todos
CREATE POLICY "Users can update own todos"
  ON todos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own todos
CREATE POLICY "Users can delete own todos"
  ON todos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos(user_id);
CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos(created_at DESC);