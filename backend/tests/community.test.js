/**
 * Community, profile, country and error-handler tests.
 * Run:  node --test tests/community.test.js
 */
process.env.REST_COUNTRIES_API_KEY = "sk-super-secret-key-123";
process.env.JWT_SECRET = "test-secret";

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const mongoose = require("mongoose");

const Post = require("../models/Post");
const User = require("../models/User");
const community = require("../controllers/communityController");
const { updateProfile, getProfile } = require("../controllers/userController");

const makeRes = () => ({
  statusCode: 200, body: null,
  status(c) { this.statusCode = c; return this; },
  json(b) { this.body = b; return this; },
});
const oid = () => new mongoose.Types.ObjectId();
const silence = async (fn) => { const o = console.error; console.error = () => {}; try { return await fn(); } finally { console.error = o; } };

// ---------------------------------------------------------------- pagination
const findChain = (docs) => {
  const q = {
    _filter: null, _limit: undefined, _sort: null,
    sort(s) { q._sort = s; return q; },
    limit(n) { q._limit = n; return q; },
    populate() { return q; },
    then(res, rej) { return Promise.resolve(docs.slice(0, q._limit)).then(res, rej); },
  };
  return q;
};

const withFind = async (docs, fn) => {
  const orig = Post.find; let captured;
  Post.find = (filter) => { captured = findChain(docs); captured._filter = filter; return captured; };
  try { return await fn(() => captured); } finally { Post.find = orig; }
};

const fakePosts = (n) => Array.from({ length: n }, (_, i) => ({ _id: `${(1000 - i).toString(16).padStart(24, "0")}` }));

test("pagination: returns one page + cursor, asks the DB for limit+1", async () => {
  await withFind(fakePosts(25), async (q) => {
    const res = makeRes();
    await community.getPosts({ query: { limit: "10" } }, res);
    assert.equal(res.body.data.length, 10);
    assert.equal(res.body.pagination.hasMore, true);
    assert.equal(res.body.pagination.nextCursor, res.body.data[9]._id);
    assert.equal(q()._limit, 11, "fetched limit+1 to detect another page");
    assert.deepEqual(q()._sort, { _id: -1 });
  });
});

test("pagination: last page has hasMore=false and no cursor", async () => {
  await withFind(fakePosts(4), async () => {
    const res = makeRes();
    await community.getPosts({ query: { limit: "10" } }, res);
    assert.equal(res.body.data.length, 4);
    assert.equal(res.body.pagination.hasMore, false);
    assert.equal(res.body.pagination.nextCursor, null);
  });
});

test("pagination: 'before' cursor becomes an _id < filter", async () => {
  await withFind(fakePosts(3), async (q) => {
    const cursor = "0000000000000000000003e8";
    await community.getPosts({ query: { before: cursor } }, makeRes());
    assert.deepEqual(q()._filter, { _id: { $lt: cursor } });
  });
});

test("pagination: limit is clamped (1..50) and defaults to 10", async () => {
  for (const [input, expected] of [["9999", 50], ["0", 1], ["-5", 1], ["abc", 10], [undefined, 10]]) {
    await withFind(fakePosts(100), async () => {
      const res = makeRes();
      await community.getPosts({ query: { limit: input } }, res);
      assert.equal(res.body.pagination.limit, expected, `limit=${input}`);
    });
  }
});

test("pagination: malformed cursor is a 400, not a 500", async () => {
  for (const bad of ["abc", "12345", "{$gt:''}", ["x"]]) {
    const res = makeRes();
    await community.getPosts({ query: { before: bad } }, res);
    assert.equal(res.statusCode, 400, JSON.stringify(bad));
  }
});

// ---------------------------------------------------------- post validation
const create = async (body) => {
  let created = null;
  const oc = Post.create, of = Post.findById;
  Post.create = async (doc) => { created = doc; return { _id: oid() }; };
  Post.findById = () => ({ populate: async () => ({ ...created }) });
  const res = makeRes();
  try { await community.createPost({ body, user: { id: "u1" } }, res); } finally { Post.create = oc; Post.findById = of; }
  return { res, created };
};

test("createPost: whitespace-only title/content -> 400 (was a confusing 500)", async () => {
  for (const body of [{ title: "   ", content: "hello" }, { title: "Hi", content: " \n\t " }, {}]) {
    const { res, created } = await create(body);
    assert.equal(res.statusCode, 400, JSON.stringify(body));
    assert.equal(created, null);
  }
});

test("createPost: non-string values are rejected, not crashed on", async () => {
  for (const body of [{ title: { a: 1 }, content: "x" }, { title: "x", content: ["y"] }, { title: 123, content: "x" }]) {
    const { res } = await create(body);
    assert.equal(res.statusCode, 400, JSON.stringify(body));
  }
});

