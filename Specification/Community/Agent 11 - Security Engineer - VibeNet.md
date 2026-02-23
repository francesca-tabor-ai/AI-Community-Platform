# Agent 11 — Security Engineer
## Platform: VibeNet — AI-Powered Professional Networking

---

## Threat Model

| Threat | Probability | Impact | Priority |
|:---|:---:|:---:|:---:|
| Account Takeover (credential stuffing) | High | High | P0 |
| Data Exfiltration (bulk scraping) | High | High | P0 |
| XSS (cross-site scripting) | Medium | High | P0 |
| SQL Injection | Low | Critical | P0 |
| Spam / Fake Profiles | High | Medium | P1 |
| Payment Fraud | Medium | High | P1 |
| CSRF | Low | Medium | P1 |
| Insider Threat | Low | High | P2 |

---

## Security Architecture

### Network Security
- All services in private VPC subnets; only API Gateway is internet-facing
- TLS 1.3 enforced on all external endpoints
- CloudFront WAF with OWASP Core Rule Set
- DDoS protection via AWS Shield

### Application Security
- All inputs validated with Zod schemas before processing
- Parameterised queries only — no string concatenation in SQL
- Content Security Policy (CSP) headers on all responses
- CORS configured to allow only platform's own domains
- Rate limiting: 100 req/min authenticated, 20 req/min unauthenticated
- HSTS header with 1-year max-age

---

## Authentication Security Design

### Password Security
- bcrypt hashing with cost factor 12
- Minimum 8 characters, complexity requirements enforced
- Password breach detection via HaveIBeenPwned API on registration
- Password reset via time-limited (15 minutes) signed token

### Session Security
- JWT access tokens: 15-minute expiry, signed with RS256
- Refresh tokens: 30-day expiry, httpOnly + Secure + SameSite=Strict cookie
- Refresh token rotation on every use
- Session invalidation on password change
- Concurrent session limit: 5 active sessions per user

### Multi-Factor Authentication
- TOTP via Google Authenticator / Authy
- 10 single-use backup codes generated on MFA setup
- MFA required for: account settings changes, payment method updates

### Brute Force Protection
- Progressive delay after failed login: 1s, 2s, 4s, 8s, 16s
- CAPTCHA after 5 failed attempts
- Account lockout after 10 failed attempts (30-minute lockout)

---

## Data Protection Strategy

### Encryption
- Data at rest: AES-256 via AWS RDS encryption
- Data in transit: TLS 1.3
- PII fields encrypted at column level with application-managed keys

### Privacy Controls
- GDPR: data export endpoint (JSON, within 30 days)
- GDPR: account deletion endpoint (hard delete within 30 days)
- CCPA: "Do Not Sell" flag per user
- Data retention: user data retained 90 days after account deletion
- Audit log: all PII access logged

### Vulnerability Management
- Dependency scanning: Dependabot + Snyk in CI/CD
- Container image scanning: ECR on push
- SAST: CodeQL on all pull requests
- Annual external penetration test

---

## Compliance

**SOC 2 Type II:** Controls covering security, availability, confidentiality. Annual audit.
**GDPR:** Privacy by design, data minimisation, consent management.
**CCPA:** Privacy notice, opt-out mechanism, data subject request handling.
**PCI DSS:** Not applicable — card data handled entirely by Stripe (SAQ A).
