const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL接続プール作成（Railway環境変数利用）
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// プレイヤー登録
app.post('/', async (req, res) => {
  const { name, game, timestamp } = req.body;
  try {
    const sql = 'INSERT INTO players (name, game, timestamp) VALUES (?, ?, ?)';
    await pool.query(sql, [name, game, timestamp]);
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

// 登録されたプレイヤー取得（確認用）
app.get('/players', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM players');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
