const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// Serve the main public frontend
app.use(express.static(path.join(__dirname, "flexboxunion")));

// Serve the admin panel — protected by API key
// This must be defined BEFORE the authenticateAdmin middleware reads ADMIN_API_KEY,
// so we inline the check here to avoid circular dependency at startup.
app.use("/admin", (req, res, next) => {
    const apiKey = process.env.ADMIN_API_KEY || "";
    if (!apiKey) return next(); // no key set = local dev, allow
    const key = req.headers["x-api-key"] || req.query.key;
    if (!key || key !== apiKey) {
        return res.status(401).send("Unauthorized. Provide a valid API key via ?key= in the URL.");
    }
    next();
}, express.static(path.join(__dirname, "admin")));

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "employees.json");
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";

// ─── Middleware: authenticate admin requests ───
function authenticateAdmin(req, res, next) {
    if (!ADMIN_API_KEY) {
        // No key configured — allow access (local dev)
        return next();
    }

    // Accept key from header or query parameter
    const key = req.headers["x-api-key"] || req.query.key;

    if (!key || key !== ADMIN_API_KEY) {
        return res.status(401).json({ error: "Unauthorized. Invalid or missing API key." });
    }

    next();
}

// ─── Helper: read all employees from JSON file ───
function readEmployees() {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch (err) {
        console.error("Error reading data file:", err.message);
        return [];
    }
}

// ─── Helper: write employees array to JSON file ───
function writeEmployees(employees) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(employees, null, 2), "utf-8");
}

// ─── Helper: resolve ID proof type to a label ───
function idProofLabel(idpr) {
    if (idpr === 1) return "Aadhar";
    if (idpr === 2) return "Passport";
    if (idpr === 3) return "Driving License";
    return "Unknown";
}

// ━━━ POST /add — store a new employee (PUBLIC) ━━━
app.post("/add", (req, res) => {
    const { name, id, idpr, value } = req.body;

    if (!name || !id || !idpr || !value) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const employee = {
        name: String(name).trim(),
        id: Number(id),
        idProofType: Number(idpr),
        idProofLabel: idProofLabel(Number(idpr)),
        idProofValue: String(value).trim(),
        createdAt: new Date().toISOString(),
    };

    console.log("Adding employee:", employee);

    const employees = readEmployees();
    employees.push(employee);
    writeEmployees(employees);

    res.json({ message: "Employee saved successfully!", employee });
});

// ━━━ GET /all — return all employees (PROTECTED) ━━━
app.get("/all", authenticateAdmin, (req, res) => {
    const employees = readEmployees();
    res.json(employees);
});

// ━━━ GET /search?id=X — search by employee ID (PROTECTED) ━━━
app.get("/search", authenticateAdmin, (req, res) => {
    const searchId = Number(req.query.id);

    if (isNaN(searchId)) {
        return res.status(400).json({ error: "Invalid ID." });
    }

    const employees = readEmployees();
    const found = employees.filter((e) => e.id === searchId);

    if (found.length === 0) {
        return res.json({ message: "Record not found.", results: [] });
    }

    res.json({ message: `Found ${found.length} record(s).`, results: found });
});

// ━━━ GET /download — download the raw JSON data file (PROTECTED) ━━━
app.get("/download", authenticateAdmin, (req, res) => {
    if (!fs.existsSync(DATA_FILE)) {
        return res.status(404).json({ error: "No data file exists yet." });
    }
    res.download(DATA_FILE, "employees.json");
});

// ━━━ GET /health — health check for Render (PUBLIC) ━━━
app.get("/health", (req, res) => {
    res.json({ status: "ok", employees: readEmployees().length });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
    console.log(`API key protection: ${ADMIN_API_KEY ? "ENABLED" : "DISABLED (set ADMIN_API_KEY to enable)"}`);
});