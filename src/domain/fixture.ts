import { getFixtures } from "../api/fixturesAPI"
import { ChampionsLeagueID } from "../api/leaguesAPI"
import { postTweets } from "../api/twitterAPI"
import { FixtureItem, MatchEvent } from "../utils/types"

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
  fixtureID: number
): Promise<FixtureItem | undefined> {
  const liveFixtures = await getLiveFixtures(ChampionsLeagueID)
  return liveFixtures.find(fixture => fixture.fixture.id === fixtureID)
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

export function postFixtureEvents(
  fixtureItem: FixtureItem,
  events: MatchEvent[]
) {
  postTweets(
    events.map(event => getTweetTextForFixtureEvent(fixtureItem, event))
  )
}

// Fixture domain functions

export function isFixtureLive(item: FixtureItem): boolean {
  // console.log("isFixtureLive", item)
  return (
    item.fixture.status.short === "LIVE" ||
    item.fixture.status.short === "1H" ||
    item.fixture.status.short === "2H" ||
    item.fixture.status.short === "HT" ||
    item.fixture.status.short === "ET" ||
    item.fixture.status.short === "P" ||
    isFixtureHappening(item)
  )
}

// TODO: check this out
export function isFixtureNearToStart(
  item: FixtureItem,
  minutes: number
): boolean {
  return new Date(new Date(item.fixture.date).getTime() - minutes) >= new Date()
}

export function compareFixtureDates(
  fixtureItemA: FixtureItem,
  fixtureItemB: FixtureItem
): number {
  return +fixtureItemA.fixture.date - +fixtureItemB.fixture.date
}

export function isFixtureInTheFuture(item: FixtureItem): boolean {
  return new Date(item.fixture.date) > new Date()
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

// TODO: check this out
function isFixtureHappening(item: FixtureItem) {
  const fiveMinutes = 5 * 60 * 1000
  return (
    new Date(new Date(item.fixture.date).getTime() - fiveMinutes) <= new Date()
  )
}
