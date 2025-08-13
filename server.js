// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'players.json');

// POST: プレイヤー登録
app.post('/', (req, res) => {
  const player = req.body;

  // ファイルが存在しない場合は空配列で初期化
  let players = [];
  if (fs.existsSync(DATA_FILE)) {
    players = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }

  // 新しいプレイヤー追加
  players.push(player);

  // JSONファイルに保存
  fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));

  res.json({ message: 'Player registered successfully!' });
});

// GET: 登録済みプレイヤー取得
app.get('/players', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, 'players.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '読み込み失敗' });
    res.json(JSON.parse(data || '[]'));
  });
});

// DELETE: 全プレイヤー削除
app.delete('/players', (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    res.json({ message: 'All players deleted successfully!' });
  } else {
    res.status(404).json({ error: 'No players.json file found' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
