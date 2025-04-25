import Database from 'better-sqlite3';

const db = new Database('mydb.sqlite');

db.exec(`
  CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT UNIQUE
  );
`);

export function getOrCreatePartId(value: string): number {
  let stmt = db.prepare('SELECT id FROM parts WHERE value = ?');
  let row = stmt.get(value) as { id: number } | undefined;
  if (row) return row.id;

  let insert = db.prepare('INSERT INTO parts (value) VALUES (?)');
  let info = insert.run(value);
  return Number(info.lastInsertRowid);
}

export function getPartById(id: number): string | null {
  let stmt = db.prepare('SELECT value FROM parts WHERE id = ?');
  let row = stmt.get(id) as { value: string } | undefined;
  return row ? row.value : null;
}
