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
  user_id INT NULL,
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

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hábitos
INSERT INTO habits (title, description, frequency, category) VALUES
('Meditação Matinal', 'Meditar por 10 minutos ao acordar.', 'diário', 'mental'),
('Caminhada', 'Caminhar pelo menos 30 minutos.', 'diário', 'exercício'),
('Beber 2L de Água', 'Manter-se hidratado ao longo do dia.', 'diário', 'saúde'),
('Preparar Refeição Saudável', 'Cozinhar uma refeição balanceada em casa.', 'semanal', 'alimentação');

-- Check-ins
INSERT INTO checkins (habit_id, date, notes) VALUES
(1, '2025-01-20', 'Sessão de 10 minutos, foco na respiração.'),
(1, '2025-01-21', 'Consegui 15 minutos hoje.'),
(1, '2025-01-22', 'Dia difícil, mas mantive a prática.'),
(2, '2025-01-20', 'Caminhada de 40 minutos no parque.'),
(2, '2025-01-22', 'Caminhada rápida de 30 minutos.'),
(3, '2025-01-20', 'Completei os 2 litros.'),
(3, '2025-01-21', 'Quase lá, faltou um copo.'),
(4, '2025-01-19', 'Preparei frango grelhado com legumes.');
