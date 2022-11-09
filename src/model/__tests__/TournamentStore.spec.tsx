import { FixtureItem, MatchEvent } from "../../utils/types"
import { TournamentStore } from "../TournamentStore"

describe("TournamentStore", () => {
  let fixtureItems: FixtureItem[]

  it("should return the same instance of TournamentStore", () => {
    const tournamentStore = TournamentStore.getInstance()
    const tournamentStore2 = TournamentStore.getInstance()

    expect(tournamentStore).toBe(tournamentStore2)
  })

  describe("setFixtureItems", () => {
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
      tournamentStore.setFixtureItems(fixtureItems)

      expect(tournamentStore.fixtureItems).toHaveLength(fixtureItems.length)
      expect(tournamentStore.fixtureItems[0].fixture.id).toEqual(3)
      expect(tournamentStore.fixtureItems[1].fixture.id).toEqual(2)
      expect(tournamentStore.fixtureItems[2].fixture.id).toEqual(1)
    })
  })

  describe("getLiveFixturesNotPosted", () => {
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
      tournamentStore.setFixtureItems(fixtureItems)
      expect(tournamentStore.getLiveFixturesNotPosted().length).toBe(
        fixtureItems.length - 1
      )
    })
    it("return filtered fixture items when there are live fixture items posted", () => {
      const tournamentStore = TournamentStore.getInstance()
      tournamentStore.setFixtureItems(fixtureItems)
      tournamentStore.setLiveFixturesPosted()
      expect(tournamentStore.getLiveFixturesNotPosted().length).toBe(0)
    })
  })

  describe("getFixturesNearToStartNotPosted", () => {
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
      tournamentStore.setFixtureItems(fixtureItems)
      expect(tournamentStore.getFixturesNearToStartNotPosted().length).toBe(
        fixtureItems.length - 2
      )
    })

    it("return no fixtures when were already posted", () => {
      const tournamentStore = TournamentStore.getInstance()
      tournamentStore.setFixtureItems(fixtureItems)
      tournamentStore.setFixturesNearToStartPosted()
      expect(tournamentStore.getFixturesNearToStartNotPosted().length).toBe(0)
    })
  })

  describe("setLiveFixturesEvents", () => {
    let fixtureId = 1
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
      tournamentStore.setLiveFixturesEvents(fixtureId, matchEvents)

      const fixtureEvents = tournamentStore.fixturesEvents[fixtureId]
      expect(fixtureEvents.liveFixtureEventsWithId).toHaveLength(3)
      expect(fixtureEvents.liveFixtureEventsWithId[0].time.elapsed).toEqual(13)
      expect(fixtureEvents.liveFixtureEventsWithId[1].time.elapsed).toEqual(18)
      expect(fixtureEvents.liveFixtureEventsWithId[2].time.elapsed).toEqual(50)
    })
  })

  describe("getLiveFixturesEventsNotPosted", () => {
    let fixtureId = 1
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
      tournamentStore.setLiveFixturesEvents(fixtureId, matchEvents)
      expect(
        tournamentStore.getLiveFixturesEventsNotPosted(fixtureId).length
      ).toBe(3)
    })
    it("return no events after they are posted", () => {
      const tournamentStore = TournamentStore.getInstance()
      tournamentStore.setLiveFixturesEvents(fixtureId, matchEvents)
      tournamentStore.setLiveFixturesPosted()
      tournamentStore.setLiveFixturesEventsPosted(fixtureId)
      expect(
        tournamentStore.getLiveFixturesEventsNotPosted(fixtureId).length
      ).toBe(0)
    })
  })
})
