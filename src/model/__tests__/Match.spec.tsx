import { FixtureItem } from "../../utils/types"
import { Match } from "../Match"

describe("Match", () => {
  let match: Match
  describe("isFixtureInThePast", () => {
    let fixtureItem: FixtureItem
    const now = new Date()

    it("return true when the date of the match was one minute ago", () => {
      const minutes = 1 * 1000 * 60
      const fixtureDate = new Date(now.getTime() - minutes)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureInThePast()).toBe(true)
    })

    it("return true when the date of the match was in the past", () => {
      const days = 5
      const fixtureDate = new Date(now.getDate() - days)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureInThePast()).toBe(true)
    })

    it("return false when the date of the match is on the future", () => {
      const minutes = 1 * 1000 * 60
      const fixtureDate = new Date(now.getTime() + minutes)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureInThePast()).toBe(false)
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
      match = new Match(fixtureItem)
      expect(match.isFixtureInTheFuture()).toBe(true)
    })

    it("return true when the date of the match is in the future", () => {
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)
      fixtureItem = {
        fixture: { id: 1, date: tomorrow.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureInTheFuture()).toBe(true)
    })

    it("return false when the date of the match is in the past", () => {
      const minutes = 1 * 1000 * 60
      const fixtureDate = new Date(now.getTime() - minutes)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureInTheFuture()).toBe(false)
    })
  })

  describe("isFixtureLive", () => {
    let fixtureItem: FixtureItem
    const now = new Date()
    const liveStatuses = ["LIVE", "1H", "2H", "HT", "ET", "P"]

    liveStatuses.forEach(status => {
      it(`return true if the status is ${status}`, () => {
        fixtureItem = {
          fixture: { id: 1, status: { short: status } },
        } as FixtureItem
        match = new Match(fixtureItem)
        expect(match.isFixtureLive()).toBe(true)
      })
    })

    it("return true if the match is currently live and the status is not present", () => {
      // One minute in milliseconds
      const oneMinute = 1 * 1000 * 60
      const fixtureDate = new Date(now.getTime() - oneMinute)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureLive()).toBe(true)
    })

    it("return false if the match is not live and status is not present", () => {
      // One minute in milliseconds
      const oneMinute = 1 * 1000 * 60
      const fixtureDate = new Date(now.getTime() + oneMinute)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureLive()).toBe(false)
    })
  })

  describe("isFixtureNearToStart", () => {
    let fixtureItem: FixtureItem
    const now = new Date()

    it("return false if the match is in the past", () => {
      const days = 5
      const fixtureDate = new Date(now.getDate() - days)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureNearToStart()).toBe(false)
    })

    it("return true if the match is <= 20 minutes away", () => {
      // Ten minutes in milliseconds
      const tenMinutes = 10 * 1000 * 60
      const fixtureDate = new Date(now.getTime() + tenMinutes)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureNearToStart()).toBe(true)
    })

    it("return false if the match is > 20 minutes away", () => {
      // thirty minutes in milliseconds
      const thirtyMinutes = 30 * 1000 * 60
      const fixtureDate = new Date(now.getTime() + thirtyMinutes)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureNearToStart()).toBe(false)
    })
  })

  describe("isFixtureFromToday", () => {
    let fixtureItem: FixtureItem
    const now = new Date()

    it("return false if the match is in the past days", () => {
      const days = 5
      const fixtureDate = new Date(now.getDate() - days)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureFromToday()).toBe(false)
    })

    it("return false if the match is in the future days", () => {
      const days = 1
      const fixtureDate = new Date(now.getDate() + days)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureFromToday()).toBe(false)
    })

    it("return true if the match is in the past but today", () => {
      const minutes = 20 * 1000 * 60
      const fixtureDate = new Date(now.getTime() - minutes)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureFromToday()).toBe(true)
    })

    it("return true if the match is the future but today", () => {
      const minutes = 120 * 1000 * 60
      const fixtureDate = new Date(now.getTime() + minutes)
      fixtureItem = {
        fixture: { id: 1, date: fixtureDate.toString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureFromToday()).toBe(true)
    })

    it("return true if the match is now", () => {
      fixtureItem = {
        fixture: { id: 1, date: new Date().toDateString() },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.isFixtureFromToday()).toBe(true)
    })
  })
})
