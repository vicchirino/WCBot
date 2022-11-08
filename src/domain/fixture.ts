import { getFixtures } from "../api/fixturesAPI"
import { FixtureItem, MatchEvent, MatchEventWithId } from "../utils/types"
import { sleep } from "../utils"
import { postTweets } from "../api/twitterAPI"
import { getTweetTextForFixtureEvent } from "./helpers"
import { TournamentStore } from "../model/TournamentStore"

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
  return liveFixtures.find(fixture => fixture?.fixture.id === fixtureID)
}

// Fixture domain functions

export function isFixtureFromToday(fixture: FixtureItem): boolean {
  const today = new Date()
  const fixtureDate = new Date(fixture.fixture.date)
  return (
    today.getFullYear() === fixtureDate.getFullYear() &&
    today.getMonth() === fixtureDate.getMonth() &&
    today.getDate() === fixtureDate.getDate()
  )
}

export function areFixturesToPost(fixtureItems: FixtureItem[]): boolean {
  const now = new Date()
  if (fixtureItems.length === 0) {
    return false
  }
  const firstMatchOfTheDay = fixtureItems[0]
  const lastMatchOfTheDay = fixtureItems[fixtureItems.length - 1]

  const firstMatchOfTheDayDate = new Date(firstMatchOfTheDay.fixture.date)
  const lastMatchOfTheDayDate = new Date(lastMatchOfTheDay.fixture.date)

  /**
   * If now is between the first and last match of the day, there are live fixtures.
   * first: firstMatchOfTheDayDate - 20 minutes
   * last: lastMatchOfTheDayDate + 120 minutes
   */

  const firstMatchDateWithMargin = new Date(
    firstMatchOfTheDayDate.getTime() - 20 * 60 * 1000
  )
  const lastMatchDateWithMargin = new Date(
    lastMatchOfTheDayDate.getTime() + 120 * 60 * 1000
  )

  return now > firstMatchDateWithMargin && now < lastMatchDateWithMargin
}

export function isFixtureHappeningNow(fixture: FixtureItem): boolean {
  const now = new Date()
  const minutes = 90 * 60 * 1000
  const fixtureDate = new Date(fixture.fixture.date)
  const fixtureEstimatedEndDate = new Date(fixtureDate.getTime() + minutes)
  return now > fixtureDate && now < fixtureEstimatedEndDate
}

export function isFixtureLive(item: FixtureItem): boolean {
  return (
    item.fixture.status?.short === "LIVE" ||
    item.fixture.status?.short === "1H" ||
    item.fixture.status?.short === "2H" ||
    item.fixture.status?.short === "HT" ||
    item.fixture.status?.short === "ET" ||
    item.fixture.status?.short === "P" ||
    isFixtureHappeningNow(item)
  )
}

export function isFixtureNearToStart(item: FixtureItem): boolean {
  // 20 minutes before the match
  const minutes = 20
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
  const tournamentStore = TournamentStore.getInstance()
  const liveFixtureId = liveFixture.fixture.id
  while (isFixtureLive(liveFixture)) {
    console.log(
      `-------------------------- Fixture live ${liveFixtureId} --------------------------\n`
    )
    liveFixture =
      (await getLiveFixture(liveFixture.fixture.id, fixtureItem.league.id)) ||
      liveFixture

    tournamentStore.setLiveFixturesEvents(
      liveFixture.fixture.id,
      liveFixture.events || []
    )
    let fixtureEvents = tournamentStore.getLiveFixturesEventsNotPosted(
      fixtureItem.fixture.id
    )
    if (fixtureEvents.length > 0) {
      console.log(
        `-------------------------- Post events of fixture ${liveFixtureId} --------------------------\n`
      )
      console.log(`--- Fixture events: ${fixtureEvents.length}.\n`)
      await postFixtureEvents(liveFixture, fixtureEvents)
      tournamentStore.setLiveFixturesEventsPosted(liveFixtureId)
    } else {
      console.log(
        `-------------------------- No new event for this fixture ${liveFixtureId} --------------------------\n`
      )
    }
    await sleep(60 * 1000)
  }
  console.log("End no more live")
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
