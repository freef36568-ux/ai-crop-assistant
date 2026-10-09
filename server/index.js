// DEPRECATED — this file used to be a second, competing backend that returned
// hardcoded/fake disease data (e.g. always "Early Blight", isDemo: true)
// whenever no Gemini key was configured. That violated the project's
// "never fabricate AI results" rule, and it duplicated backend/'s routes on
// the same port, so only one of them was ever actually reachable.
//
// The real, canonical backend now lives in backend/server.js — it does the
// same job (crop detection, disease diagnosis, chat) but only ever returns
// real Gemini Vision results or an honest "Unknown / confidence 0" response,
// never an invented one. It also includes the /api/analyses history
// endpoints this file used to provide.
//
// package.json's "server" and "start" scripts now point at backend/server.js.
// This file is kept only so `node server/index.js` doesn't 404 on old habits
// or bookmarks — it simply boots the real server instead.

import '../backend/server.js';
