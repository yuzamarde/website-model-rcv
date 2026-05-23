/**
 * VISITOR TRACKING — How It Works
 *
 * Tracking is automatic — no dedicated /track endpoint.
 * Visiting these two public endpoints triggers visitor recording server-side:
 *
 *   GET /api/public/user/site/:apiKey/basic
 *     → records a row in the `visitor` collection (home/landing visit)
 *
 *   GET /api/public/user/site/:apiKey/portfolio/:portfolioId
 *     → records a row in the `visitorPortfolio` collection (portfolio-detail visit)
 *
 * The :apiKey is the user's rotatable publishable key (pk_live_<48hex>).
 * It is NOT the userId UUID. Get it from GET /api/user/personal-info → publicApiKey.
 *
 * ─── WHAT THE FE WEBSITE NEEDS TO DO ─────────────────────────────────────────
 *
 *   1. On home/landing page render — call /basic to load user data.
 *      The visit is recorded as a side-effect.
 *
 *   2. On portfolio-detail page render — call /portfolio/:portfolioId.
 *      The portfolio visit is recorded as a side-effect.
 *
 *   No explicit /track call is needed. No query params for tracking.
 *
 * ─── WHAT GETS RECORDED ──────────────────────────────────────────────────────
 *
 *   visitor collection (home visits):
 *   Field        | Source
 *   -------------|------------------------------------------------
 *   userId       | resolved from :apiKey
 *   ipHash       | SHA-256(rawIp + salt) — never the raw IP
 *   country      | ip-api.com geolocation
 *   countryCode  | ip-api.com geolocation
 *   city         | ip-api.com geolocation
 *   region       | ip-api.com geolocation (regionName)
 *   latitude     | ip-api.com geolocation
 *   longitude    | ip-api.com geolocation
 *   referrer     | HTTP Referer header (browser sets automatically)
 *   device       | UA-parser: 'mobile' | 'tablet' | 'desktop'
 *   browser      | UA-parser: e.g. 'Chrome', 'Safari', 'Firefox'
 *   visitedAt    | Server timestamp
 *
 *   visitorPortfolio collection (portfolio-detail visits) — same fields + portfolioId.
 *
 * ─── DEDUP BEHAVIOR ──────────────────────────────────────────────────────────
 *
 *   Redis key: `visitor-dedup:{ipHash}:{userId}:{page}:{date}`
 *   where `page` = portfolioId for portfolio visits, 'home' for landing visits.
 *   TTL: 25 hours.
 *
 *   Same visitor, same page, same day → only 1 record written.
 *   Same visitor, different portfolio items → 1 record per item per day.
 *
 * ─── TESTING: CURL ───────────────────────────────────────────────────────────
 *
 *   Replace <apiKey> with a user's publicApiKey (from GET /api/user/personal-info).
 *
 *   # 1 — Simulate a home/landing visit
 *   curl "http://localhost:5000/api/public/user/site/<apiKey>/basic"
 *
 *   # 2 — Simulate a portfolio-detail visit
 *   curl "http://localhost:5000/api/public/user/site/<apiKey>/portfolio/<portfolioId>"
 *
 * ─── VERIFYING DATA WAS RECORDED ─────────────────────────────────────────────
 *
 *   GET /api/visitor/dashboard            → home visitor analytics
 *   GET /api/visitor/recent               → last 20 home visitors
 *   GET /api/visitor/portfolio-dashboard  → portfolio-visit analytics
 *   GET /api/visitor/portfolio-recent     → last 20 portfolio visitors (with portfolioId)
 *   GET /api/visitor/portfolio-top        → top visited portfolio items
 *
 * ─── RATE LIMIT ──────────────────────────────────────────────────────────────
 *
 *   /basic and /portfolio/:portfolioId both use their respective endpoint rate limits.
 *   Bots (Googlebot, Bingbot, etc.) are silently dropped — no record written.
 */

import { z } from 'zod';

// ── Track query params ──────────────────────────────────────────────────────

export const TrackQuerySchema = z.object({
    portfolioId: z.string().optional(),
    path:        z.string().optional(),
});

export type TrackQuery = z.infer<typeof TrackQuerySchema>;

// ── Track response ──────────────────────────────────────────────────────────

export const TrackResponseSchema = z.object({
    ok: z.literal(true),
});

export type TrackResponse = z.infer<typeof TrackResponseSchema>;

// ── Visitor record shape (as returned by /api/visitor/recent) ───────────────

export const VISITOR_DEVICE_VALUES = ['mobile', 'tablet', 'desktop'] as const;
export type VisitorDevice = (typeof VISITOR_DEVICE_VALUES)[number];

export const VisitorRecordSchema = z.object({
    country:     z.string().nullable(),
    countryCode: z.string().nullable(),
    city:        z.string().nullable(),
    region:      z.string().nullable(),
    latitude:    z.number().nullable(),
    longitude:   z.number().nullable(),
    referrer:    z.string().nullable(),
    device:      z.enum(VISITOR_DEVICE_VALUES).nullable(),
    browser:     z.string().nullable(),
    visitedAt:   z.string(),
});

export type VisitorRecord = z.infer<typeof VisitorRecordSchema>;

// ── Portfolio visitor record shape (as returned by /api/visitor/portfolio-recent) ──

