import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_URL = 'https://huggingface.co/datasets/sachin-iitd/DelhiPollDataset/resolve/main/test.csv';
const OUT_PATH = path.join(__dirname, '..', 'data', 'stations_snapshot.json');

function parseCsv(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim();
    });
    return row;
  });
}

function roundCoord(value) {
  return Math.round(Number(value) * 1000) / 1000;
}

async function main() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to download dataset: ${response.status}`);
  }
  const csv = await response.text();
  const rows = parseCsv(csv);

  const grouped = new Map();
  for (const row of rows) {
    const key = `${row.lat},${row.long}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }

  const snapshots = [];
  for (const groupRows of grouped.values()) {
    groupRows.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    for (let i = 3; i < groupRows.length; i++) {
      const current = groupRows[i];
      const lag1 = groupRows[i - 1];
      const lag2 = groupRows[i - 2];
      const lag3 = groupRows[i - 3];
      snapshots.push({
        datetime: current.dateTime,
        lat: Number(current.lat),
        long: Number(current.long),
        pressure: Number(current.pressure),
        temperature: Number(current.temperature),
        humidity: Number(current.humidity),
        pm1_0: Number(current.pm1_0),
        pm2_5: Number(current.pm2_5),
        pm10: Number(current.pm10),
        pm2_5_lag1: Number(lag1.pm2_5),
        pm2_5_lag2: Number(lag2.pm2_5),
        pm2_5_lag3: Number(lag3.pm2_5),
        sortTime: new Date(current.dateTime).getTime(),
      });
    }
  }

  snapshots.sort((a, b) => b.sortTime - a.sortTime);

  const seen = new Set();
  const selected = [];
  for (const snapshot of snapshots) {
    const key = `${roundCoord(snapshot.lat)},${roundCoord(snapshot.long)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const { sortTime, ...rest } = snapshot;
    selected.push(rest);
    if (selected.length >= 8) break;
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(
    OUT_PATH,
    JSON.stringify({ source: DATA_URL, snapshots: selected }, null, 2),
    'utf8'
  );

  console.log(`Wrote ${selected.length} snapshots to ${OUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
