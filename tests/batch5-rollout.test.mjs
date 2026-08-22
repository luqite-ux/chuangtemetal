import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

process.env.NODE_ENV = 'test'
const captcha = await import('../lib/inquiry-captcha.ts')

const secret = 'batch-five-site-secret-at-least-32-characters'
const tenantId = '11111111-1111-4111-8111-111111111111'
const siteScope = 'batch-five-site'
const scopeA = 'captcha_scope_A_1234567890'
const scopeB = 'captcha_scope_B_1234567890'

class MemoryStore {
  rows = new Map()

  key(record) {
    return `${record.tenantId}:${record.siteScopeHash}:${record.formScopeHash}`
  }

  async issue(record) {
    this.rows.set(this.key(record), { ...structuredClone(record), consumed: false })
  }

  async consume(record) {
    const key = this.key(record)
    const current = this.rows.get(key)
    if (
      !current ||
      current.consumed ||
      current.challengeHash !== record.challengeHash ||
      current.tokenHash !== record.tokenHash ||
      (record.now ?? Date.now()) > current.expiresAt
    ) return false
    current.consumed = true
    return true
  }
}

async function issue(store, scope, now = 1_000) {
  return captcha.issueCaptchaChallenge({ secret, tenantId, siteScope, scope, store, now })
}

async function submit(store, challenge, scope, answer = challenge.testAnswer, now = 1_001) {
  return captcha.verifyCaptchaSubmission({
    secret,
    tenantId,
    siteScope,
    scope,
    token: challenge.token,
    answer,
    store,
    now,
  })
}

test('one challenge permits exactly one concurrent successful submission', async () => {
  const store = new MemoryStore()
  const challenge = await issue(store, scopeA)
  const results = await Promise.all([
    submit(store, challenge, scopeA),
    submit(store, challenge, scopeA),
  ])
  assert.equal(results.filter((result) => result.ok).length, 1)
})

test('refresh invalidates only its form scope and wrong answers consume that challenge', async () => {
  const store = new MemoryStore()
  const oldA = await issue(store, scopeA)
  const challengeB = await issue(store, scopeB)
  await issue(store, scopeA, 1_002)
  assert.deepEqual(await submit(store, oldA, scopeA, oldA.testAnswer, 1_003), { ok: false, code: 'invalid' })
  assert.deepEqual(await submit(store, challengeB, scopeB, challengeB.testAnswer, 1_003), { ok: true })

  const wrong = await issue(store, scopeA, 2_000)
  assert.deepEqual(await submit(store, wrong, scopeA, 'ZZZZ', 2_001), { ok: false, code: 'invalid' })
  assert.deepEqual(await submit(store, wrong, scopeA, wrong.testAnswer, 2_002), { ok: false, code: 'invalid' })
})

test('every inquiry UI mounts the scoped challenge and every persistence path verifies before insert', () => {
  const form = readFileSync(new URL('../components/inquiry-form.tsx', import.meta.url), 'utf8')
  const route = readFileSync(new URL('../app/api/inquiries/route.ts', import.meta.url), 'utf8')
  assert.match(form, /InquiryCaptchaField/)
  assert.match(form, /refreshKey=\{captchaRefreshKey\}/)
  assert.match(route, /verifyCaptchaSubmission/)
  assert.match(route, /createSupabaseCaptchaContextFromEnv/)
  assert.match(route, /captchaScope/)
  assert.match(route, /captchaToken/)
  assert.match(route, /captchaAnswer/)
  const verification = route.indexOf('verifyCaptchaSubmission')
  const guard = route.indexOf('if (!captcha.ok)', verification)
  const insertion = route.indexOf('.from(', guard)
  assert.ok(verification >= 0 && guard > verification && insertion > guard)
})

test('footer uses verified identity when available, runtime year, exact rights punctuation, and contain-fit logo', () => {
  const footer = readFileSync(new URL('../components/site-footer.tsx', import.meta.url), 'utf8')
  const logo = readFileSync(new URL('../components/brand-lockup.tsx', import.meta.url), 'utf8')
  const identity = readFileSync(new URL('../lib/site-config.ts', import.meta.url), 'utf8')
  assert.ok(identity.includes("Taizhou Chuangte Metal Materials Co., Ltd."))
  assert.match(footer, /new Date\(\)\.getFullYear\(\)/)
  assert.match(footer, /All rights reserved\./)
  assert.match(footer + logo, /object-contain/)
  assert.doesNotMatch(footer, /\.\s*\.\s*All rights reserved/)
})
