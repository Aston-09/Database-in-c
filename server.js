const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'flexboxunion')));

const PORT = process.env.PORT || 3000;
const extension = process.platform === 'win32' ? '.exe' : '';

const writePath = path.join(__dirname, "Uniondatabase" + extension);
const searchPath = path.join(__dirname, "Search" + extension);
const readPath = path.join(__dirname, "Readuniondatabase" + extension);


app.post("/add", (req, res) => {
    const { name, id, idpr, value } = req.body;

    const process = spawn(writePath);

    process.stdin.write(name + "\n");
    process.stdin.write(id + "\n");
    process.stdin.write(idpr + "\n");
    process.stdin.write(value + "\n");
    process.stdin.write("n\n");
    process.stdin.end();

    let output = "";

    process.stdout.on("data", (data) => {
        output += data.toString();
    });

    process.stderr.on("data", (data) => {
        console.error("C Error:", data.toString());
    });

    process.on("close", () => {
        res.send(output || "Employee saved successfully!");
    });

    setTimeout(() => process.kill(), 5000);
});

app.listen(PORT, "0.0.0.0", () => console.log(`Public server running on port ${PORT} (accessible on local network)`));