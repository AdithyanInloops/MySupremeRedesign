// Run with `npm test` (node --test; Node 22.18+ runs TypeScript directly).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { countDetails, draftFromPlace, googleIds, mergeProfile, validatePatch, type GooglePlace, type Profile } from '../src/data/profile.ts'
import fixtures from './fixtures/places.json' with { type: 'json' }

const place = (id: keyof typeof fixtures) => fixtures[id] as GooglePlace

test('Indian takeout place pre-fills kind, cuisine, curries, service modes and the packaging hint', () => {
  const d = draftFromPlace(place('mock_06'))
  assert.equal(d.isFoodPlace, true)
  assert.deepEqual(d.fields.businessKind, ['kind.restaurant'])
  assert.deepEqual(d.fields.cuisines, ['cuisine.indian'])
  assert.deepEqual(d.fields.sells, ['sells.curries-rice']) // "biryani" in the editorial summary
  assert.deepEqual(d.fields.serviceModes, ['service.dine-in', 'service.takeout', 'service.delivery-apps'])
  assert.deepEqual(d.fields.meals, ['meals.lunch', 'meals.dinner'])
  assert.deepEqual(d.fields.foodRules, ['rules.none']) // Google says nothing about food rules
  assert.equal(d.fields.priceLevel, 'price.value')
  assert.equal(d.fields.menuUrl, 'https://spiceroute.example.ca/')
  assert.equal(d.fields.identity?.phone, '(905) 555-0164')
  assert.equal(d.fields.openingHours?.weekdayDescriptions.length, 7)
  assert.equal(d.buysHint, 'Most takeout places also buy Packaging.')
  assert.ok(googleIds(d).includes('cuisine.indian'))
})

test('keywords: whole words in name and summaries; business kind keywords read the name only', () => {
  const d = draftFromPlace(place('mock_05'))
  assert.deepEqual(d.fields.cuisines, ['cuisine.middle-eastern'])
  assert.deepEqual(d.fields.sells, ['sells.shawarma-wraps'])
  assert.deepEqual(d.fields.serviceModes, ['service.takeout', 'service.delivery-apps']) // dineIn false
  const truck = draftFromPlace({ id: 'x', displayName: { text: 'Taco Fiesta Food Truck' }, types: ['meal_takeaway'] })
  assert.deepEqual(truck.fields.businessKind, ['kind.food-truck'])
  const notTruck = draftFromPlace({ id: 'x', displayName: { text: 'Taco Fiesta' }, types: ['meal_takeaway'], editorialSummary: { text: 'Started as a food truck.' } })
  assert.deepEqual(notTruck.fields.businessKind, ['kind.restaurant']) // food place with no kind match
  assert.deepEqual(draftFromPlace({ id: 'x', displayName: { text: 'Wraps & Co' }, types: ['restaurant'] }).fields.sells, undefined) // "wraps" isn't "wrap"
  assert.deepEqual(draftFromPlace({ id: 'x', displayName: { text: 'Karachi Grill' }, types: ['halal_restaurant'] }).fields.foodRules, ['rules.halal'])
  assert.deepEqual(draftFromPlace({ id: 'x', displayName: { text: 'Sagar' }, types: ['restaurant'], editorialSummary: { text: 'Pure veg thalis.' } }).fields.foodRules, ['rules.pure-veg'])
})

test('non-food places get no pre-fill, even with food-ish attributes or words', () => {
  for (const id of ['mock_04', 'mock_07', 'mock_08'] as const) assert.deepEqual(draftFromPlace(place(id)), { isFoodPlace: false, fields: {} }, id)
})

test('hotels, bakeries and cafés map to their kinds', () => {
  assert.deepEqual(draftFromPlace(place('mock_10')).fields.businessKind, ['kind.hotel-events'])
  assert.deepEqual(draftFromPlace(place('mock_10')).fields.priceLevel, 'price.premium')
  const bakery = draftFromPlace(place('mock_02'))
  assert.deepEqual(bakery.fields.businessKind, ['kind.cafe', 'kind.bakery'])
  assert.deepEqual(bakery.fields.sells, ['sells.baked-goods', 'sells.desserts-sweets', 'sells.coffee-tea'])
})