test("createPost: over-long fields are 400 with a helpful message", async () => {
  const t = await create({ title: "a".repeat(121), content: "ok" });
  assert.equal(t.res.statusCode, 400); assert.match(t.res.body.message, /120/);
  const c = await create({ title: "ok", content: "a".repeat(2001) });
  assert.equal(c.res.statusCode, 400); assert.match(c.res.body.message, /2000/);
});

test("createPost: valid input is trimmed and saved", async () => {
  const { res, created } = await create({ title: "  Bali tips  ", content: "  Go in May  ", destination: "  Indonesia " });
  assert.equal(res.statusCode, 201);
  assert.equal(created.title, "Bali tips");
  assert.equal(created.content, "Go in May");
  assert.equal(created.destination, "Indonesia");
});

// ------------------------------------------------- atomic likes and comments
// In-memory stand-in for MongoDB's per-document atomic updates.
const installFakeDb = (store) => {
  const orig = Post.findOneAndUpdate;
  Post.findOneAndUpdate = (filter, update) => {
    const has = (doc, id) => doc.likes.some((l) => String(l) === String(id));
    const doc = store.find((p) => String(p._id) === String(filter._id) && (filter.likes === undefined || has(p, filter.likes)));
    if (doc) {                                   // applied atomically, like MongoDB
      if (update.$pull) doc.likes = doc.likes.filter((l) => String(l) !== String(update.$pull.likes));
      if (update.$addToSet && !has(doc, update.$addToSet.likes)) doc.likes.push(update.$addToSet.likes);
      if (update.$push) doc.comments.push({ ...update.$push.comments });
    }
    const q = { populate: () => q, then: (a, b) => Promise.resolve(doc || null).then(a, b) };
    return q;
  };
  return () => { Post.findOneAndUpdate = orig; };
};

test("like: toggles on and off", async () => {
  const post = { _id: oid(), likes: [], comments: [] }; const user = oid();
  const restore = installFakeDb([post]);
  try {
    const req = { params: { id: String(post._id) }, user: { _id: user, id: String(user) } };
    let res = makeRes(); await community.toggleLike(req, res);
    assert.equal(res.body.liked, true); assert.equal(post.likes.length, 1);
    res = makeRes(); await community.toggleLike(req, res);
    assert.equal(res.body.liked, false); assert.equal(post.likes.length, 0);
  } finally { restore(); }
});

test("like RACE: simultaneous requests from one user never duplicate or corrupt the likes", async () => {
  // N concurrent toggles must always end in a state some serial order could
  // produce: this user is in `likes` at most once. (The exact final state
  // depends on how the requests interleave, so the invariant is what we assert.)
  for (const n of [2, 3, 10, 11]) {
    const post = { _id: oid(), likes: [], comments: [] }; const user = oid();
    const restore = installFakeDb([post]);
    try {
      const req = { params: { id: String(post._id) }, user: { _id: user, id: String(user) } };
      const results = await Promise.all(Array.from({ length: n }, () => {
        const res = makeRes();
        return community.toggleLike(req, res).then(() => res);
      }));
      assert.ok(post.likes.length <= 1, `n=${n}: duplicate like stored: ${post.likes.length}`);
      assert.ok(results.every((r) => r.statusCode === 200));
    } finally { restore(); }
  }
});

test("like: different users liking at once are all kept (no lost update)", async () => {
  const post = { _id: oid(), likes: [], comments: [] };
  const users = Array.from({ length: 8 }, oid);
  const restore = installFakeDb([post]);
  try {
    await Promise.all(users.map((u) => community.toggleLike({ params: { id: String(post._id) }, user: { _id: u, id: String(u) } }, makeRes())));
    assert.equal(post.likes.length, 8);
  } finally { restore(); }
});

test("like: unknown post / malformed id -> 404", async () => {
  const restore = installFakeDb([]);
  try {
    for (const id of [String(oid()), "nope"]) {
      const res = makeRes();
      await community.toggleLike({ params: { id }, user: { _id: oid(), id: "u" } }, res);
      assert.equal(res.statusCode, 404, id);
    }
  } finally { restore(); }
});

test("comments: simultaneous comments are all kept", async () => {
  const post = { _id: oid(), likes: [], comments: [] };
  const restore = installFakeDb([post]);
  try {
    await Promise.all(["a", "b", "c", "d"].map((t) => community.addComment({ params: { id: String(post._id) }, body: { text: t }, user: { id: "u1" } }, makeRes())));
    assert.equal(post.comments.length, 4);
  } finally { restore(); }
});

test("comments: empty / whitespace / too long / non-string -> 400", async () => {
  const restore = installFakeDb([]);
  try {
    for (const text of ["", "   ", "x".repeat(501), 42, { a: 1 }, undefined]) {
      const res = makeRes();
      await community.addComment({ params: { id: String(oid()) }, body: { text }, user: { id: "u1" } }, res);
      assert.equal(res.statusCode, 400, JSON.stringify(text));
    }
  } finally { restore(); }
});

