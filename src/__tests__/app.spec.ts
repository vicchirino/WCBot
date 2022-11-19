import { FixtureItem, MatchEventWithId } from "../utils/types"
import worldCupLiveFixturesMock from "../utils/mocks/world_cup_live_fixtures.json"
import { getLiveFixture, getFixture } from "../api/fixturesAPI"
import { Match } from "../model/Match"
import * as app from "../app"
import { postEventsOfMatch, postMatchFinished } from "../domain/match"

jest.mock("../api/fixturesAPI")
jest.mock("../domain/match")

const getLiveFixtureMocked = getLiveFixture as jest.Mock<
  ReturnType<typeof getLiveFixture>
>
const getFixtureMocked = getFixture as jest.Mock<ReturnType<typeof getFixture>>
const postEventsOfMatchMocked = postEventsOfMatch as jest.Mock<
  ReturnType<typeof postEventsOfMatch>
>
const postMatchFinishedMocked = postMatchFinished as jest.Mock<
  ReturnType<typeof postMatchFinished>
>

describe("app", () => {
  describe("processMatchEvents", () => {
    let match: Match
    const fixtureItem = worldCupLiveFixturesMock.response[0] as FixtureItem
    const matchEventsWithId = fixtureItem.events?.map((matchEvent, index) => {
      return { ...matchEvent, id: index }
    }) as MatchEventWithId[]
    beforeEach(() => {
      const fixtureDate = new Date(fixtureItem.fixture.date)
      fixtureItem.fixture.date = new Date(
        fixtureDate.getTime() - 40 * 60 * 1000
      ).toString()
      postEventsOfMatchMocked.mockImplementation(() => Promise.resolve())
      postMatchFinishedMocked.mockImplementation(() => Promise.resolve())
      getLiveFixtureMocked
        // Mock the first call wih the same fixtureItem but the date is 40 minutes before the current time.
        .mockReturnValueOnce(Promise.resolve(fixtureItem as FixtureItem))
        // Mock second call will not return the fixtureItem because the match is finished.
        .mockReturnValueOnce(Promise.resolve(undefined))
      getFixtureMocked.mockReturnValueOnce(
        Promise.resolve({
          ...fixtureItem,
          fixture: {
            ...fixtureItem.fixture,
            status: { short: "FT", long: "adasd", elapsed: 90 },
          },
        })
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
        expect(postMatchFinishedMocked).toHaveBeenCalled()
        expect(postMatchFinishedMocked).toHaveBeenCalledTimes(1)
        expect(postMatchFinishedMocked).toHaveBeenCalledWith(match)
      },
      60000 * 3
    )
  })
})
