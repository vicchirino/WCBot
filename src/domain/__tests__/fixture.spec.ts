import { FixtureItem, MatchEvent } from "../../utils/types"
import {
  compareFixtureDates,
  isFixtureInTheFuture,
  isFixtureInThePast,
  isFixtureLive,
  isFixtureNearToStart,
  getLiveFixture,
  getLiveFixtures,
  getFixturesFromLeague,
  postFixtureEvents,
  postReadyToStartFixtures,
} from "../fixture"
import liveFixturesMock from "../../utils/mocks/live_fixtures_response.json"
import worldCupFixturesMock from "../../utils/mocks/world_cup_fixtures.json"
import { getFixtures } from "../../api/fixturesAPI"
import { postTweets } from "../../api/twitterAPI"
import * as helpers from "../helpers"

jest.mock("../../api/fixturesAPI")
jest.mock("../../api/twitterAPI")

const getFixturesMocked = getFixtures as jest.Mock<
  ReturnType<typeof getFixtures>
>

const postTweetsMocked = postTweets as jest.Mock<ReturnType<typeof postTweets>>

describe("domain/fixture", () => {
  describe("Domain functions", () => {
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
        expect(compareFixtureDates(fixtureItemA, fixtureItemB)).toBeGreaterThan(
          0
        )
      })
    })

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

    describe("isFixtureNearToStart", () => {
      let fixtureItem: FixtureItem
      const now = new Date()

      it("return false if the match is in the past", () => {
        const days = 5
        const fixtureDate = new Date(now.getDate() - days)
        // Ten minutes in milliseconds
        const minutes = 10 * 1000 * 60
        fixtureItem = {
          fixture: { id: 1, date: fixtureDate.toString() },
        } as FixtureItem
        expect(isFixtureNearToStart(fixtureItem, minutes)).toBe(false)
      })

      it("return true if the match is <= 10 minutes away", () => {
        // Ten minutes in milliseconds
        const tenMinutes = 10 * 1000 * 60
        const fixtureDate = new Date(now.getTime() + tenMinutes)
        fixtureItem = {
          fixture: { id: 1, date: fixtureDate.toString() },
        } as FixtureItem
        expect(isFixtureNearToStart(fixtureItem, tenMinutes)).toBe(true)
      })

      it("return false if the match is > 10 minutes away", () => {
        const tenMinutes = 10
        const elevenMinutes = 11
        const fixtureDate = new Date(now.getTime() + elevenMinutes * 1000 * 60)
        fixtureItem = {
          fixture: { id: 1, date: fixtureDate.toString() },
        } as FixtureItem
        expect(isFixtureNearToStart(fixtureItem, tenMinutes)).toBe(false)
      })
    })
  })

  describe("Fixtures API functions", () => {
    describe("getLiveFixture", () => {
      beforeEach(() => {
        getFixturesMocked.mockReturnValue(
          Promise.resolve(liveFixturesMock.response as FixtureItem[])
        )
      })
      it("return the live fixture when the correct fixture id and league are passed", async () => {
        const fixtureId = liveFixturesMock.response[0].fixture.id
        const leagueId = liveFixturesMock.response[0].league.id
        const liveFixture = await getLiveFixture(fixtureId, leagueId)
        expect(liveFixture).toBeDefined()
        expect(liveFixture?.fixture.id).toEqual(fixtureId)
      })
      it("return nothing when an incorrect fixture id is passed", async () => {
        const fixtureId = 923849234
        const leagueId = liveFixturesMock.response[0].league.id
        const liveFixture = await getLiveFixture(fixtureId, leagueId)
        expect(liveFixture).toBeUndefined()
      })
    })

    describe("getLiveFixtures", () => {
      const leagueId = 1
      beforeEach(() => {
        getFixturesMocked.mockReturnValue(
          Promise.resolve(liveFixturesMock.response as FixtureItem[])
        )
      })
      afterEach(() => {
        getFixturesMocked.mockClear()
      })
      it("returns the list of live fixtures correctly", async () => {
        const liveFixtures = await getLiveFixtures(leagueId)
        expect(liveFixtures).toHaveLength(liveFixturesMock.response.length)
        expect(liveFixtures[0].fixture.id).toEqual(
          liveFixturesMock.response[0].fixture.id
        )
      })
      it("call getFixtures API", async () => {
        const _ = await getLiveFixtures(leagueId)
        expect(getFixturesMocked).toHaveBeenCalled()
        expect(getFixturesMocked).toHaveBeenCalledTimes(1)
        expect(getFixturesMocked).toHaveBeenCalledWith({
          league: leagueId,
          live: "all",
        })
      })
    })

    describe("getFixturesFromLeague", () => {
      const leagueId = 1
      const season = "2022"
      beforeEach(() => {
        getFixturesMocked.mockReturnValue(
          Promise.resolve(worldCupFixturesMock.response as FixtureItem[])
        )
      })
      afterEach(() => {
        getFixturesMocked.mockClear()
      })
      it("return list of league fixtures correctly", async () => {
        const leagueFixtures = await getFixturesFromLeague(leagueId, season)
        expect(leagueFixtures).toHaveLength(
          worldCupFixturesMock.response.length
        )
        expect(leagueFixtures[0].fixture.id).toEqual(
          worldCupFixturesMock.response[0].fixture.id
        )
      })
      it("call getFixtures API", async () => {
        const _ = await getFixturesFromLeague(leagueId, season)
        expect(getFixturesMocked).toHaveBeenCalled()
        expect(getFixturesMocked).toHaveBeenCalledTimes(1)
        expect(getFixturesMocked).toHaveBeenCalledWith({
          league: leagueId,
          season: season,
        })
      })
    })
  })

  describe("Twitter API functions", () => {
    beforeEach(() => {
      postTweetsMocked.mockImplementation()
    })
    afterEach(() => {
      postTweetsMocked.mockClear()
    })
    describe("postFixtureEvents", () => {
      const fixtureItem = liveFixturesMock.response[4] as FixtureItem
      const fixtureEvents = fixtureItem.events as MatchEvent[]
      const getTweetTextForFixtureEventSpy = jest.spyOn(
        helpers,
        "getTweetTextForFixtureEvent"
      )
      it("call post twitter functions correctly", async () => {
        const _ = await postFixtureEvents(fixtureItem, fixtureEvents)
        expect(postTweetsMocked).toHaveBeenCalled()
        expect(postTweetsMocked).toHaveBeenCalledTimes(1)
        expect(getTweetTextForFixtureEventSpy).toHaveBeenCalledTimes(
          fixtureEvents.length
        )
      })
    })

    describe("postReadyToStartFixtures", () => {
      const fixturesReadyToStart =
        worldCupFixturesMock.response as FixtureItem[]
      it("call post twitter functions correctly", async () => {
        const _ = await postReadyToStartFixtures(fixturesReadyToStart)
        expect(postTweetsMocked).toHaveBeenCalled()
        expect(postTweetsMocked).toHaveBeenCalledTimes(1)
      })
    })
  })
})