export const VisitorPortfolioRecordSchema = z.object({
    portfolioId: z.string().nullable(),
    country:     z.string().nullable(),
    countryCode: z.string().nullable(),
    city:        z.string().nullable(),
    region:      z.string().nullable(),
    latitude:    z.number().nullable(),
    longitude:   z.number().nullable(),
    referrer:    z.string().nullable(),
    device:      z.enum(VISITOR_DEVICE_VALUES).nullable(),
    browser:     z.string().nullable(),
    visitedAt:   z.string(),
});

export type VisitorPortfolioRecord = z.infer<typeof VisitorPortfolioRecordSchema>;

// ── Examples ────────────────────────────────────────────────────────────────

export const TRACK_RESPONSE_EXAMPLE: TrackResponse = {
    ok: true,
};

export const VISITOR_RECORD_EXAMPLE: VisitorRecord = {
    country:     'Indonesia',
    countryCode: 'ID',
    city:        'Jakarta',
    region:      'Jakarta',
    latitude:    -6.2146,
    longitude:   106.8451,
    referrer:    'https://www.google.com/',
    device:      'desktop',
    browser:     'Chrome',
    visitedAt:   '2026-05-08T10:00:00.000Z',
};

export const VISITOR_PORTFOLIO_RECORD_EXAMPLE: VisitorPortfolioRecord = {
    portfolioId: '64f1a2b3c4d5e6f7a8b9c0d9',
    country:     'Japan',
    countryCode: 'JP',
    city:        'Tokyo',
    region:      'Tokyo',
    latitude:    35.6895,
    longitude:   139.6917,
    referrer:    null,
    device:      'mobile',
    browser:     'Safari',
    visitedAt:   '2026-05-08T10:05:00.000Z',
};

// ─── RFC 0014 + RFC 0015 + Phase 10.C — WRITE schemas (2026-05-23) ──────────
//
// VisitorWriteSchema + VisitorPortfolioWriteSchema canonical untuk porto-rs
// `track_visitor` middleware insert path (NOT for /api/visitor/* analytics read
// — those use VisitorRecordSchema / VisitorPortfolioRecordSchema above).
//
// SSOT migration: previously porto-rs Rust struct mirrored
// `porto-be/src/contracts/definitions/visitor.js` (model-rcv) MANUALLY with
// no enforcement. This schema centralizes the write-shape oracle here in
// website-model-rcv (already vendored by porto-rs) — single canonical source
// for the public-API-surface write specification.
//
// porto-be Mongoose model continues to derive from definitions/visitor.js
// during transition; sync gate script `porto-be/scripts/check-visitor-schema-sync.js`
// enforces these stay byte-equal. Future RFC may collapse the dual sources.

// Visitor write — full 14 fields (geo + UA + visitorId).
// Mirrors `porto-be/src/contracts/definitions/visitor.js` VISITOR_FIELDS.
export const VisitorWriteSchema = z.object({
    userId:      z.string(),                              // UUID, required (FK to User)
    ipHash:      z.string(),                              // SHA-256(rawIp + salt), required
    visitorId:   z.string().nullable().optional(),        // UUID v4 from X-Porto-Visitor-Id (Phase 6)
    country:     z.string().nullable().optional(),
    countryCode: z.string().nullable().optional(),
    city:        z.string().nullable().optional(),
    region:      z.string().nullable().optional(),
    latitude:    z.number().nullable().optional(),
    longitude:   z.number().nullable().optional(),
    referrer:    z.string().nullable().optional(),
    device:      z.string().nullable().optional(),
    browser:     z.string().nullable().optional(),
    visitedAt:   z.union([z.string(), z.date()]).optional(),
});

export type VisitorWrite = z.infer<typeof VisitorWriteSchema>;

// VisitorPortfolio write — SLIM 5 fields per Phase 7 BREAKING change.
// Mirrors `porto-be/src/contracts/definitions/visitorPortfolio.js`
// VISITOR_PORTFOLIO_FIELDS post-Phase-7.
//
// Geo/UA NOT in this doc — analytics queries JOIN dengan `visitors` via visitorId.
export const VisitorPortfolioWriteSchema = z.object({
    userId:      z.string(),
    portfolioId: z.string(),
    ipHash:      z.string(),
    visitorId:   z.string().nullable().optional(),
    visitedAt:   z.union([z.string(), z.date()]).optional(),
});

export type VisitorPortfolioWrite = z.infer<typeof VisitorPortfolioWriteSchema>;

export const VISITOR_WRITE_EXAMPLE: VisitorWrite = {
    userId:      '0f2b5534-6f72-4ee9-ae38-347e8e0cd48f',
    ipHash:      '7e3ce1d88827abe35be845290a93631234567890abcdef1234567890abcdef12',
    visitorId:   '550e8400-e29b-41d4-a716-446655440000',
    country:     'Indonesia',
    countryCode: 'ID',
    city:        'Malang',
    region:      'East Java',
    latitude:    -7.9819,
    longitude:   112.6265,
    referrer:    null,
    device:      'desktop',
    browser:     'Chrome',
    visitedAt:   '2026-05-23T07:22:41.789Z',
};

export const VISITOR_PORTFOLIO_WRITE_EXAMPLE: VisitorPortfolioWrite = {
    userId:      '0f2b5534-6f72-4ee9-ae38-347e8e0cd48f',
    portfolioId: '6a1002af49f3dc4d1c55d8ed',
    ipHash:      '7e3ce1d88827abe35be845290a93631234567890abcdef1234567890abcdef12',
    visitorId:   '550e8400-e29b-41d4-a716-446655440000',
    visitedAt:   '2026-05-23T07:23:40.387Z',
};
