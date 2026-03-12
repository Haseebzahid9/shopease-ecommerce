# 📤 How to Upload ShopEase to GitHub — Complete Step-by-Step Guide

---

## ✅ BEFORE YOU START — What You Need

- [ ] A **GitHub account** → Sign up free at [github.com](https://github.com)
- [ ] **Git installed** on your computer → Download at [git-scm.com](https://git-scm.com)
- [ ] The **ShopEase project folder** unzipped on your computer

---

## STEP 1 — Install Git (Skip if already installed)

### Check if Git is already installed:
Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and type:
```bash
git --version
```
If you see something like `git version 2.x.x` → Git is installed, skip to Step 2.

### Install Git:
- **Windows** → Download from https://git-scm.com/download/win and run installer
- **Mac** → Run: `xcode-select --install`
- **Linux** → Run: `sudo apt install git`

---

## STEP 2 — Configure Git (One-time setup)

Open your terminal and run these two commands (replace with your real name and email):

```bash
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
```

> 💡 Use the same email as your GitHub account.

---

## STEP 3 — Create a New Repository on GitHub

1. Go to **https://github.com** and log in
2. Click the **`+`** icon in the top-right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name:** `shopease-ecommerce`
   - **Description:** `A full-stack vanilla JS e-commerce engine with admin dashboard and storefront`
   - **Visibility:** Select **Public** (so others can see it)
   - ⚠️ **DO NOT** check "Add a README file" (we already have one)
   - ⚠️ **DO NOT** check "Add .gitignore"
   - ⚠️ **DO NOT** check "Choose a license"
5. Click the green **"Create repository"** button

6. **Copy the repository URL** shown on the next page — it looks like:
   ```
   https://github.com/YOUR-USERNAME/shopease-ecommerce.git
   ```
   Keep this URL, you'll need it in Step 6.

---

## STEP 4 — Open Terminal in Your Project Folder

### Windows:
1. Open File Explorer
2. Navigate to your `shopease-ecommerce` folder
3. Click in the address bar, type `cmd` and press Enter
   *(Or hold Shift + Right-click → "Open PowerShell window here")*

### Mac:
1. Open Finder
2. Navigate to your `shopease-ecommerce` folder
3. Right-click the folder → "New Terminal at Folder"

### Any OS — using the terminal directly:
```bash
cd path/to/your/shopease-ecommerce
```
Example on Windows:
```bash
cd C:\Users\YourName\Downloads\shopease-ecommerce
```
Example on Mac:
```bash
cd ~/Downloads/shopease-ecommerce
```

---

## STEP 5 — Initialize Git in Your Project

In the terminal (inside your project folder), run:

```bash
git init
```

You should see: `Initialized empty Git repository in .../shopease-ecommerce/.git/`

---

## STEP 6 — Connect Your Project to GitHub

Run this command (replace `YOUR-USERNAME` with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR-USERNAME/shopease-ecommerce.git
```

Example:
```bash
git remote add origin https://github.com/johnsmith/shopease-ecommerce.git
```

---

## STEP 7 — Add All Files

Run this command to stage all your project files:

```bash
git add .
```

> The `.` means "add everything in this folder".

You can verify what was added by running:
```bash
git status
```
You'll see a list of files in green — these are ready to be committed.

---

## STEP 8 — Make Your First Commit

```bash
git commit -m "Initial commit: ShopEase vanilla JS e-commerce engine"
```

You should see output listing all the files that were committed.

---

## STEP 9 — Set the Branch Name to `main`

```bash
git branch -M main
```

---

## STEP 10 — Push (Upload) to GitHub

```bash
git push -u origin main
```

Git will ask for your GitHub credentials:
- **Username:** Your GitHub username
- **Password:** Your GitHub **Personal Access Token** (NOT your account password — see below)

### 🔑 How to Create a Personal Access Token (if asked for password):
1. Go to GitHub → Click your profile photo → **Settings**
2. Scroll down → Click **"Developer settings"** (bottom left)
3. Click **"Personal access tokens"** → **"Tokens (classic)"**
4. Click **"Generate new token (classic)"**
5. Give it a name like `shopease-upload`
6. Set expiration to **90 days**
7. Check the **`repo`** checkbox
8. Click **"Generate token"**
9. **Copy the token immediately** (you won't see it again!)
10. Use this token as your password when Git asks

---

## STEP 11 — Verify It Worked! ✅

1. Go to `https://github.com/YOUR-USERNAME/shopease-ecommerce`
2. You should see all your project files listed
3. The `README.md` will be displayed automatically as your project description

---

## 🎉 All Done! Your Project is Live on GitHub

Share your repository URL with anyone:
```
https://github.com/YOUR-USERNAME/shopease-ecommerce
```

---

## 🔁 Making Future Updates

Whenever you make changes to your project and want to update GitHub:

```bash
# 1. Stage the changed files
git add .

# 2. Commit with a message describing what you changed
git commit -m "Updated product card design"

# 3. Push to GitHub
git push
```

---

## ❌ Common Errors & Fixes

### Error: `git: command not found`
**Fix:** Git is not installed. Go back to Step 1.

### Error: `remote origin already exists`
**Fix:** Run this instead:
```bash
git remote set-url origin https://github.com/YOUR-USERNAME/shopease-ecommerce.git
```

### Error: `failed to push some refs`
**Fix:** Run:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: `Authentication failed`
**Fix:** Use a Personal Access Token (not your password). See Step 10 for instructions.

### Error: `src refspec main does not match any`
**Fix:** You haven't committed yet. Make sure you ran `git add .` and `git commit` first.

---

## 💡 Quick Command Summary

```bash
git init
git remote add origin https://github.com/YOUR-USERNAME/shopease-ecommerce.git
git add .
git commit -m "Initial commit: ShopEase vanilla JS e-commerce engine"
git branch -M main
git push -u origin main
```

---

## 🌐 Optional: Enable GitHub Pages (Free Hosting)

Want your store to be live on the internet for free?

1. Go to your GitHub repository
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Branch"**, select `main` and click **Save**
5. Wait 1–2 minutes
6. Your site will be live at:
   ```
   https://YOUR-USERNAME.github.io/shopease-ecommerce/
   ```

> 🎉 Now anyone in the world can visit your e-commerce store!
