---
name: quidkey-pay-by-bank-integration
description: Integrate Quidkey Pay-by-Bank — authenticate with OAuth 2.0 client_credentials, create hosted payment links or embed an iframe checkout, then accept account-to-account bank payments across the EU and UK.
---

# Quidkey Pay-by-Bank Integration

## When to use this skill

Use this skill when a user wants to accept Pay-by-Bank (account-to-account) payments through Quidkey — for example: SaaS billing, invoicing, marketplace payouts, checkout for an e-commerce site, or any flow where the alternative is card payments and the user wants lower fees plus direct bank settlement.

Quidkey supports two integration shapes:

- **Hosted Checkout (Payment Links)** — Quidkey hosts the entire payment page at a shareable URL. Zero frontend code on the merchant side. Best for invoicing, B2B, ad-hoc collections, email/SMS-driven flows.
- **Embedded Payment Flow** — Quidkey returns an `iframe_url` you embed inside your own checkout. Best when the merchant already has a checkout page and wants Pay-by-Bank as an option alongside cards.

Pick Hosted Checkout if the agent is asked to "create a payment link" or "send an invoice". Pick Embedded if the agent is asked to "add Quidkey to our checkout".

## Prerequisites

1. A Quidkey merchant account — sign up at https://console.quidkey.com
2. A `client_id` and `client_secret` from the console
3. Outbound HTTPS to `https://core.quidkey.com` (or the env-specific host below)

## Environments

| Env | Base URL | Notes |
|-----|----------|-------|
| prd | `https://core.quidkey.com/api/v1` | Production. Real money. |
| tst | `https://core-tst.quidkey.com/api/v1` | Shared test environment. |
| dev | `https://core-dev.quidkey.com/api/v1` | Local development. |

**Critical:** Include `"test_transaction": true` in every create-payment request body in dev/tst. Without it, the request will be treated as live by the connected sandbox bank simulators. Always omit it (or set `false`) in prd.

## Step 1 — Authenticate (OAuth 2.0 client_credentials)

Exchange your `client_id` and `client_secret` for an `access_token` at the token endpoint.

```bash
curl -X POST https://core.quidkey.com/api/v1/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=client_credentials" \
  --data-urlencode "client_id=YOUR_CLIENT_ID" \
  --data-urlencode "client_secret=YOUR_CLIENT_SECRET"
```

Response:

```json
{
  "success": true,
  "access_token": "eyJhbGciOi...",
  "refresh_token": "rt_...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

**Token lifecycle:**
- `access_token` is valid for 900 seconds (15 minutes).
- Cache the token in memory; do **not** request a new one for every API call.
- Refresh **before** expiry via `POST /api/v1/oauth2/refresh` with `{ "refresh_token": "..." }`.
- On a 401 `UNAUTHORIZED` error, fetch a fresh token and retry once.

Use the token in every subsequent API call:

```
Authorization: Bearer <access_token>
```

## Step 2a — Hosted Checkout (Payment Links)

### Create a payment link

```bash
curl -X POST https://core.quidkey.com/api/v1/payment-links \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order": {
      "amount": 5000,
      "currency": "GBP",
      "payment_reference": "INV-2026-005",
      "order_id": "order_uuid_optional",
      "locale": "en"
    },
    "link_type": "single_use",
    "metadata": { "invoice_date": "2026-05-13" }
  }'
```

**Field reference:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `order.amount` | integer | yes | **Minor units** (e.g. cents for EUR/GBP, so £50.00 = `5000`) |
| `order.currency` | ISO 4217 string | yes | e.g. `"GBP"`, `"EUR"` |
| `order.payment_reference` | string | yes | Max **18 chars**. Appears on the payer's bank statement. |
| `order.order_id` | string | no | Your internal reference; echoed back. |
| `order.locale` | string | no | UI language for the hosted page, e.g. `"en"`, `"de"`. |
| `link_type` | string | no | `"single_use"` (default) or `"reusable"`. |
| `metadata` | object | no | Free-form, echoed back on webhooks. |
| `test_transaction` | boolean | dev/tst only | **Required in non-prod.** |

Response:

```json
{
  "success": true,
  "data": {
    "link_id": "pl_01H...",
    "payment_link_url": "https://pay.quidkey.com/link/...",
    "expires_at": "2026-05-20T00:00:00Z",
    "status": "ACTIVE"
  }
}
```

Share `payment_link_url` with the payer. Default expiry is 7 days.

### Get a payment link by ID

```bash
curl -H "Authorization: Bearer <access_token>" \
  https://core.quidkey.com/api/v1/payment-links/{link_id}
