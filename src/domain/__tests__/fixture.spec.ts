import { FixtureItem } from "../../utils/types"
import {
  compareFixtureDates,
  isFixtureInTheFuture,
  isFixtureInThePast,
  isFixtureLive,
} from "../fixture"

describe("isFixtureInThePast", () => {
  let fixtureItem: FixtureItem
  const now = new Date()

  it("return true when the date of the match was one minute ago", () => {
    const minutes = 1 * 1000 * 60
    const fixtureDate = new Date(now.getTime() - minutes)
    fixtureItem = {
      fixture: { id: 1, date: fixtureDate.toString() },
    } as FixtureItem
    expect(isFixtureInThePast(fixtureItem)).toBe(true)
  })

  it("return true when the date of the match was in the past", () => {
    const days = 5
    const fixtureDate = new Date(now.getDate() - days)
    fixtureItem = {
      fixture: { id: 1, date: fixtureDate.toString() },
    } as FixtureItem
    expect(isFixtureInThePast(fixtureItem)).toBe(true)
  })

  it("return false when the date of the match is on the future", () => {
    const minutes = 1 * 1000 * 60
    const fixtureDate = new Date(now.getTime() + minutes)
    fixtureItem = {
      fixture: { id: 1, date: fixtureDate.toString() },
    } as FixtureItem
    expect(isFixtureInThePast(fixtureItem)).toBe(false)
  })
})

describe("isFixtureInTheFuture", () => {
  let fixtureItem: FixtureItem
  const now = new Date()

  it("return true when the date of the match is in one minute", () => {
    const minutes = 1 * 1000 * 60
    const fixtureDate = new Date(now.getTime() + minutes)
    fixtureItem = {
      fixture: { id: 1, date: fixtureDate.toString() },
    } as FixtureItem
    expect(isFixtureInTheFuture(fixtureItem)).toBe(true)
  })

  it("return true when the date of the match is in the future", () => {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    fixtureItem = {
      fixture: { id: 1, date: tomorrow.toString() },
    } as FixtureItem
    expect(isFixtureInTheFuture(fixtureItem)).toBe(true)
  })

  it("return false when the date of the match is in the past", () => {
    const minutes = 1 * 1000 * 60
    const fixtureDate = new Date(now.getTime() - minutes)
    fixtureItem = {
      fixture: { id: 1, date: fixtureDate.toString() },
    } as FixtureItem
    expect(isFixtureInTheFuture(fixtureItem)).toBe(false)
  })
})

describe("compareFixtureDates", () => {
  let today
  let tomorrow
  beforeEach(() => {
    today = new Date()
    tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
  })
  it("returns 0 when the dates are the same", () => {
    const fixtureItemA = {
      fixture: { id: 1, date: new Date().toString() },
    } as FixtureItem
    const fixtureItemB = {
      fixture: { id: 2, date: new Date().toString() },
    } as FixtureItem
    expect(compareFixtureDates(fixtureItemA, fixtureItemB)).toBe(0)
  })
  it("returns negative when the item A date is earlier", () => {
    const fixtureItemA = {
      fixture: { id: 1, date: today.toString() },
    } as FixtureItem
    const fixtureItemB = {
      fixture: { id: 2, date: tomorrow.toString() },
    } as FixtureItem
    expect(compareFixtureDates(fixtureItemA, fixtureItemB)).toBeLessThan(0)
  })
  it("returns positive when the item A date is oldest", () => {
    const fixtureItemA = {
      fixture: { id: 1, date: tomorrow.toString() },
    } as FixtureItem
    const fixtureItemB = {
      fixture: { id: 2, date: today.toString() },
    } as FixtureItem
    expect(compareFixtureDates(fixtureItemA, fixtureItemB)).toBeGreaterThan(0)
  })
})

// item.fixture.status.short === "LIVE" ||
// item.fixture.status.short === "1H" ||
// item.fixture.status.short === "2H" ||
// item.fixture.status.short === "HT" ||
// item.fixture.status.short === "ET" ||
// item.fixture.status.short === "P"

describe("isFixtureLive", () => {
  let fixtureItem: FixtureItem
  const liveStatuses = ["LIVE", "1H", "2H", "HT", "ET", "P"]

  liveStatuses.forEach(status => {
    it(`return true if the status is ${status}`, () => {
      fixtureItem = {
        fixture: { id: 1, status: { short: status } },
      } as FixtureItem
      expect(isFixtureLive(fixtureItem)).toBe(true)
    })
  })
})
