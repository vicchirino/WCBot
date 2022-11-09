import { FixtureItem } from "../../utils/types"
import {
  areMatchesToPost,
  compareMatchDates,
  postReadyToStartMatches,
  postEventsOfMatch,
} from "../match"
import worldCupFixturesMock from "../../utils/mocks/world_cup_fixtures.json"
import worldCupLiveFixturesMock from "../../utils/mocks/world_cup_live_fixtures.json"
import { getLiveFixture } from "../../api/fixturesAPI"
import { postTweets } from "../../api/twitterAPI"
import { Match } from "../../model/Match"

jest.mock("../../api/fixturesAPI")
jest.mock("../../api/twitterAPI")

const getLiveFixtureMocked = getLiveFixture as jest.Mock<
  ReturnType<typeof getLiveFixture>
>

const postTweetsMocked = postTweets as jest.Mock<ReturnType<typeof postTweets>>

describe("domain/match", () => {
  describe("Domain helper functions", () => {
    describe("compareMatchDates", () => {
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
        const matchA = new Match(fixtureItemA)
        const matchB = new Match(fixtureItemB)
        expect(compareMatchDates(matchA, matchB)).toBe(0)
      })
      it("returns negative when the item A date is earlier", () => {
        const fixtureItemA = {
          fixture: { id: 1, date: today.toString() },
        } as FixtureItem
        const fixtureItemB = {
          fixture: { id: 2, date: tomorrow.toString() },
        } as FixtureItem
        const matchA = new Match(fixtureItemA)
        const matchB = new Match(fixtureItemB)
        expect(compareMatchDates(matchA, matchB)).toBeLessThan(0)
      })
      it("returns positive when the item A date is oldest", () => {
        const fixtureItemA = {
          fixture: { id: 1, date: tomorrow.toString() },
        } as FixtureItem
        const fixtureItemB = {
          fixture: { id: 2, date: today.toString() },
        } as FixtureItem
        const matchA = new Match(fixtureItemA)
        const matchB = new Match(fixtureItemB)
        expect(compareMatchDates(matchA, matchB)).toBeGreaterThan(0)
      })
    })

    describe("areMatchesToPost", () => {
      let matches: Match[]
      const today = new Date()

      describe("when no fixtures are passed", () => {
        it("return false ", () => {
          matches = []
          expect(areMatchesToPost(matches)).toBe(false)
        })
      })

      describe("when only one fixture is passed", () => {
        it("return false if the fixture is not on the expected dates", () => {
          const tomorrow = new Date()
          tomorrow.setDate(today.getDate() + 1)
          const fixtureItems = [
            {
              fixture: { id: 1, date: tomorrow.toString() },
            } as FixtureItem,
          ]
          matches = fixtureItems.map(item => new Match(item))
          expect(areMatchesToPost(matches)).toBe(false)
        })

        it("return true if the fixture is near to start", () => {
          const minutes = 10 * 1000 * 60
          const fixtureDate = new Date(today.getTime() + minutes)
          const fixtureItems = [
            {
              fixture: { id: 1, date: fixtureDate.toString() },
            } as FixtureItem,
          ]
          matches = fixtureItems.map(item => new Match(item))
          expect(areMatchesToPost(matches)).toBe(true)
        })

        it("return true if the fixture is happening", () => {
          const minutes = 40 * 1000 * 60
          const fixtureDate = new Date(today.getTime() - minutes)
          const fixtureItems = [
            {
              fixture: { id: 1, date: fixtureDate.toString() },
            } as FixtureItem,
          ]
          matches = fixtureItems.map(item => new Match(item))
          expect(areMatchesToPost(matches)).toBe(true)
        })
      })

      describe("when more than 1 fixture is passed", () => {
        it("return false if there aren't fixtures on the expected dates", () => {
          const tomorrow = new Date()
          tomorrow.setDate(today.getDate() + 1)
          const fixtureItems = [
            {
              fixture: { id: 1, date: tomorrow.toString() },
            } as FixtureItem,
            {
              fixture: { id: 2, date: tomorrow.toString() },
            } as FixtureItem,
            {
              fixture: { id: 3, date: tomorrow.toString() },
            } as FixtureItem,
          ]
          matches = fixtureItems.map(item => new Match(item))
          expect(areMatchesToPost(matches)).toBe(false)
        })

        it("return true if there is one fixture near to start", () => {
          const minutes = 10 * 1000 * 60
          const tomorrow = new Date()
          tomorrow.setDate(today.getDate() + 1)
          const fixtureDate = new Date(today.getTime() + minutes)
          const fixtureItems = [
            {
              fixture: { id: 1, date: tomorrow.toString() },
            } as FixtureItem,
            {
              fixture: { id: 2, date: fixtureDate.toString() },
            } as FixtureItem,
            {
              fixture: { id: 3, date: tomorrow.toString() },
            } as FixtureItem,
          ]
          matches = fixtureItems.map(item => new Match(item))
          expect(areMatchesToPost(matches)).toBe(true)
        })

        it("return true if there is one fixture happening", () => {
          const minutes = 40 * 1000 * 60
          const tomorrow = new Date()
          tomorrow.setDate(today.getDate() + 1)
          const fixtureDate = new Date(today.getTime() - minutes)
          const fixtureItems = [
            {
              fixture: { id: 1, date: tomorrow.toString() },
            } as FixtureItem,
            {
              fixture: { id: 2, date: fixtureDate.toString() },
            } as FixtureItem,
            {
              fixture: { id: 3, date: tomorrow.toString() },
            } as FixtureItem,
          ]
          matches = fixtureItems.map(item => new Match(item))
          expect(areMatchesToPost(matches)).toBe(true)
        })
      })
    })
  })

  describe("Twitter API helper functions", () => {
    beforeEach(() => {
      postTweetsMocked.mockImplementation()
    })
    afterEach(() => {
      postTweetsMocked.mockClear()
      jest.clearAllMocks()
    })
    describe("postReadyToStartMatches", () => {
      const fixturesReadyToStart =
        worldCupFixturesMock.response as FixtureItem[]
      const matches = fixturesReadyToStart.map(item => new Match(item))
      it("call post twitter functions correctly", async () => {
        const _ = await postReadyToStartMatches(matches)
        expect(postTweetsMocked).toHaveBeenCalled()
        expect(postTweetsMocked).toHaveBeenCalledTimes(1)
      })
    })

    describe("postEventsOfFixture", () => {
      let match: Match
      let fixtureItem: FixtureItem
      beforeEach(() => {
        fixtureItem = worldCupLiveFixturesMock.response[0] as FixtureItem
        const fixtureDate = new Date(fixtureItem.fixture.date)
        fixtureItem.fixture.date = new Date(
          fixtureDate.getTime() - 40 * 60 * 1000
        ).toString()
        getLiveFixtureMocked
          // Mock the first call wih the same fixtureItem but the date is 40 minutes before the current time.
          .mockReturnValueOnce(Promise.resolve(fixtureItem as FixtureItem))
          // Mock second call with the same fixtureItem but the status is now "FT" (full time)
          .mockReturnValueOnce(
            Promise.resolve({
              ...fixtureItem,
              fixture: { ...fixtureItem.fixture, status: { short: "FT" } },
            } as FixtureItem)
          )
      })

      it(
        "call post twitter functions correctly",
        async () => {
          match = new Match(fixtureItem)
          const _ = await postEventsOfMatch(match)
          const getTweetTextForEvent = jest.spyOn(match, "getTweetTextForEvent")
          expect(postTweetsMocked).toHaveBeenCalled()
          expect(postTweetsMocked).toHaveBeenCalledTimes(1)
          expect(postTweetsMocked).toHaveBeenCalledWith(
            match
              .matchEvents()
              .map(matchEvent => match.getTweetTextForEvent(matchEvent))
          )
        },
        60000 * 3
      )
    })
  })
})