```

### List payment links

```bash
curl -H "Authorization: Bearer <access_token>" \
  https://core.quidkey.com/api/v1/payment-links
```

### Lifecycle states

| Status | Meaning |
|--------|---------|
| `ACTIVE` | Created, awaiting payment. |
| `USED` | Payment completed (single-use only). |
| `EXPIRED` | Past `expires_at`. |
| `CANCELLED` | Manually revoked. |

To detect completion, either poll `GET /payment-links/{id}` or register a webhook (see "Webhooks — not in v1" below).

## Step 2b — Embedded Payment Flow

### Create a payment request

```bash
curl -X POST https://core.quidkey.com/api/v1/payment-requests \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "EUR",
    "payment_reference": "INV-001",
    "order_id": "your_order_123",
    "locale": "en",
    "metadata": { "customer_id": "cust_42" }
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "payment_token": "pt_...",
    "iframe_url": "https://checkout.quidkey.com/embed?token=pt_...",
    "expires_at": "2026-05-13T10:15:00Z"
  }
}
```

Embed `iframe_url` inside an `<iframe>` on your checkout page. The customer chooses their bank inside the iframe; Quidkey handles the redirect to the bank's auth screen and the return.

### Update an embedded payment request

Before the customer selects a bank, you may update the amount and/or rewards:

```bash
curl -X PATCH https://core.quidkey.com/api/v1/payment-requests/{payment_token} \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "amount": 1200 }'
```

After the customer selects a bank, the request transitions to `PAYMENT_ALREADY_INITIATED` and updates are rejected.

### Initiate a payment for an embedded flow

Used by the iframe itself once the customer selects a bank. Most integrations don't call this directly — the iframe handles it. Documented in the full OpenAPI spec.

## Response envelope

All endpoints return:

**Success**
```json
{ "success": true, "data": { /* endpoint-specific */ } }
```

**Error**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Human-readable explanation",
    "errors": [
      { "field": "amount", "message": "Amount must be greater than 0" }
    ]
  }
}
```

## HTTP status codes and common error codes

| Status | Meaning | Common codes |
|--------|---------|--------------|
| 200 / 201 | Success | — |
| 400 | Validation error | `INVALID_INPUT` |
| 401 | Missing/invalid/expired token | `UNAUTHORIZED` — refresh token and retry once |
| 403 | Auth OK, permission denied | `FORBIDDEN_CREATE`, `FORBIDDEN_VIEW` |
| 404 | Resource not found | `PAYMENT_LINK_NOT_FOUND`, `PAYMENT_REQUEST_NOT_FOUND`, `MERCHANT_NOT_FOUND` |
| 409 | State conflict | `PAYMENT_ALREADY_INITIATED` (can't update after bank selection) |
| 410 | Resource expired | `PAYMENT_LINK_EXPIRED` |
| 500 | Server error (rare) | Retry with exponential backoff |

Always branch on the `code` field for logic; surface `message` for logging/debugging.

## Retry guidance

- **401 UNAUTHORIZED:** fetch a fresh token, retry the original request once.
- **5xx:** exponential backoff, max 3 attempts, jitter.
- **4xx (except 401):** do not retry — fix the input.

No rate limits are currently enforced, but implement backoff defensively.

## API versioning

The current API is `v1`, indicated in every path: `/api/v1/...`. Breaking changes will be released as `v2`. Non-breaking additions land in `v1` without notice.

## Reference

- **OpenAPI (machine-readable):** https://quidkey.com/openapi.json
- **API reference (human):** https://docs.quidkey.com/api-reference/introduction
- **Guides:** https://docs.quidkey.com (embedded flow, payment links, Shopify, etc.)
- **Documentation index for agents:** https://docs.quidkey.com/llms.txt
- **Console:** https://console.quidkey.com
- **Support:** rabea@quidkey.com (one business day response)

## What's NOT covered in v1 of this skill

- **Webhook signing verification.** Webhook registration exists, but the signing algorithm and full event schema aren't fully public yet. For now, agents should poll `GET /payment-links/{id}` or `GET /payment-requests/{id}` instead of relying on webhooks. Skill v2 will document the verification flow.
- **Magic Code and Google ID Token auth flows.** These exist in the OpenAPI spec but are not the recommended path for machine-to-machine integration — use `client_credentials` above.
- **Multi-merchant context switching.** Advanced; contact support if a single client needs to operate across multiple merchant accounts.
- **Refunds, payouts, settlement reports.** Available on request — not in the public API surface at the moment.
