
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

let pool = null;

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
  if (pool) return;

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "game_time_control",
    ssl: {
      rejectUnauthorized: true,
    },
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 2,
    idleTimeout: 60000,
    enableKeepAlive: true,
    charset: "utf8mb4",
  });

  // Pastikan koneksi database berhasil.
  await pool.query("SELECT 1");

  // Isi data game awal jika tabel masih kosong.
  const [gameCount] = await pool.query(
    "SELECT COUNT(*) AS total FROM games"
  );

  if (Number(gameCount[0].total) === 0) {
    await pool.query(
      "INSERT INTO games (name, genre, description, image) VALUES ?",
      [defaultGames.map((g) => [g.name, g.genre, g.description, g.image])]
    );
    console.log("Data game awal berhasil dibuat.");
  }
}

function getPool() {
  if (!pool) {
    throw new Error("Database belum diinisialisasi.");
  }
  return pool;
}

module.exports = { initDatabase, getPool };
