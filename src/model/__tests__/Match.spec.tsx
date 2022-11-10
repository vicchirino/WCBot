import { FixtureItem, MatchEvent } from "../../utils/types"
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

  describe("getTextForReadyToStart", () => {
    it("return the correct text", () => {
      const fixtureItem = {
        fixture: { id: 1, date: new Date().toDateString() },
        teams: {
          home: {
            id: 13,
            name: "Senegal",
          },
          away: {
            id: 1118,
            name: "Netherlands",
          },
        },
      } as FixtureItem
      match = new Match(fixtureItem)
      expect(match.getTextForReadyToStart()).toBe(
        "⚽️ Senegal vs Netherlands is about to start!"
      )
    })
  })

  describe("getTextForEvent", () => {
    let matchEvent: MatchEvent
    let fixtureItem: FixtureItem
    beforeEach(() => {
      fixtureItem = {
        fixture: { id: 1, date: new Date().toDateString() },
        teams: {
          home: {
            id: 13,
            name: "Senegal",
          },
          away: {
            id: 1118,
            name: "Netherlands",
          },
        },
        goals: {
          home: 1,
          away: 2,
        },
      } as FixtureItem
    })
    describe("when the type is 'Goal'", () => {
      it("return correct text for Penalty", () => {
        matchEvent = {
          time: {
            elapsed: 14,
          },
          team: {
            id: 1118,
            name: "Netherlands",
          },
          player: {
            id: 76342,
            name: "Van Nisterloy",
          },
          assist: {
            id: null,
            name: null,
          },
          type: "Goal",
          detail: "Penalty",
        } as MatchEvent
        match = new Match(fixtureItem)
        expect(match.getTextForEvent(matchEvent)).toBe(
          "➡️  Penalty scored!!\n\n⚽ Van Nisterloy - Netherlands\n\n⏰ 14' Senegal 1 - 2 Netherlands"
        )
      })
      it("return correct text for Own Goal", () => {
        matchEvent = {
          time: {
            elapsed: 14,
          },
          team: {
            id: 1118,
            name: "Senegal",
          },
          player: {
            id: 76342,
            name: "Foo",
          },
          assist: {
            id: null,
            name: null,
          },
          type: "Goal",
          detail: "Own Goal",
        } as MatchEvent
        match = new Match(fixtureItem)
        expect(match.getTextForEvent(matchEvent)).toBe(
          "➡️  Own Goal\n\n⚽ Foo - Senegal\n\n⏰ 14' Senegal 1 - 2 Netherlands"
        )
      })
      // describe("Normal Goal", () => {
      //   it("return correct text when there is an assist", () => {
      //     matchEvent = {
      //       time: {
      //         elapsed: 14,
      //       },
      //       team: {
      //         id: 1118,
      //         name: "Senegal",
      //       },
      //       player: {
      //         id: 76342,
      //         name: "Foo",
      //       },
      //       assist: {
      //         id: 32423,
      //         name: "Boo",
      //       },
      //       type: "Goal",
      //       detail: "Normal Goal",
      //     } as MatchEvent
      //     match = new Match(fixtureItem)
      //     expect(match.getTextForEvent(matchEvent)).toBe(
      //       "➡️  Goal!!\n\n⚽ Foo - Senegal\n👥 Boo\n\n⏰ 14' Senegal 1 - 2 Netherlands"
      //     )
      //   })
      //   it("return correct text when there is not an assist", () => {
      //     matchEvent = {
      //       time: {
      //         elapsed: 14,
      //       },
      //       team: {
      //         id: 1118,
      //         name: "Senegal",
      //       },
      //       player: {
      //         id: 76342,
      //         name: "Foo",
      //       },
      //       assist: {
      //         id: null,
      //         name: null,
      //       },
      //       type: "Goal",
      //       detail: "Normal Goal",
      //     } as MatchEvent
      //     match = new Match(fixtureItem)
      //     expect(match.getTextForEvent(matchEvent)).toBe(
      //       "➡️  Goal!!\n\n⚽ Foo - Senegal\n\n⏰ 14' Senegal 1 - 2 Netherlands"
      //     )
      //   })
      // })
      it("return correct text for Missed Penalty", () => {
        matchEvent = {
          time: {
            elapsed: 14,
          },
          team: {
            id: 1118,
            name: "Netherlands",
          },
          player: {
            id: 76342,
            name: "Robben",
          },
          assist: {
            id: null,
            name: null,
          },
          type: "Goal",
          detail: "Missed Penalty",
        } as MatchEvent
        match = new Match(fixtureItem)
        expect(match.getTextForEvent(matchEvent)).toBe(
          "➡️ Missed Penalty\n❌ Robben - Netherlands\n\n⏰ 14' Senegal 1 - 2 Netherlands"
        )
      })
    })
    describe("when the type is 'Card'", () => {
      it("return correct text for Yellow Card", () => {
        matchEvent = {
          time: {
            elapsed: 14,
          },
          team: {
            id: 1118,
            name: "Netherlands",
          },
          player: {
            id: 76342,
            name: "De Jong",
          },
          assist: {
            id: null,
            name: null,
          },
          type: "Card",
          detail: "Yellow Card",
        } as MatchEvent
        match = new Match(fixtureItem)
        expect(match.getTextForEvent(matchEvent)).toBe(
          "➡️ Yellow card\n🟡 De Jong - Netherlands\n\n⏰ 14' Senegal 1 - 2 Netherlands"
        )
      })

      it("return correct text for Second Yellow card", () => {
        matchEvent = {
          time: {
            elapsed: 14,
          },
          team: {
            id: 1118,
            name: "Netherlands",
          },
          player: {
            id: 76342,
            name: "De Jong",
          },
          assist: {
            id: null,
            name: null,
          },
          type: "Card",
          detail: "Second Yellow card",
        } as MatchEvent
        match = new Match(fixtureItem)
        expect(match.getTextForEvent(matchEvent)).toBe(
          "➡️ Second yellow card\n🟡🟡 De Jong - Netherlands\n\n⏰ 14' Senegal 1 - 2 Netherlands"
        )
      })

      it("return correct text for Red Card", () => {
        matchEvent = {
          time: {
            elapsed: 14,
          },
          team: {
            id: 1118,
            name: "Netherlands",
          },
          player: {
            id: 76342,
            name: "De Jong",
          },
          assist: {
            id: null,
            name: null,
          },
          type: "Card",
          detail: "Red Card",
        } as MatchEvent
        match = new Match(fixtureItem)
        expect(match.getTextForEvent(matchEvent)).toBe(
          "➡️ Red card\n🔴 De Jong - Netherlands\n\n⏰ 14' Senegal 1 - 2 Netherlands"
        )
      })
    })

    describe("when the type is 'substs'", () => {
      it("returns the correct text", () => {
        matchEvent = {
          time: {
            elapsed: 14,
          },
          team: {
            id: 1118,
            name: "Netherlands",
          },
          player: {
            id: 76342,
            name: "Robben",
          },
          assist: {
            id: 423423,
            name: "Van Persie",
          },
          type: "subst",
          detail: "Substitution 1",
        } as MatchEvent
        match = new Match(fixtureItem)
        expect(match.getTextForEvent(matchEvent)).toBe(
          "🔄 Substituion - Netherlands\n\n➡️ Robben\n⬅️ Van Persie\n⏰ 14' Senegal 1 - 2 Netherlands"
        )
      })
    })

    describe("when the type is 'Var'", () => {
      it("returns the correct text for Goal cancelled", () => {
        matchEvent = {
          time: {
            elapsed: 14,
          },
          team: {
            id: 1118,
            name: "Netherlands",
          },
          player: {
            id: 76342,
            name: "Robben",
          },
          assist: {
            id: 423423,
            name: "Van Persie",
          },
          type: "Var",
          detail: "Goal cancelled",
        } as MatchEvent
        match = new Match(fixtureItem)
        expect(match.getTextForEvent(matchEvent)).toBe(
          "🔎 Var - Goal cancelled!\n\nRobben - Netherlands\n\n⏰ 14' Senegal 1 - 2 Netherlands"
        )
      })
      it("returns the correct text for Penalty confirmed", () => {
        matchEvent = {
          time: {
            elapsed: 14,
          },
          team: {
            id: 1118,
            name: "Netherlands",
          },
          player: {
            id: 76342,
            name: "Robben",
          },
          assist: {
            id: 423423,
            name: "Van Persie",
          },
          type: "Var",
          detail: "Penalty confirmed",
        } as MatchEvent
        match = new Match(fixtureItem)
        expect(match.getTextForEvent(matchEvent)).toBe(
          "🔎 Var - Penalty confirmed for Netherlands\n\n⏰ 14' Senegal 1 - 2 Netherlands"
        )
      })
    })
  })
})
