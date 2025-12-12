# TP WebAssembly — Filtres d’image dans le navigateur

Ce TP montre comment utiliser **WebAssembly (Rust)** dans un navigateur pour appliquer des **filtres d’image ultra-rapides** via un `<canvas>`, et comparer les performances **JavaScript vs WebAssembly**.

---

## 🎯 Objectif

- Charger une image dans le navigateur
- Manipuler les pixels RGBA d’un canvas
- Appliquer un filtre :
  - en **JavaScript** (référence)
  - en **WebAssembly (Rust)** (performance)
- Observer l’effet visuel et les temps d’exécution

---

## 🛠️ Prérequis

### 1. Node.js

- **Node.js** ≥ 18  
  👉 https://nodejs.org/

Vérification :

```bash
node -v
```

---

### 2. Rust

Rust est utilisé pour écrire le code WebAssembly.

Installation (recommandée via `rustup`) :

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Après installation, **ouvrir un nouveau terminal**, puis vérifier :

```bash
rustc --version
cargo --version
```

---

### 3. wasm-pack

Outil pour compiler le code Rust vers WebAssembly.

Installation :

```bash
cargo install wasm-pack
```

Vérification :

```bash
wasm-pack --version
```

---

## 📦 Installation du projet

### 1. Installer les dépendances front-end

```bash
cd web
npm install
```

---

### 2. Compiler le module WebAssembly

Depuis le dossier `wasm/` :

```bash
cd ../wasm
wasm-pack build --target web --out-dir ../web/src/wasm_pkg
```

> ⚠️ Cette étape est indispensable :  
> elle génère le fichier `.wasm` et les bindings JavaScript utilisés par l’application.

---

## ▶️ Lancer l’application

Depuis le dossier `web/` :

```bash
npm run dev
```

Puis ouvrir le navigateur à l’adresse indiquée (généralement) :

```
http://localhost:5173
```

---

## 🧪 Utilisation

1. Charger une image (JPEG ou PNG)
2. Cliquer sur :
   - **Filtre JS (grayscale)**
   - **Filtre WASM (grayscale)**
3. Observer la différence de temps d’exécution
4. Utiliser le **slider d’inversion (WASM)** pour un effet temps réel

---

## 📁 Structure du projet

```
.
├── wasm/                 # Module Rust compilé en WebAssembly
│   ├── src/lib.rs
│   └── Cargo.toml
├── web/                  # Application front-end (Vite + TypeScript)
│   ├── src/
│   │   ├── main.ts
│   │   └── wasm_pkg/     # WASM généré (automatique)
│   ├── index.html
│   └── vite.config.ts
```

---

## 🧠 Points pédagogiques clés

- WebAssembly manipule directement des **buffers binaires**
- JavaScript gère l’UI et l’affichage
- WebAssembly exécute le **calcul intensif**
- Tout s’exécute **localement dans le navigateur**
- Les performances sont mesurées avec `performance.now()`

---

## 🔁 Recompiler le WASM après modification

À chaque modification de `wasm/src/lib.rs` :

```bash
cd wasm
wasm-pack build --target web --out-dir ../web/src/wasm_pkg
```

Puis rafraîchir la page du navigateur.

---

## 🚀 Pour aller plus loin

- Ajouter d’autres filtres (seuil, blur, posterize)
- Appliquer plusieurs passes de filtres
- Comparer avec un traitement 100% JavaScript
- Explorer WebAssembly SIMD

---

Bon TP 🚀  
Et bravo : vous venez d’utiliser WebAssembly **pour de vrai** dans un navigateur 👏
