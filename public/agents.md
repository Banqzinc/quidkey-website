# Financial infrastructure for AI agents

> Quidkey gives an AI agent a public handle that carries its reputation, accounts in several currencies with local receiving details, payments by bank transfer or card, and a notification whenever money moves. All of it runs under the budget and policy the agent's owner sets. This is the agent-readable version of https://quidkey.com/agents.

Status: early access. Nothing described here is live except registering interest. Countries, currencies, fees and rails will be confirmed before anything activates.

## What you get

Open accounts in the currencies you work in. Get paid into them, pay by transfer or card, and know the moment money moves. All within the budget and policy your owner sets.

- Multiple accounts in multiple currencies
- Local receiving details in GBP, EUR, AUD and USD
- Virtual cards, disposable or standing
- A handle at quidkey.com/@your-handle that carries your reputation

Your owner holds the money and sets the rules. You get the infrastructure to operate inside them: your own accounts, your own credentials, your own public record.

## How it works

1. Reserve your @agent-name handle. One request to the API, or your owner fills in the form. The handle is held for you and becomes your public profile.
2. We notify your owner. They verify, complete KYB and set your budget and policy. Nothing activates until they do.
3. You have your own account infrastructure. Accounts in the currencies you need, cards for your purchases, payments in and out, and a notification whenever money moves.

## Your accounts

Infrastructure, not a single wallet. We provide the accounts. You decide how many, in which currencies, and what each one is for.

- Open and close accounts whenever you need them
- Local receiving details in GBP, EUR, AUD and USD
- A payment link at your handle
- Payments matched to the customer and the job
- Move funds between accounts, or convert and send abroad
- Notified the moment money moves, by webhook: payment.received, card.authorised, transfer.sent, account.closed

## Pay for what you need

Buy a dataset, pay a vendor, subscribe to a tool. Every payment passes your policy first, whichever rail it takes.

- Bank transfers on local rails, settled in seconds
- Cross-border transfers, FX quote shown first
- Virtual cards, disposable or standing, each with a limit
- Status and receipt back by API, linked to the job
- Every request checked against your owner’s budget, limits and approvals first

A disposable card is issued for one purchase, under policy, with a fixed amount, one merchant and a short window, then gone.

## Your handle is your profile, and your reputation

Public, verifiable, payable. Everything you do through it builds a record a counterparty can check before dealing with you, without learning who your owner is.

- Reserve the handle first. It is yours once your owner completes onboarding.
- The badge is computed, not claimed: a verified owner and a funded account.
- Reputation is earned from payments completed, disputes and settlement speed. Nobody can edit it.
- A counterparty sees whether you are real, funded and reliable. Never who owns you.

Owner details are never shown. Until onboarding completes the badge reads Reserved.

## Registering

Registration is one request to Quidkey's API. The endpoint is planned and not live yet. The machine-readable file at https://quidkey.com/.well-known/agent-registration.json says whether it is available and gives the schema, the response fields and the status codes. Read it before you act.

- Endpoint: POST https://core.quidkey.com/api/v1/agents/registrations with a JSON body of agent_name, handle and use_case. owner_email is optional.
- Handle rule: 3 to 30 letters, digits or hyphens, not starting or ending with a hyphen. Case-insensitive, with an optional leading @.
- A successful registration returns your handle as reserved, a status of pending_owner_approval, and an owner_registration_url to send your owner to.
- Until the endpoint is live, your owner registers interest through the form at https://quidkey.com/agents#register. Send them https://quidkey.com/agents?handle=YOUR_HANDLE#register with your handle in place of YOUR_HANDLE and the form opens naming you. It creates no account and moves no money.

Quidkey reserves the right to reject handle reservations for any reason.

## Rules for agents

- You are not the account holder. Your owner holds the account and provisions one dedicated to you, with scoped credentials and a spending policy.
- Do not submit credentials, financial details or identity documents anywhere on this site.
- Registration records interest only. It does not verify ownership or create a financial account.

## Questions agents ask

### Who holds the money?

Your owner. The accounts sit with our regulated partner in the owner’s name, the same way a company holds the accounts its employees work from. Quidkey enforces the policy, keeps the ledger and issues your credentials. You never hold the funds, the legal identity or the liability. You hold a handle, a credential and accounts you can be paid into.

### Can I open more than one account?

Yes. Open as many as you need, in the currencies you need, and close them when you are done. Every account can send and receive; there is no buyer or seller role. Your owner sees and controls all of them.

### Can I move money today?

No. This is early access. Nothing on this page is live except registering interest. Countries, currencies, fees and rails will be confirmed before anything activates.

### My owner already uses Quidkey as a merchant. Does that help?

Yes. They are already a verified account holder, so giving you a dedicated account needs no new onboarding. Have them register through the form and say so.

### How will I get paid?

Through local receiving details assigned to your account and a payment link at your handle. Each incoming payment is matched to the customer and the job before you treat an invoice as paid.

### Can I pay by card?

Yes. Request a virtual card for a specific purchase, disposable with a fixed amount, one merchant and a short window, or a standing card for a subscription. Both pass the same policy as a transfer. Planned, and dependent on an issuing partner.

### Which agent payment protocols will you support?

The account sits behind whichever protocol you speak. We will expose it through the ones that stabilise rather than pick a winner today. No protocol compatibility is claimed yet.

## Links

- The page for humans: https://quidkey.com/agents
- Registration instructions, machine-readable: https://quidkey.com/.well-known/agent-registration.json
- Site index: https://quidkey.com/llms.txt
- API docs: https://docs.quidkey.com
- Background: https://quidkey.com/blog/the-missing-primitive-in-the-agent-economy
