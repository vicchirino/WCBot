import { FixtureItem } from "./utils/types"
import { sleep } from "./utils"
import { SerieA } from "./api/leaguesAPI"
import {
  getFixturesFromLeague,
  isFixtureNearToStart,
  compareFixtureDates,
  postEventsOfFixture,
  isFixtureLive,
  postReadyToStartFixtures,
  isFixtureFromToday,
  areFixturesToPost,
} from "./domain/fixture"

class TournamentStore {
  private static instance: TournamentStore

  fixtureItems: FixtureItem[] = []
  liveFixtures: FixtureItem[] = []
  liveFixturesPosted: FixtureItem[] = []
  fixturesNearToStart: FixtureItem[] = []
  fixturesNearToStarPosted: FixtureItem[] = []
  fixturesFromToday: FixtureItem[] = []

  private constructor() {}

  public static getInstance(): TournamentStore {
    if (!TournamentStore.instance) {
      TournamentStore.instance = new TournamentStore()
    }
    return TournamentStore.instance
  }

  public setFixtureItems(fixtures: FixtureItem[]) {
    this.fixtureItems = fixtures.sort((itemA, itemB) =>
      compareFixtureDates(itemA, itemB)
    )
    this.liveFixtures = this.fixtureItems.filter(fixtureItem =>
      isFixtureLive(fixtureItem)
    )
    this.fixturesNearToStart = this.fixtureItems.filter(fixtureItem =>
      isFixtureNearToStart(fixtureItem)
    )
    this.fixturesFromToday = this.fixtureItems.filter(fixtureItem =>
      isFixtureFromToday(fixtureItem)
    )
  }

  public getLiveFixturesNotPosted(): FixtureItem[] {
    this.liveFixtures = this.fixtureItems.filter(
      fixtureItem =>
        isFixtureLive(fixtureItem) &&
        !this.liveFixturesPosted.find(
          ({ fixture }) => fixture.id === fixtureItem.fixture.id
        )
    )
    return this.liveFixtures
  }

  public setLiveFixturesPosted() {
    this.liveFixturesPosted = this.liveFixturesPosted.concat(
      this.getLiveFixturesNotPosted()
    )
  }

  public getFixturesNearToStartNotPosted(): FixtureItem[] {
    this.fixturesNearToStart = this.fixtureItems.filter(
      fixtureItem =>
        isFixtureNearToStart(fixtureItem) &&
        !this.fixturesNearToStarPosted.find(
          ({ fixture }) => fixture.id === fixtureItem.fixture.id
        )
    )
    return this.fixturesNearToStart
  }

  public setFixturesNearToStartPosted() {
    this.fixturesNearToStarPosted = this.fixturesNearToStarPosted.concat(
      this.getFixturesNearToStartNotPosted()
    )
  }
}

async function main() {
  console.log(
    "-------------------------- Program start --------------------------\n"
  )
  let fixtureItems = await getFixturesFromLeague(SerieA, "2022")
  let today = new Date()

  console.log(`--- Today is: ${today.toDateString()}\n`)
  console.log(`--- League: WorldCup.\n`)
  console.log(`--- Fixtures: ${fixtureItems.length}.\n`)

  const tournamentStore = TournamentStore.getInstance()
  tournamentStore.setFixtureItems(fixtureItems)

  while (true) {
    if (today.getDay() !== new Date().getDay()) {
      console.log(
        "-------------------------- New day! --------------------------\n"
      )
      today = new Date()
      fixtureItems = await getFixturesFromLeague(SerieA, "2022")
      console.log(`--- Today is: ${today.toDateString()}\n`)
      console.log(`--- Fixtures: ${fixtureItems.length}.\n`)
      tournamentStore.setFixtureItems(fixtureItems)
    }

    if (areFixturesToPost(tournamentStore.fixturesFromToday)) {
      console.log(
        "-------------------------- Fixtures ready to post! --------------------------\n"
      )
      // Post fixtures ready to start
      let fixturesNearToStartNotPosted =
        tournamentStore.getFixturesNearToStartNotPosted()
      if (fixturesNearToStartNotPosted.length > 0) {
        console.log(
          "-------------------------- Post fixtures near to start --------------------------\n"
        )
        console.log(
          `--- Fixtures near to start: ${fixturesNearToStartNotPosted.length}.\n`
        )
        postReadyToStartFixtures(fixturesNearToStartNotPosted)
        tournamentStore.setFixturesNearToStartPosted()
      }

      // Post events of fixtures live
      let liveFixturesNotPosted = tournamentStore.getLiveFixturesNotPosted()
      if (liveFixturesNotPosted.length > 0) {
        console.log(
          "-------------------------- Post events of live fixtures --------------------------\n"
        )
        console.log(`--- Fixtures live: ${liveFixturesNotPosted.length}.\n`)
        for (const index in liveFixturesNotPosted) {
          postEventsOfFixture(liveFixturesNotPosted[index])
        }
        tournamentStore.setLiveFixturesPosted()
      }
      await sleep(60 * 1000)
    } else {
      console.log(
        "-------------------------- No more fixtures today! --------------------------\n"
      )
    }
  }
}

main()
