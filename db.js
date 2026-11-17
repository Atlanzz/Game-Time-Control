const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "game_time_control";

let pool = null;

function getPool() {
  return pool;
}

const defaultGames = [
  {
    name: "Valorant",
    genre: "FPS",
    description:
      "Game FPS kompetitif 5v5 dengan karakter unik dan kemampuan khusus. Pemain harus bekerja sama untuk menyerang atau mempertahankan area.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900",
  },
  {
    name: "Minecraft",
    genre: "Sandbox",
    description:
      "Game sandbox dengan dunia terbuka yang memungkinkan pemain membangun, menjelajah, bertahan hidup, dan menciptakan berbagai macam karya.",
    image: "https://images.unsplash.com/photo-1627856013091-fed6a5c6e7e5?w=900",
  },
  {
    name: "Mobile Legends",
    genre: "MOBA",
    description:
      "Game multiplayer online battle arena yang mempertemukan dua tim dalam pertarungan untuk menghancurkan base lawan.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900",
  },
  {
    name: "Sekiro",
    genre: "Action",
    description:
      "Game action adventure dengan sistem pertarungan cepat, eksplorasi, dan tantangan yang membutuhkan ketepatan waktu.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900",
  },
  {
    name: "GTA V",
    genre: "Open World",
    description:
      "Game open world yang menghadirkan kota luas, berbagai aktivitas, kendaraan, karakter, dan cerita kriminal yang kompleks.",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=900",
  },
  {
    name: "Genshin Impact",
    genre: "RPG",
    description:
      "Game action RPG open world dengan eksplorasi dunia luas, sistem karakter, pertarungan real-time, dan berbagai quest.",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=900",
  },
  {
    name: "PUBG",
    genre: "Battle Royale",
    description:
      "Game battle royale di mana pemain harus bertahan hidup dan menjadi pemain atau tim terakhir yang tetap berada di medan pertempuran.",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900",
  },
  {
    name: "Elden Ring",
    genre: "Action RPG",
    description:
      "Action RPG dengan dunia luas, eksplorasi bebas, pertarungan menantang, berbagai senjata, serta sistem karakter yang sangat fleksibel.",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=900",
  },
];

async function initDatabase() {
  if (!/^[a-zA-Z0-9_]+$/.test(DB_NAME)) {
    throw new Error("DB_NAME hanya boleh berisi huruf, angka, dan underscore.");
  }

  // 1. Buat database jika belum ada
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();

  // 2. Pool koneksi
  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
  });

  // 3. Buat tabel
  await pool.query(`
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
    ) ENGINE=InnoDB
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS games (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      genre VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      image LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      game_name VARCHAR(100) NOT NULL,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      duration INT NOT NULL DEFAULT 0,
      status VARCHAR(30) NOT NULL DEFAULT 'Sedang bermain',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  // 4. Data awal (hanya jika masih kosong)
  const [userCount] = await pool.query("SELECT COUNT(*) AS total FROM users");

  if (userCount[0].total === 0) {
    const adminHash = await bcrypt.hash("admin123", 10);
    const playerHash = await bcrypt.hash("player123", 10);

    await pool.query(
      "INSERT INTO users (username, name, email, password_hash, role, bio, photo) VALUES ?",
      [
        [
          ["admin", "Administrator", "admin@example.com", adminHash, "admin", "Administrator Game Time Control", ""],
          ["player", "Player", "player@example.com", playerHash, "user", "Game Time Control Player", ""],
        ],
      ],
    );

    console.log("Akun demo dibuat: admin / admin123 dan player / player123");
  }

  const [gameCount] = await pool.query("SELECT COUNT(*) AS total FROM games");

  if (gameCount[0].total === 0) {
    await pool.query("INSERT INTO games (name, genre, description, image) VALUES ?", [
      defaultGames.map((g) => [g.name, g.genre, g.description, g.image]),
    ]);

    console.log("Data game awal dibuat.");
  }
}

module.exports = { initDatabase, getPool };
