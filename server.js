const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// テスト用の簡易データ格納場所（実際はDBを使う）
let players = [];

app.post('/', (req, res) => {
  const player = req.body;
  players.push(player);
  console.log('Registered Player:', player);
  res.json({ message: 'Registration successful' });
});

app.get('/players', (req, res) => {
  res.json(players);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
