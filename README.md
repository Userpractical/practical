# Practical Code Manager

A static website to organize and edit practical files 1–10.

## Features
- Starter workspace with `practical1.c` through `practical10.c`
- Add individual files or multiple selected files from your computer
- Edit code with line numbers and syntax highlighting (C/C++, Python, Java, shell, JavaScript, HTML, CSS, JSON)
- Save edits in browser storage (IndexedDB)
- Create, rename, delete, and download individual files
- Download all files as a ZIP or export/import a JSON backup

## Run on your computer
1. Extract this ZIP.
2. Open the folder in VS Code.
3. Install the VS Code extension **Live Server** (or use any static web server).
4. Right-click `index.html` → **Open with Live Server**.

You can also run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Deploy free with GitHub Pages
1. Create a GitHub repository, e.g. `practical-code-manager`.
2. Upload `index.html`, `style.css`, and `app.js` to the repository root.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then **Save**.
6. Wait for deployment. Your website address will look like:
   `https://YOUR-USERNAME.github.io/practical-code-manager/`

## Important storage note
This is a browser-based version. Files are saved in IndexedDB on the current browser and device. They are not automatically synced to another phone/computer and are not uploaded to GitHub. Use **Download all files (.zip)** or **Restore backup (.json)** to move or back up your work. Keep backups before clearing browser data.

The editor and ZIP export use CDN libraries, so an internet connection is required for syntax highlighting and ZIP downloads. Basic text editing and individual downloads may still work if the libraries were already cached.
