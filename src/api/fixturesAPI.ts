import { FixtureResponse, EventResponse, FixtureItem } from "../utils/types"
import { getRequest } from "./utils"

export async function getFixtures(
  parameters: any
): Promise<FixtureResponse["response"]> {
  const result = await getRequest<FixtureResponse>("fixtures", parameters)
  return result.response
}

export async function getEvents(parameters: {
  fixture: number
}): Promise<EventResponse["response"]> {
  const result = await getRequest<EventResponse>("fixtures/events", parameters)
  return result.response
}

export async function getFixturesFromLeague(
  league: number,
  season: string
): Promise<FixtureItem[]> {
  const fixtureItems = await getFixtures({
    league: league,
    season: season,
  })
  return fixtureItems
}

export async function getLiveFixture(
  fixtureID: number,
  leagueID: number
): Promise<FixtureItem | undefined> {
  const liveFixtures = await getFixtures({ live: "all", league: leagueID })
  return liveFixtures.find(fixture => fixture?.fixture.id === fixtureID)
}
