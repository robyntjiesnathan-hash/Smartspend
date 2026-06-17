// Empty shim — Supabase uses @opentelemetry/api as an optional peer dep for
// tracing only. Metro can't resolve it, so we map it here to a no-op object.
module.exports = {};
