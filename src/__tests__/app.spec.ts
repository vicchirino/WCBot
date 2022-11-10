import { FixtureItem, MatchEvent, MatchEventWithId } from "../utils/types"
import worldCupLiveFixturesMock from "../utils/mocks/world_cup_live_fixtures.json"
import { getLiveFixture } from "../api/fixturesAPI"
import { postTweets } from "../api/twitterAPI"
import { Match } from "../model/Match"
import * as app from "../app"
import { postEventsOfMatch } from "../domain/match"

jest.mock("../api/fixturesAPI")
jest.mock("../api/twitterAPI")
jest.mock("../domain/match")

const getLiveFixtureMocked = getLiveFixture as jest.Mock<
  ReturnType<typeof getLiveFixture>
>
const postTweetsMocked = postTweets as jest.Mock<ReturnType<typeof postTweets>>
const postEventsOfMatchMocked = postEventsOfMatch as jest.Mock<
  ReturnType<typeof postEventsOfMatch>
>

describe("app", () => {
  describe("processMatchEvents", () => {
    let match: Match
    let fixtureItem = worldCupLiveFixturesMock.response[0] as FixtureItem
    let matchEventsWithId = fixtureItem.events?.map((matchEvent, index) => {
      return { ...matchEvent, id: index }
    }) as MatchEventWithId[]
    beforeEach(() => {
      const fixtureDate = new Date(fixtureItem.fixture.date)
      fixtureItem.fixture.date = new Date(
        fixtureDate.getTime() - 40 * 60 * 1000
      ).toString()
      postEventsOfMatchMocked.mockImplementation(() => Promise.resolve())
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
        const _ = await app.processMatchEvents(match)
        expect(postEventsOfMatchMocked).toHaveBeenCalled()
        expect(postEventsOfMatchMocked).toHaveBeenCalledTimes(1)
        expect(postEventsOfMatchMocked).toHaveBeenCalledWith(
          match,
          matchEventsWithId
        )
      },
      60000 * 3
    )
  })
})
