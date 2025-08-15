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

// ==== ユーティリティ関数 ====
function readPlayers() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('players.json 読み込み失敗:', err);
    return [];
  }
}

function writePlayers(players) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
    return true;
  } catch (err) {
    console.error('players.json 書き込み失敗:', err);
    return false;
  }
}

// ==== POST: プレイヤー登録 ====
app.post('/', (req, res) => {
  const player = req.body;
  const players = readPlayers();
  players.push(player);

  if (!writePlayers(players)) {
    return res.status(500).json({ error: '登録失敗' });
  }

  res.json({ message: 'Player registered successfully!' });
});

// ==== GET: 全プレイヤー取得 ====
app.get('/players', (req, res) => {
  const players = readPlayers();
  res.json(players);
});

// ==== GET: 個別プレイヤー取得 ====
app.get('/players/:name', (req, res) => {
  const name = req.params.name;
  const players = readPlayers();
  const player = players.find(p => p.name === name);
  if (!player) {
    return res.status(404).json({ error: `${name} が見つかりません` });
  }
  res.json(player);
});

// ==== DELETE: 全プレイヤー削除 ====
app.delete('/players', (req, res) => {
  if (!writePlayers([])) {
    return res.status(500).json({ error: '削除失敗' });
  }
  res.json({ message: 'All players deleted successfully!' });
});

// ==== DELETE: 特定プレイヤー削除 ====
app.delete('/players/:name', (req, res) => {
  const playerName = req.params.name;
  const players = readPlayers();
  const filteredPlayers = players.filter(p => p.name !== playerName);

  if (filteredPlayers.length === players.length) {
    return res.status(404).json({ error: `${playerName} が見つかりません` });
  }

  if (!writePlayers(filteredPlayers)) {
    return res.status(500).json({ error: '削除失敗' });
  }

  res.json({ message: `${playerName} を削除しました` });
});

// ==== サーバー起動 ====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
