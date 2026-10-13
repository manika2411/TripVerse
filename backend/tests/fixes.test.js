/**
 * Tests for the non-budget backend fixes.   Run:  node --test tests/fixes.test.js
 */
process.env.REST_COUNTRIES_API_KEY = "test-key";
process.env.JWT_SECRET = "test-secret";

const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const makeRes = () => ({
  statusCode: 200, body: null,
  status(c) { this.statusCode = c; return this; },
  json(b) { this.body = b; return this; },
});

// ---------- country list is cached (was re-downloaded on every request) ----------
test("getCountries downloads once and serves the cache afterwards", async () => {
  let upstreamCalls = 0;
  const realFetch = global.fetch;
  global.fetch = async () => {
    upstreamCalls += 1;
    return {
      ok: true, status: 200,
      text: async () => JSON.stringify({ data: { objects: [
        { names: { common: "Mexico" }, codes: { alpha_3: "MEX", alpha_2: "MX" }, currencies: [{ code: "MXN" }] },
      ], meta: { more: false } } }),
    };
  };

  try {
    const { getCountries } = require("../services/countryService");
    // 5 concurrent requests -> must share ONE upstream download
    const results = await Promise.all([1, 2, 3, 4, 5].map(() => getCountries()));
    assert.equal(upstreamCalls, 1, "concurrent calls share one download");
    assert.equal(results[0].length, 1);

    await getCountries();
    await getCountries();
    assert.equal(upstreamCalls, 1, "later calls hit the cache");
  } finally {
    global.fetch = realFetch;
  }
});

// ---------- trips ----------
test("trip is NOT 'Completed' on its last day (date-only end date)", () => {
  const Trip = require("../models/Trip");
  const controller = require("../controllers/tripController");
  const today = new Date();
  const midnightToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const yesterday = new Date(midnightToday.getTime() - 24 * 3600 * 1000);

  const trips = [
    new Trip({ user: new mongoose.Types.ObjectId(), tripName: "Last day", destination: "X", startDate: yesterday, endDate: midnightToday, status: "Upcoming" }),
  ];
  const origFind = Trip.find;
  Trip.find = () => ({ sort: async () => trips });
  trips[0].save = async () => trips[0];
  const res = makeRes();
  return controller.getTrips({ user: { id: "u1" } }, res).then(() => {
    Trip.find = origFind;
    assert.equal(res.body[0].status, "Ongoing");
  });
});

test("getTrips survives a failing status save (previously an unhandled rejection)", async () => {
  const Trip = require("../models/Trip");
  const { getTrips } = require("../controllers/tripController");
  const past = new Date("2020-01-01");
  const trip = new Trip({ user: new mongoose.Types.ObjectId(), tripName: "Old", destination: "X", startDate: past, endDate: past, status: "Upcoming" });
  trip.save = async () => { throw new Error("db down"); };
  const origFind = Trip.find;
  Trip.find = () => ({ sort: async () => [trip] });

  let unhandled = null;
  const onUnhandled = (e) => { unhandled = e; };
  process.on("unhandledRejection", onUnhandled);

  const res = makeRes();
  const origErr = console.error; console.error = () => {};
  try {
    await getTrips({ user: { id: "u1" } }, res);
    await new Promise((r) => setTimeout(r, 20));
  } finally {
    console.error = origErr; Trip.find = origFind; process.off("unhandledRejection", onUnhandled);
  }
  assert.equal(res.statusCode, 200);
  assert.equal(res.body[0].status, "Completed");
  assert.equal(unhandled, null, "no unhandled rejection");
});

// ---------- login ----------
test("login with missing fields returns 400, not 500", async () => {
  const { loginUser } = require("../controllers/authController");
  for (const body of [{}, { email: "a@b.com" }, { password: "x" }, { email: 5, password: "x" }]) {
    const res = makeRes();
    await loginUser({ body }, res);
    assert.equal(res.statusCode, 400, JSON.stringify(body));
  }
});

// ---------- budget delete with a malformed id ----------
test("deleting a budget with a malformed id returns 404, not 500", async () => {
  const { deleteBudget } = require("../controllers/budgetController");
  const res = makeRes();
  await deleteBudget({ params: { id: "not-an-id" }, user: { _id: new mongoose.Types.ObjectId() } }, res);
  assert.equal(res.statusCode, 404);
});

// ---------- currency route input validation ----------
test("currency rate route rejects non-currency input", async () => {
  const router = require("../routes/currencyRoutes");
  const layer = router.stack.find((l) => l.route && l.route.path === "/rate");
  const handler = layer.route.stack[0].handle;
  const res = makeRes();
  await handler({ query: { from: "../../etc", to: "USD" } }, res);
  assert.equal(res.statusCode, 400);
});
