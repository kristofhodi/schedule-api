import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite')

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

export async function initializeDatabase() {
    await dbRun("DROP TABLE IF EXISTS schedule");
    await dbRun(`CREATE TABLE schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT NOT NULL,
        hour INTEGER NOT NULL,
        subject TEXT NOT NULL
    )`);

    const defaultSchedule = [
        { day: "Hétfő", hour: 1, subject: "Matek" },
        { day: "Hétfő", hour: 2, subject: "Irodalom" },
        { day: "Kedd", hour: 1, subject: "Fizika" },
        { day: "Kedd", hour: 2, subject: "JS" },
        { day: "Szerda", hour: 1, subject: "Történelem" },
        { day: "Szerda", hour: 2, subject: "Nyelvtan" },
        { day: "Csütörtök", hour: 1, subject: "Tesi" },
        { day: "Csütörtök", hour: 2, subject: "Angol" },
        { day: "Péntek", hour: 1, subject: "C#" },
        { day: "Péntek", hour: 2, subject: "Német" },

    ];

    for (const item of defaultSchedule) {
        await dbRun("INSERT INTO schedule (day, hour, subject) VALUES (?, ?, ?)", [item.day, item.hour, item.subject]);
    }
}
