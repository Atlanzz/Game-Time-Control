-- OPSIONAL: server.js sudah membuat database dan tabel ini secara otomatis
-- saat pertama kali dijalankan. File ini hanya referensi struktur tabel.

CREATE DATABASE IF NOT EXISTS game_time_control
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE game_time_control;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  bio TEXT,
  photo LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  image LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_name VARCHAR(100) NOT NULL,
  played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  duration INT NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'Sedang bermain',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
