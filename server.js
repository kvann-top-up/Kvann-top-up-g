const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const packages = {
  freefire: [
    { id: "ff100", amount: 100, currency: "Diamonds", price: 0.99 },
    { id: "ff310", amount: 310, currency: "Diamonds", price: 2.99 },
    { id: "ff520", amount: 520, currency: "Diamonds", price: 4.99 },
    { id: "ff1060", amount: 1060, currency: "Diamonds", price: 9.99 },
    { id: "ff2180", amount: 2180, currency: "Diamonds", price: 19.99 },
    { id: "ff5600", amount: 5600, currency: "Diamonds", price: 49.99 }
  ],
  pubg: [
    { id: "pubg60", amount: 60, currency: "UC", price: 0.99 },
    { id: "pubg325", amount: 325, currency: "UC", price: 4.99 },
    { id: "pubg660", amount: 660, currency: "UC", price: 9.99 },
    { id: "pubg1800", amount: 1800, currency: "UC", price: 24.99 },
    { id: "pubg3850", amount: 3850, currency: "UC", price: 49.99 },
    { id: "pubg8100", amount: 8100, currency: "UC", price: 99.99 }
  ],
  mlbb: [
    { id: "ml86", amount: 86, currency: "Diamonds", price: 1.49 },
    { id: "ml172", amount: 172, currency: "Diamonds", price: 2.99 },
    { id: "ml257", amount: 257, currency: "Diamonds", price: 4.49 },
    { id: "ml706", amount: 706, currency: "Diamonds", price: 11.99 },
    { id: "ml2195", amount: 2195, currency: "Diamonds", price: 34.99 },
    { id: "ml3688", amount: 3688, currency: "Diamonds", price: 54.99 }
  ]
};

const games = {
  freefire: { name: "Free Fire", short: "FF", unit: "Diamonds" },
  pubg: { name: "PUBG Mobile", short: "PUBG", unit: "UC" },
  mlbb: { name: "Mobile Legends", short: "MLBB", unit: "Diamonds" }
};

// Demo-only in-memory order store.
// Replace with MySQL/PostgreSQL/MongoDB for production.
const orders = new Map();

app.get("/api/games", (_req, res) => {
  res.json(games);
});

app.get("/api/packages/:game", (req, res) => {
  const list = packages[req.params.game];
  if (!list) return res.status(404).json({ error: "Game not found" });
  res.json(list);
});

app.post("/api/orders", (req, res) => {
  const { game, playerId, packageId, paymentMethod } = req.body;

  if (!games[game]) return res.status(400).json({ error: "Invalid game" });
  if (!playerId || String(playerId).trim().length < 3) {
    return res.status(400).json({ error: "Invalid Player ID" });
  }

  const selected = packages[game].find(p => p.id === packageId);
  if (!selected) return res.status(400).json({ error: "Invalid package" });

  const orderId = "KV" + Date.now().toString(36).toUpperCase() +
    crypto.randomBytes(2).toString("hex").toUpperCase();

  const order = {
    orderId,
    game,
    gameName: games[game].name,
    playerId: String(playerId).trim(),
    package: selected,
    paymentMethod: paymentMethod || "manual",
    amount: selected.price,
    status: "PENDING_PAYMENT",
    topupStatus: "WAITING",
    createdAt: new Date().toISOString()
  };

  orders.set(orderId, order);
  res.status(201).json(order);
});

// DEMO payment confirmation.
// In production, call this from your verified payment gateway webhook.
app.post("/api/orders/:id/pay", (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  order.status = "PAID";
  order.topupStatus = "PROCESSING";

  // TODO: Replace with your licensed top-up provider API.
  // await topupProvider.createOrder({...})
  setTimeout(() => {
    const current = orders.get(order.orderId);
    if (current) {
      current.topupStatus = "SUCCESS";
      current.status = "COMPLETED";
    }
  }, 1200);

  res.json(order);
});

app.get("/api/orders/:id", (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

app.get("/api/admin/orders", (_req, res) => {
  res.json([...orders.values()].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  ));
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`KVANN TOP UP running at http://localhost:${PORT}`);
});
