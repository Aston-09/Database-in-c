// ══════════════════════════════════════════════════════════
//  CONFIG: Set this to your deployed Render URL
//  Example: "https://uniondata-xxxx.onrender.com"
//  Leave empty to use the local server (localhost:3000)
// ══════════════════════════════════════════════════════════
const REMOTE_URL = localStorage.getItem("remoteUrl") || "";

function getBaseUrl() {
    return REMOTE_URL || "http://localhost:3000";
}

function getApiKey() {
    return localStorage.getItem("adminApiKey") || "";
}

// ─── URL config UI ───
const urlInput = document.getElementById("remoteUrl");
const saveUrlBtn = document.getElementById("saveUrlBtn");
const urlStatus = document.getElementById("urlStatus");

if (urlInput) {
    urlInput.value = localStorage.getItem("remoteUrl") || "";
}

if (saveUrlBtn) {
    saveUrlBtn.addEventListener("click", () => {
        const url = urlInput.value.trim().replace(/\/+$/, ""); // strip trailing slashes
        localStorage.setItem("remoteUrl", url);
        urlStatus.textContent = url ? `✓ Connected to ${url}` : "✓ Using local server";
        urlStatus.style.color = "#3fb950";
        setTimeout(() => (urlStatus.textContent = ""), 3000);
    });
}

// ─── API Key config UI ───
const apiKeyInput = document.getElementById("apiKeyInput");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const keyStatus = document.getElementById("keyStatus");

if (apiKeyInput) {
    apiKeyInput.value = localStorage.getItem("adminApiKey") || "";
}

if (saveKeyBtn) {
    saveKeyBtn.addEventListener("click", () => {
        const key = apiKeyInput.value.trim();
        localStorage.setItem("adminApiKey", key);
        keyStatus.textContent = key ? "✓ API key saved" : "✓ API key cleared";
        keyStatus.style.color = "#3fb950";
        setTimeout(() => (keyStatus.textContent = ""), 3000);
    });
}

// ─── Format a single employee record as readable text ───
function formatEmployee(emp) {
    return [
        `Name : ${emp.name}`,
        `Employee ID : ${emp.id}`,
        `${emp.idProofLabel || "ID Proof"} : ${emp.idProofValue}`,
        `Added : ${new Date(emp.createdAt).toLocaleString()}`,
    ].join("\n");
}

// ━━━ SEARCH ━━━
document.getElementById("searchBtn").addEventListener("click", async () => {
    const id = document.getElementById("searchId").value.trim();
    const resultsBox = document.getElementById("searchResults");

    if (!id) {
        resultsBox.textContent = "Please enter an ID.";
        resultsBox.classList.remove("empty");
        return;
    }

    resultsBox.textContent = "Searching...";
    resultsBox.classList.remove("empty");

    try {
        const res = await fetch(`${getBaseUrl()}/search?id=${id}`, {
            headers: { "x-api-key": getApiKey() },
        });

        if (res.status === 401) {
            resultsBox.textContent = "⛔ Unauthorized. Check your API key.";
            return;
        }
        if (!res.ok) throw new Error("Server Error");

        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            resultsBox.textContent = "Record not found.";
        } else {
            resultsBox.textContent = data.results.map(formatEmployee).join("\n\n");
        }
    } catch (err) {
        console.error(err);
        resultsBox.textContent = "Failed to fetch data. Is the server running?";
    }
});

// ━━━ LOAD ALL ━━━
document.getElementById("fetchAllBtn").addEventListener("click", async () => {
    const allResultsBox = document.getElementById("allResults");
    const fetchBtn = document.getElementById("fetchAllBtn");

    allResultsBox.style.display = "block";
    allResultsBox.textContent = "Loading database...";
    allResultsBox.classList.remove("empty");
    fetchBtn.disabled = true;

    try {
        const res = await fetch(`${getBaseUrl()}/all`, {
            headers: { "x-api-key": getApiKey() },
        });

        if (res.status === 401) {
            allResultsBox.textContent = "⛔ Unauthorized. Check your API key.";
            fetchBtn.disabled = false;
            return;
        }
        if (!res.ok) throw new Error("Server Error");

        const employees = await res.json();

        if (!employees || employees.length === 0) {
            allResultsBox.textContent = "Database is empty.";
        } else {
            allResultsBox.textContent =
                `Total records: ${employees.length}\n${"─".repeat(40)}\n\n` +
                employees.map(formatEmployee).join("\n\n");
        }
    } catch (err) {
        console.error(err);
        allResultsBox.textContent = "Failed to fetch database records. Is the server running?";
    } finally {
        fetchBtn.disabled = false;
    }
});

// ━━━ DOWNLOAD ━━━
const downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        // Use query param for download since it opens in a new tab
        const key = getApiKey();
        const url = key
            ? `${getBaseUrl()}/download?key=${encodeURIComponent(key)}`
            : `${getBaseUrl()}/download`;
        window.open(url, "_blank");
    });
}

