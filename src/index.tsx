import { FixtureItem, FixtureResponse, MatchEvent } from "./utils/types"
import { sleep } from "./utils"
import { ChampionsLeagueID, EuropaLeagueID } from "./api/leaguesAPI"
import {
  getFixturesFromLeague,
  isFixtureNearToStart,
  compareFixtureDates,
  postEventsOfFixture,
  isFixtureInThePast,
  isFixtureLive,
  postReadyToStartFixtures,
} from "./domain/fixture"
import liveFixturesMock from "./utils/mocks/live_fixtures_response.json"

const minutes = 15

async function main() {
  let fixtureItems = await getFixturesFromLeague(EuropaLeagueID, "2022")
  fixtureItems.sort((itemA, itemB) => compareFixtureDates(itemA, itemB))
  console.log("#### Fixtures from League", fixtureItems.length)
  console.log("----------------------------------\n")
  let fixturesLive: FixtureItem[] = fixtureItems.filter(fixtureItem =>
    isFixtureLive(fixtureItem)
  )
  let fixturesLivePosted: FixtureItem[] = []
  let fixturesNearToStart: FixtureItem[] = fixtureItems.filter(fixtureItem =>
    isFixtureNearToStart(fixtureItem, minutes)
  )
  let fixturesNearToStartPosted: FixtureItem[] = []
  let nearestFixture: FixtureItem | undefined = fixtureItems && fixtureItems[0]

  let firstMatchOfTheDay: FixtureItem
  let lastMatchOfTheDay: FixtureItem

  // Get fixtures
  // Get today fixtures
  //
  // WHILE firstMatchOfTheDay.date - 20 min is in the past
  // AND lastMatchOfTheDay.date + 120 min is in the future
  //
  //

  while (true) {
    // if (isFixtureInThePast(nearestFixture)) {
    //   fixtureItems = await getFixturesFromLeague(EuropaLeagueID, "2022")
    //   fixtureItems.sort((itemA, itemB) => compareFixtureDates(itemA, itemB))
    //   nearestFixture = fixtureItems && fixtureItems[0]
    // }
    console.log("#### Fixtures from League sorted", fixtureItems.length)
    console.log("----------------------------------\n")
    console.log(
      "#### Fixtures near to start posted",
      fixturesNearToStartPosted.length
    )
    console.log("----------------------------------\n")
    console.log("#### Fixtures live posted", fixturesLivePosted.length)
    console.log("----------------------------------\n")

    fixturesNearToStart = fixtureItems.filter(
      fixtureItem =>
        isFixtureNearToStart(fixtureItem, minutes) &&
        !fixturesNearToStartPosted.find(
          ({ fixture }) => fixture.id === fixtureItem.fixture.id
        )
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
        isFixtureLive(fixtureItem) &&
        !fixturesLivePosted.find(
          ({ fixture }) => fixture.id === fixtureItem.fixture.id
        )
    )
    // fixturesLive = liveFixturesMock.response as FixtureItem[]
    console.log("#### Fixtures Live", fixturesLive.length)
    console.log("----------------------------------\n")

    // Si hay partidos en vivo posteo los events
    if (fixturesLive.length > 0) {
      fixturesLivePosted = [...fixturesLivePosted, ...fixturesLive]
      console.log("#### Fixtures Live Posted", fixturesLivePosted.length)
      console.log("----------------------------------\n")
      for (const key in fixturesLive) {
        postEventsOfFixture(fixturesLive[key])
      }
    }
    await sleep(60 * 1000)
  }
}

main()
