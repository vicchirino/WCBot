import { FixtureItem, MatchEvent } from "../../utils/types"
import { Match } from "../Match"
import { TournamentStore } from "../TournamentStore"

describe("TournamentStore", () => {
  let fixtureItems: FixtureItem[]

  it("should return the same instance of TournamentStore", () => {
    const tournamentStore = TournamentStore.getInstance()
    const tournamentStore2 = TournamentStore.getInstance()

    expect(tournamentStore).toBe(tournamentStore2)
  })

  describe("setMatches", () => {
    it("set correctly fixtureItems", () => {
      const fixtureItems = [
        {
          fixture: {
            id: 1,
            date: "2021-01-02T02:00:00+00:00", // 2nd January 2021 at 2:00 AM UTC [3 - match]
          },
        },
        {
          fixture: {
            id: 2,
            date: "2021-01-02T00:00:00+00:00", // 2nd January 2021 at 12:00 AM UTC [2 - match]
          },
        },
        {
          fixture: {
            id: 3,
            date: "2021-01-01T00:00:00+00:00", // 1st January 2021 at 12:00 AM UTC [1 -match]
          },
        },
      ] as FixtureItem[]
      const tournamentStore = TournamentStore.getInstance()
      const matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      tournamentStore.setMatches(matches)

      expect(tournamentStore.matches).toHaveLength(fixtureItems.length)
      expect(tournamentStore.matches[0].fixtureId()).toEqual(3)
      expect(tournamentStore.matches[1].fixtureId()).toEqual(2)
      expect(tournamentStore.matches[2].fixtureId()).toEqual(1)
    })
  })

  describe("getLiveMatchesNotPosted", () => {
    beforeEach(() => {
      fixtureItems = [
        {
          fixture: {
            id: 1,
            status: { short: "1H" },
          },
        },
        {
          fixture: {
            id: 2,
            status: { short: "2H" },
          },
        },
        {
          fixture: {
            id: 3,
            status: { short: "2H" },
          },
        },
        {
          fixture: {
            id: 4,
            status: { short: "TBD" },
          },
        },
      ] as FixtureItem[]
    })
    it("return all the fixture items when first run", () => {
      const tournamentStore = TournamentStore.getInstance()
      const matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      tournamentStore.setMatches(matches)
      expect(tournamentStore.getLiveMatchesNotPosted().length).toBe(
        fixtureItems.length - 1
      )
    })
    it("return filtered fixture items when there are live fixture items posted", () => {
      const tournamentStore = TournamentStore.getInstance()
      const matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      tournamentStore.setMatches(matches)
      tournamentStore.setLiveMatchesPosted()
      expect(tournamentStore.getLiveMatchesNotPosted().length).toBe(0)
    })
  })

  describe("setLiveFixturesEvents", () => {
    const fixtureId = 1
    let matchEvents: MatchEvent[] = []
    beforeEach(() => {
      matchEvents = [
        {
          time: {
            elapsed: 13,
          },
          type: "Goal",
        } as MatchEvent,
        {
          time: {
            elapsed: 18,
          },
          type: "Goal",
        } as MatchEvent,
        {
          time: {
            elapsed: 50,
          },
          type: "Card",
        } as MatchEvent,
      ]
    })

    it("set correctly live events for the fixture", () => {
      const tournamentStore = TournamentStore.getInstance()
      tournamentStore.setLiveMatchesEvents(fixtureId, matchEvents)

      const matchevents = tournamentStore.matchesEvents[fixtureId]
      expect(matchevents.liveMatchesEventsWithId).toHaveLength(3)
      expect(matchevents.liveMatchesEventsWithId[0].time.elapsed).toEqual(13)
      expect(matchevents.liveMatchesEventsWithId[1].time.elapsed).toEqual(18)
      expect(matchevents.liveMatchesEventsWithId[2].time.elapsed).toEqual(50)
    })
  })

  describe("getMatchesPollsNotPosted", () => {
    beforeEach(() => {
      const today = new Date()
      const thirtyMinutes = 30 * 1000 * 60
      const fixtureDateOne = new Date(today.getTime() + thirtyMinutes)
      const fiftyNineMinutes = 59 * 1000 * 60
      const fixtureDateTwo = new Date(today.getTime() + fiftyNineMinutes)
      const seventyMinutes = 70 * 1000 * 60
      const fixtureDateThree = new Date(today.getTime() + seventyMinutes)
      const eightyMinutes = 80 * 1000 * 60
      const fixtureDateFour = new Date(today.getTime() + eightyMinutes)
      fixtureItems = [
        {
          fixture: {
            id: 1,
            date: fixtureDateOne.toString(),
          },
        },
        {
          fixture: {
            id: 2,
            date: fixtureDateTwo.toString(),
          },
        },
        {
          fixture: {
            id: 3,
            date: fixtureDateThree.toString(),
          },
        },
        {
          fixture: {
            id: 4,
            date: fixtureDateFour.toString(),
          },
        },
      ] as FixtureItem[]
    })

    it("return all fixtures that are ready to post poll", () => {
      const tournamentStore = TournamentStore.getInstance()
      const matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      tournamentStore.setMatches(matches)
      expect(tournamentStore.getMatchesPollsNotPosted().length).toBe(
        fixtureItems.length - 2
      )
    })

    it("return no fixtures when were already posted", () => {
      const tournamentStore = TournamentStore.getInstance()
      const matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      tournamentStore.setMatches(matches)
      tournamentStore.setMatchesPollsPosted()
      expect(tournamentStore.getMatchesPollsNotPosted().length).toBe(0)
    })
  })

  describe("getMatchesNearToStartNotPosted", () => {
    beforeEach(() => {
      const today = new Date()
      const tenMinutes = 10 * 1000 * 60
      const fixtureDateOne = new Date(today.getTime() + tenMinutes)
      const ninteenMinutes = 19 * 1000 * 60
      const fixtureDateTwo = new Date(today.getTime() + ninteenMinutes)
      const thirtyMinutes = 30 * 1000 * 60
      const fixtureDateThree = new Date(today.getTime() + thirtyMinutes)
      const fortyMinutes = 40 * 1000 * 60
      const fixtureDateFour = new Date(today.getTime() + fortyMinutes)
      fixtureItems = [
        {
          fixture: {
            id: 1,
            date: fixtureDateOne.toString(),
          },
        },
        {
          fixture: {
            id: 2,
            date: fixtureDateTwo.toString(),
          },
        },
        {
          fixture: {
            id: 3,
            date: fixtureDateThree.toString(),
          },
        },
        {
          fixture: {
            id: 4,
            date: fixtureDateFour.toString(),
          },
        },
      ] as FixtureItem[]
    })

    it("return all fixtures near to start in first run", () => {
      const tournamentStore = TournamentStore.getInstance()
      const matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      tournamentStore.setMatches(matches)
      expect(tournamentStore.getMatchesNearToStartNotPosted().length).toBe(
        fixtureItems.length - 2
      )
    })

    it("return no fixtures when were already posted", () => {
      const tournamentStore = TournamentStore.getInstance()
      const matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      tournamentStore.setMatches(matches)
      tournamentStore.setMatchesNearToStartPosted()
      expect(tournamentStore.getMatchesNearToStartNotPosted().length).toBe(0)
    })
  })

  describe("getLiveFixturesEventsNotPosted", () => {
    const fixtureId = 1
    let matchEvents: MatchEvent[] = []
    beforeEach(() => {
      matchEvents = [
        {
          time: {
            elapsed: 13,
          },
          type: "Goal",
        } as MatchEvent,
        {
          time: {
            elapsed: 18,
          },
          type: "Goal",
        } as MatchEvent,
        {
          time: {
            elapsed: 50,
          },
          type: "Card",
        } as MatchEvent,
      ]
    })
    it("return all events from the fixture in first run", () => {
      const tournamentStore = TournamentStore.getInstance()
      tournamentStore.setLiveMatchesEvents(fixtureId, matchEvents)
      expect(
        tournamentStore.getLiveMatchesEventsNotPosted(fixtureId).length
      ).toBe(3)
    })
    it("return no events after they are posted", () => {
      const tournamentStore = TournamentStore.getInstance()
      tournamentStore.setLiveMatchesEvents(fixtureId, matchEvents)
      tournamentStore.setLiveMatchesEventsPosted(fixtureId)
      expect(
        tournamentStore.getLiveMatchesEventsNotPosted(fixtureId).length
      ).toBe(0)
    })
  })
})
