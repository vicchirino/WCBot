import { getFixtures } from "../api/fixturesAPI"
import { ChampionsLeagueID, EuropaLeagueID } from "../api/leaguesAPI"
import { FixtureItem, MatchEvent, MatchEventWithId } from "../utils/types"
import { sleep } from "../utils"
import { postTweets } from "../api/twitterAPI"
import { getTweetTextForFixtureEvent } from "./helpers"

// Fixtures API functions

export async function getLiveFixtures(league: number) {
  const liveFixtures = await getFixtures({ live: "all", league: league })
  return liveFixtures
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
  const liveFixtures = await getLiveFixtures(leagueID)
  return liveFixtures.find(fixture => fixture.fixture.id === fixtureID)
}

// Fixture domain functions

export function isFixtureLive(item: FixtureItem): boolean {
  return (
    item.fixture.status.short === "LIVE" ||
    item.fixture.status.short === "1H" ||
    item.fixture.status.short === "2H" ||
    item.fixture.status.short === "HT" ||
    item.fixture.status.short === "ET" ||
    item.fixture.status.short === "P"
  )
}

export function isFixtureNearToStart(
  item: FixtureItem,
  minutes: number
): boolean {
  const fixtureDate = new Date(item.fixture.date)
  const now = new Date()
  if (fixtureDate < now) {
    return false
  }
  const nowWithMinutes = new Date(now.getTime() + minutes * 60 * 1000)
  return nowWithMinutes > fixtureDate
}

export function compareFixtureDates(
  fixtureItemA: FixtureItem,
  fixtureItemB: FixtureItem
): number {
  return (
    +new Date(fixtureItemA.fixture.date) - +new Date(fixtureItemB.fixture.date)
  )
}

export function isFixtureInTheFuture(item: FixtureItem): boolean {
  return new Date(item.fixture.date) > new Date()
}

export function isFixtureInThePast(item: FixtureItem): boolean {
  return new Date(item.fixture.date) < new Date()
}

// Twitter API functions

export async function postEventsOfFixture(fixtureItem: FixtureItem) {
  let liveFixture = fixtureItem
  let eventsPosted: MatchEventWithId[] = []
  while (isFixtureLive(liveFixture)) {
    let liveFixtureUpdated = await getLiveFixture(
      liveFixture.fixture.id,
      fixtureItem.league.id
    )
    liveFixture = liveFixtureUpdated || liveFixture
    let events = (liveFixtureUpdated?.events || []).sort(
      (eventA, eventB) => eventA.time.elapsed - eventB.time.elapsed
    )

    // Events doesn't have id, so I add it to check that the event is not posted
    let eventsWithId: MatchEventWithId[] = events.map((matchEvent, index) => {
      return { id: index, ...matchEvent }
    })
    eventsWithId = eventsWithId.filter(
      matchEvent =>
        !eventsPosted.find(eventPosted => eventPosted.id === matchEvent.id)
    )
    eventsPosted = eventsPosted.concat(eventsWithId)
    console.log(
      `#### Fixture ${liveFixture.fixture.id} new events`,
      eventsWithId.length
    )
    console.log("----------------------------------\n")
    console.log(
      `#### Fixture ${liveFixture.fixture.id} events posted`,
      eventsPosted.length
    )
    console.log("----------------------------------\n")
    await postFixtureEvents(liveFixture, eventsWithId)
    await sleep(60 * 1000)
  }
}

export function postReadyToStartFixtures(fixtures: FixtureItem[]) {
  postTweets(
    fixtures.map(
      fixtureItem =>
        `⚽️ ${fixtureItem.teams.home.name} vs ${fixtureItem.teams.away.name} is about to start!`
    )
  )
}

export async function postFixtureEvents(
  fixtureItem: FixtureItem,
  events: MatchEvent[]
) {
  await postTweets(
    events.map(event => getTweetTextForFixtureEvent(fixtureItem, event))
  )
}
