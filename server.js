const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let players = []; // メモリ上に保存（Railway再起動で消える）

// ユーザー登録
app.post('/register', (req, res) => {
  const { name, game, timestamp } = req.body;
  if (!name || !game) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  players.push({ name, game, timestamp });
  console.log(players);
  res.json({ message: 'Registration successful', players });
});

// 登録データ取得
app.get('/players', (req, res) => {
  res.json(players);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
