-- Namu Habits - Seed Data

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  period ENUM('MANHA', 'TARDE', 'NOITE') NOT NULL DEFAULT 'MANHA',
  week_days JSON NOT NULL DEFAULT (JSON_ARRAY(0, 1, 2, 3, 4, 5, 6)),
  frequency ENUM('diário', 'semanal') NOT NULL,
  category ENUM('saúde', 'exercício', 'alimentação', 'mental') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_habits_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS checkins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  habit_id INT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  UNIQUE KEY unique_checkin (habit_id, date),
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);
