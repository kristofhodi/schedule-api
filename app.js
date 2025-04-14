import express from 'express'
import { initializeDatabase, dbAll, dbGet, dbRun } from './util/database.js'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get("/schedule", async (req, res) => {
    const schedule = await dbAll("SELECT * FROM schedule ORDER BY day, hour");
    res.status(200).json(schedule);
});

app.post("/schedule", async (req, res) => {
    const { day, hour, subject } = req.body;
    if (!day || !hour || !subject) {
        return res.status(400).json({ message: "missing data" });
    }
    const result = await dbRun("INSERT INTO schedule (day, hour, subject) VALUES (?, ?, ?)", [day, hour, subject]);
    res.status(201).json({ id: result.lastID, day, hour, subject });
});

app.put("/schedule/:id", async (req, res) => {
    const id = req.params.id;
    const existing = await dbGet("SELECT * FROM schedule WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ message: "not found" });

    const { day, hour, subject } = req.body;
    if (!day || !hour || !subject) {
        return res.status(400).json({ message: "missing data" });
    }

    await dbRun("UPDATE schedule SET day = ?, hour = ?, subject = ? WHERE id = ?", [day, hour, subject, id]);
    res.status(200).json({ id: +id, day, hour, subject });
});

app.delete("/schedule/:id", async (req, res) => {
    const id = req.params.id;
    const existing = await dbGet("SELECT * FROM schedule WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ message: "not found" });

    await dbRun("DELETE FROM schedule WHERE id = ?", [id]);
    res.status(200).json({ message: "delete successful" });
});
app.put("/schedule/:id", async (req, res) => {
    const id = req.params.id;
    const existing = await dbGet("SELECT * FROM schedule WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ message: "not found" });

    const { day, hour, subject } = req.body;
    if (!day || !hour || !subject) {
        return res.status(400).json({ message: "missing data" });
    }

    await dbRun("UPDATE schedule SET day = ?, hour = ?, subject = ? WHERE id = ?", [day, hour, subject, id]);
    res.status(200).json({ id: +id, day, hour, subject });
});


async function startServer() {
    await initializeDatabase();
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}
startServer();