test('merge: owner beats Google, Google refreshes Google, owner replaces Google, null removes', () => {
  const now = '2026-11-18T00:00:00.000Z'
  let p: Profile = mergeProfile({}, { meals: { value: ['meals.lunch'], source: 'google' }, cuisines: { value: ['cuisine.thai'] } }, now)
  assert.deepEqual(p.meals, { value: ['meals.lunch'], source: 'google', confirmed: false, updatedAt: now })
  assert.deepEqual(p.cuisines, { value: ['cuisine.thai'], source: 'owner', confirmed: true, updatedAt: now })
  p = mergeProfile(p, { cuisines: { value: ['cuisine.indian'], source: 'google' }, meals: { value: ['meals.dinner'], source: 'google' } }, now)
  assert.deepEqual(p.cuisines?.value, ['cuisine.thai'])
  assert.deepEqual(p.meals?.value, ['meals.dinner'])
  p = mergeProfile(p, { meals: { value: ['meals.dinner'] } }, now) // "Looks right"
  assert.equal(p.meals?.source, 'owner')
  assert.equal(p.meals?.confirmed, true)
  p = mergeProfile(p, { cuisines: null }, now, ['cuisine.indian'])
  assert.equal(p.cuisines, undefined)
  assert.deepEqual(p.suggestedByGoogle, ['cuisine.indian'])
  assert.equal(countDetails(p), 1)
})

test('validation accepts a good patch, trims text and drops empty answers', () => {
  const r = validatePatch({
    cuisines: { value: ['cuisine.indian', 'cuisine.indian'] }, size: { value: 'size.100-300' }, topDishes: { value: [' Butter chicken ', '', 'Biryani'] },
    menuUrl: { value: 'https://example.ca/menu' }, orderRhythm: { value: { perWeek: 'rhythm.2-3' } }, brandPrefs: { value: { mustHave: ' Amul ', openToValue: true } },
    meals: { value: [], source: 'google' }, proteins: { value: [] }, suggestedByGoogle: ['cuisine.indian'],
    others: { value: { cuisines: ' Ethiopian ', sells: '  ' } },
  })
  assert.ok(!('error' in r))
  assert.deepEqual(r.patch.cuisines, { value: ['cuisine.indian'], source: 'owner' })
  assert.deepEqual(r.patch.topDishes?.value, ['Butter chicken', 'Biryani'])
  assert.deepEqual(r.patch.brandPrefs?.value, { mustHave: 'Amul', openToValue: true })
  assert.deepEqual(r.patch.others?.value, { cuisines: 'Ethiopian' }) // blank answers dropped
  assert.equal('meals' in r.patch, false) // Google with nothing to say
  assert.equal(r.patch.proteins, null) // owner cleared it
})

test('validation rejects unknown fields and ids, long text, non-http links and bad combinations', () => {
  const bad = (body: unknown, msg: RegExp) => { const r = validatePatch(body); assert.ok('error' in r && msg.test(r.error), JSON.stringify(r)) }
  bad({ hst: { value: '123' } }, /Unknown field "hst"/)
  bad({ cuisines: { value: ['cuisine.klingon'] } }, /cuisines: unknown option "cuisine.klingon"/)
  bad({ cuisines: { value: ['Indian'] } }, /unknown option/) // labels aren't ids
  bad({ size: { value: 'cuisine.indian' } }, /size: unknown option/)
  bad({ topDishes: { value: ['x'.repeat(41)] } }, /40 characters or fewer/)
  bad({ topDishes: { value: ['a', 'b', 'c', 'd', 'e', 'f'] } }, /at most 5/)
  bad({ brandPrefs: { value: { mustHave: 'x'.repeat(201) } } }, /200 characters/)
  bad({ others: { value: { cuisines: 'x'.repeat(101) } } }, /others.cuisines must be 100 characters/)
  bad({ others: { value: { proteins: 'Duck' } } }, /others: unknown key "proteins"/)
  bad({ menuUrl: { value: 'javascript:alert(1)' } }, /http:\/\/ or https:\/\//)
  bad({ menuUrl: { value: 'ftp://example.ca' } }, /http/)
  bad({ foodRules: { value: ['rules.none', 'rules.halal'] } }, /None can't be combined/)
  bad({ orderRhythm: { value: { often: 'rhythm.1' } } }, /unknown key "often"/)
  bad({ cuisines: { value: ['cuisine.indian'], source: 'admin' } }, /source/)
  bad({ suggestedByGoogle: ['nope'] }, /suggestedByGoogle: unknown option/)
  bad([], /JSON object/)
})
