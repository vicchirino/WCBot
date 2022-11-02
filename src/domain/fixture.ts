import { getFixtures } from "../api/fixturesAPI"
import { ChampionsLeagueID } from "../api/leaguesAPI"
import { postTweets } from "../api/twitterAPI"
import { FixtureItem, MatchEvent, MatchEventWithId } from "../utils/types"
import fixtures from "../utils/mocks/champions_league_response.json"
import liveFixturesMock from "../utils/mocks/fixtures_response.json"

// Fixtures API functions

export async function getLiveFixtures(league: number) {
  const liveFixtures = await getFixtures({ live: "all", league: league })
  return liveFixtures
}

export async function getFixturesFromLeague(
  league: number,
  season: string
): Promise<FixtureItem[]> {
  // const fixtureItems = await getFixtures({
  //   league: league,
  //   season: season,
  // })
  return fixtures.response
}

export async function getLiveFixture(
  fixtureID: number
): Promise<FixtureItem | undefined> {
  const liveFixtures = await getLiveFixtures(ChampionsLeagueID)
  // return liveFixtures.find(fixture => fixture.fixture.id === fixtureID)
  return liveFixturesMock.response[8] as FixtureItem
}

// Twitter API functions

export function postReadyToStartFixtures(fixtures: FixtureItem[]) {
  postTweets(
    fixtures.map(
      fixtureItem =>
        `⚽️ ${fixtureItem.teams.home.name} vs ${fixtureItem.teams.away.name} is about to start!`
    )
  )
}

export async function postEventsOfFixture(fixtureItem: FixtureItem) {
  let liveFixture = fixtureItem
  let eventsPosted: MatchEventWithId[] = []
  while (isFixtureLive(liveFixture)) {
    let liveFixtureUpdated = await getLiveFixture(liveFixture.fixture.id)
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
  }
}

export async function postFixtureEvents(
  fixtureItem: FixtureItem,
  events: MatchEvent[]
) {
  await postTweets(
    events.map(event => getTweetTextForFixtureEvent(fixtureItem, event))
  )
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
  now.setMinutes(now.getMinutes() + minutes)
  return now > fixtureDate
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

// Helper functions

function getTweetTextForFixtureEvent(
  fixtureItem: FixtureItem,
  event: MatchEvent
): string {
  if (event.type === "Goal") {
    if (event.detail === "Penalty") {
      return `➡️  Penalty scored!!\n\n⚽ ${event.player.name} - ${event.team.name}\n\n⏰ ${fixtureItem.fixture.status.elapsed}min ${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}`
    }
    if (event.detail === "Own Goal") {
      return `➡️  Own Goal\n\n⚽${event.player.name} - ${event.team.name}\n\n⏰ ${fixtureItem.fixture.status.elapsed}min ${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}`
    }
    if (event.detail === "Normal Goal") {
      return `➡️  Goal\n\n⚽ ${event.player.name} - ${event.team.name}\n${
        event.assist.name ? `👥 ${event.assist.name}` : ""
      }\n${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${
        fixtureItem.goals.away
      } ${fixtureItem.teams.away.name}\n⏰ ${
        fixtureItem.fixture.status.elapsed
      }min`
    }
    if (event.detail === "Missed Penalty") {
      return `➡️ Missed Penalty\n❌${event.player.name}\n\n⏰ ${fixtureItem.fixture.status.elapsed}min ${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}`
    }
  }
  if (event.type === "Card") {
    if (event.detail === "Yellow Card") {
      return `${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}\n🟡 ${event.player.name} - ${event.team.name} \n⏰ ${fixtureItem.fixture.status.elapsed}min`
    }
    if (event.detail === "Second Yellow card") {
      return `${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}\n🟡🟡 ${event.player.name} - ${event.team.name} \n⏰ ${fixtureItem.fixture.status.elapsed}min`
    }
    if (event.detail === "Red Card") {
      return `${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}\n🔴 ${event.player.name} - ${event.team.name} \n⏰ ${fixtureItem.fixture.status.elapsed}min`
    }
  }
  return ""
}