// ------------------------------------------------------------- profile
test("profile: invalid input gets a clear 400", async () => {
  for (const [body, pattern] of [
    [{ name: "   " }, /empty/i], [{ name: 5 }, /text/i],
    [{ bio: "x".repeat(501) }, /500/], [{ country: ["x"] }, /text/i],
  ]) {
    const res = makeRes();
    await updateProfile({ body, user: { id: "u1" } }, res);
    assert.equal(res.statusCode, 400, JSON.stringify(body));
    assert.match(res.body.message, pattern);
  }
});

test("profile: database failure never leaks internals", async () => {
  const orig = User.findById;
  User.findById = () => { throw new Error("MongoServerError: connection to mongodb://admin:hunter2@10.0.0.5 failed"); };
  try {
    for (const [fn, req] of [[getProfile, { user: { id: "u" } }], [updateProfile, { body: { name: "A" }, user: { id: "u" } }]]) {
      const res = makeRes();
      await silence(() => fn(req, res));
      assert.equal(res.statusCode, 500);
      const text = JSON.stringify(res.body);
      assert.ok(!/hunter2|mongodb|10\.0\.0\.5|MongoServerError/.test(text), text);
    }
  } finally { User.findById = orig; }
});

test("profile: valid update is trimmed", async () => {
  const user = new User({ name: "Old", email: "a@b.com", password: "x" });
  const orig = User.findById; User.findById = async () => user;
  user.save = async () => user;
  try {
    const res = makeRes();
    await updateProfile({ body: { name: "  New Name ", bio: " hi " }, user: { id: "u1" } }, res);
    assert.equal(res.body.name, "New Name"); assert.equal(res.body.bio, "hi");
  } finally { User.findById = orig; }
});

// ------------------------------------------------------------- countries
const countryController = require("../controllers/countryController");
const withUpstream = async (response, fn) => {
  const orig = global.fetch; global.fetch = async () => response;
  try { return await fn(); } finally { global.fetch = orig; }
};

test("countries: upstream auth failure is a generic 502 (key + upstream text never leak)", async () => {
  await withUpstream({ ok: false, status: 401, text: async () => JSON.stringify({ message: "Invalid API key sk-super-secret-key-123" }) }, async () => {
    for (const [fn, req] of [[countryController.fetchCountryByCode, { params: { code: "FRA" } }], [countryController.fetchCountryByName, { params: { name: "France" } }], [countryController.fetchCountries, {}]]) {
      const res = makeRes();
      await silence(() => fn(req, res));
      assert.equal(res.statusCode, 502);
      assert.ok(!/sk-super-secret|Invalid API key/.test(JSON.stringify(res.body)), JSON.stringify(res.body));
    }
  });
});

test("countries: genuinely unknown country is a clean 404", async () => {
  await withUpstream({ ok: false, status: 404, text: async () => JSON.stringify({ message: "nope" }) }, async () => {
    const res = makeRes();
    await countryController.fetchCountryByCode({ params: { code: "ZZZ" } }, res);
    assert.equal(res.statusCode, 404);
    assert.equal(res.body.message, "Country not found");
  });
});

test("countries: missing input is a 400", async () => {
  const res = makeRes();
  await countryController.fetchCountryByName({ params: { name: "" } }, res);
  assert.equal(res.statusCode, 400);
});

// ------------------------------------------------------------- error handler
test("error handler: bad JSON, unknown route and crashes all return clean JSON", async () => {
  const express = require("express");
  const { notFound, errorHandler } = require("../middleware/errorHandler");
  const app = express();
  app.use(express.json({ limit: "1kb" }));
  app.post("/api/echo", (req, res) => res.json(req.body));
  app.get("/api/boom", () => { throw new Error("secret stack detail /home/app/db.js:42"); });
  app.use("/api", notFound);
  app.use(errorHandler);

  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const call = (method, path, body) => new Promise((resolve, reject) => {
    const req = http.request({ port, method, path, headers: { "Content-Type": "application/json" } }, (res) => {
      let data = ""; res.on("data", (c) => (data += c)); res.on("end", () => resolve({ status: res.statusCode, type: res.headers["content-type"], data }));
    });
    req.on("error", reject); if (body) req.write(body); req.end();
  });

  const o = console.error; console.error = () => {};
  try {
    const badJson = await call("POST", "/api/echo", "{not json");
    assert.equal(badJson.status, 400); assert.match(badJson.type, /json/);

    const tooBig = await call("POST", "/api/echo", JSON.stringify({ x: "a".repeat(5000) }));
    assert.equal(tooBig.status, 413);

    const missing = await call("GET", "/api/does-not-exist");
    assert.equal(missing.status, 404); assert.match(missing.type, /json/);

    const boom = await call("GET", "/api/boom");
    assert.equal(boom.status, 500); assert.match(boom.type, /json/);
    assert.ok(!/secret stack|db\.js/.test(boom.data), "no stack/path leaked: " + boom.data);
  } finally { console.error = o; await new Promise((r) => server.close(r)); }
});
