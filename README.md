# UnionData Database System

UnionData is a dual-server Node.js and C application designed to securely capture and manage employee data. It separates public data entry from private administration to ensure maximum security.

## Architecture

The system is split into two distinct parts:
1. **Public Server (`server.js`)**: A public-facing web form that allows users to submit their data. It uses child processes to execute a C program (`Uniondatabase.c`) that streams and appends the incoming data into a binary file (`Astonunion.bin`).
2. **Admin Server (`admin_server.js`)**: A strictly local, private interface that reads and searches the binary database using specialized C programs (`Search.c` and `Readuniondatabase.c`).

*Note: For security reasons, the Admin Server files and the actual database (`Astonunion.bin`) are intentionally excluded from this repository via `.gitignore`.*

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- GCC compiler (to compile the C binaries)

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Compile the database C wrappers:
   ```bash
   npm run build
   ```
3. Start the public server (runs on Port 3000):
   ```bash
   npm start
   ```

## Deployment (Render)

This application is configured for deployment as a Web Service on [Render](https://render.com). 

**Build Command:**
```bash
npm install && npm run build
```
**Start Command:**
```bash
npm start
```

*Because `admin_server.js` is excluded, Render will exclusively run the public server, ensuring your database reading/searching logic is never exposed to the internet.*
