import { FixtureItem, FixtureResponse, MatchEvent } from "./utils/types"
import { sleep } from "./utils"
import { ChampionsLeagueID } from "./api/leaguesAPI"
import {
  getFixturesFromLeague,
  getLiveFixture,
  isFixtureInTheFuture,
  isFixtureLive,
  isFixtureNearToStart,
  compareFixtureDates,
  postFixtureEvents,
  postReadyToStartFixtures,
} from "./domain/fixture"
import { getEvents } from "./api/fixturesAPI"

async function postEventsOfFixture(fixtureItem: FixtureItem) {
  let liveFixture = fixtureItem
  let eventsPosted: MatchEvent[] = []
  while (isFixtureLive(liveFixture)) {
    let liveFixtureUpdated = await getLiveFixture(liveFixture.fixture.id)
    liveFixture = liveFixtureUpdated || liveFixture
    let events = liveFixtureUpdated?.events || []
    console.log(`#### Fixture ${liveFixture.fixture.id} events`, events.length)
    console.log("----------------------------------\n")
    events = events.filter(matchEvent => !eventsPosted.includes(matchEvent))
    eventsPosted = [...eventsPosted, ...events]
    console.log(
      `#### Fixture ${liveFixture.fixture.id} events posted`,
      eventsPosted.length
    )
    console.log("----------------------------------\n")
    postFixtureEvents(liveFixture, events)
  }
}

async function main() {
  const fixtureItems = await getFixturesFromLeague(ChampionsLeagueID, "2022")
  console.log("#### Fixtures from League", fixtureItems.length)
  console.log("----------------------------------\n")
  let fixturesLive: FixtureItem[] = []
  let fixturesLivePosted: FixtureItem[] = []
  let fixturesNearToStart: FixtureItem[] = []
  let fixturesNearToStartPosted: FixtureItem[] = []

  while (true) {
    fixtureItems.sort((itemA, itemB) => compareFixtureDates(itemA, itemB))
    console.log("#### Fixtures from League sorted", fixtureItems.length)
    console.log("----------------------------------\n")
    console.log(
      "#### Fixtures near to start posted",
      fixturesNearToStartPosted.length
    )
    console.log("----------------------------------\n")
    console.log("#### Fixtures live posted", fixturesLivePosted.length)
    console.log("----------------------------------\n")
    const minutes = 5 * 60 * 1000 // 45 minutes
    fixturesNearToStart = fixtureItems.filter(
      fixtureItem =>
        isFixtureNearToStart(fixtureItem, minutes) &&
        !fixturesNearToStartPosted.includes(fixtureItem)
    )

    console.log("#### Fixtures near to start", fixturesNearToStart.length)
    console.log("----------------------------------\n")

    // Si hay partidos por empezar posteo el tweet
    if (fixturesNearToStart.length > 0) {
      fixturesNearToStartPosted = [
        ...fixturesNearToStartPosted,
        ...fixturesNearToStart,
      ]
      console.log(
        "#### Fixtures near to start posted",
        fixturesNearToStartPosted.length
      )
      console.log("----------------------------------\n")
      postReadyToStartFixtures(fixturesNearToStart)
    }

    fixturesLive = fixtureItems.filter(
      fixtureItem =>
        isFixtureLive(fixtureItem) && !fixturesLivePosted.includes(fixtureItem)
    )
    console.log("#### Fixtures Live", fixturesLive.length)
    console.log("----------------------------------\n")
    // Si hay partidos en vivo posteo los events
    if (fixturesLive.length > 0) {
      fixturesLivePosted = [...fixturesLivePosted, ...fixturesLive]
      console.log("#### Fixtures Live Posted", fixturesLivePosted.length)
      console.log("----------------------------------\n")
      fixturesLive.forEach(fixtureItem => {
        postEventsOfFixture(fixtureItem)
      })
    }

    await sleep(10000)
  }
}

main()
