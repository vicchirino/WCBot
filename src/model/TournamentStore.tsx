import {
  compareFixtureDates,
  isFixtureFromToday,
  isFixtureLive,
  isFixtureNearToStart,
} from "../domain/fixture"
import { FixtureItem, MatchEvent, MatchEventWithId } from "../utils/types"

type FixturesEvents = {
  [key: number]: {
    liveFixtureEventsWithId: MatchEventWithId[]
    liveFixtureEventsWithIdPosted: MatchEventWithId[]
  }
}

export class TournamentStore {
  private static instance: TournamentStore

  private _fixtureItems: FixtureItem[] = []
  private liveFixtures: FixtureItem[] = []
  private liveFixturesPosted: FixtureItem[] = []
  private fixturesNearToStart: FixtureItem[] = []
  private fixturesNearToStarPosted: FixtureItem[] = []
  private _fixturesEvents: FixturesEvents = {}

  fixturesFromToday: FixtureItem[] = []

  private constructor() {}

  public static getInstance(): TournamentStore {
    if (!TournamentStore.instance) {
      TournamentStore.instance = new TournamentStore()
    }
    return TournamentStore.instance
  }

  public get fixtureItems() {
    return this._fixtureItems
  }

  public get fixturesEvents() {
    return this._fixturesEvents
  }

  public setFixtureItems(fixtures: FixtureItem[]) {
    this._fixtureItems = fixtures.sort((itemA, itemB) =>
      compareFixtureDates(itemA, itemB)
    )
    this.liveFixtures = this._fixtureItems.filter(fixtureItem =>
      isFixtureLive(fixtureItem)
    )
    this.fixturesNearToStart = this._fixtureItems.filter(fixtureItem =>
      isFixtureNearToStart(fixtureItem)
    )
    this.fixturesFromToday = this._fixtureItems.filter(fixtureItem =>
      isFixtureFromToday(fixtureItem)
    )
  }

  public getLiveFixturesNotPosted(): FixtureItem[] {
    this.liveFixtures = this._fixtureItems.filter(
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
    this.fixturesNearToStart = this._fixtureItems.filter(
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

  public setLiveFixturesEvents(fixtureId: number, fixtureEvents: MatchEvent[]) {
    const matchEvents = fixtureEvents.sort(
      (eventA, eventB) => eventA.time.elapsed - eventB.time.elapsed
    )
    const liveFixtureEventsWithId = matchEvents.map((matchEvent, index) => {
      return { id: index, ...matchEvent }
    })
    this._fixturesEvents[fixtureId] = {
      liveFixtureEventsWithId: liveFixtureEventsWithId.filter(
        matchEvent =>
          !this.fixturesEvents[fixtureId]?.liveFixtureEventsWithIdPosted.find(
            eventPosted => eventPosted.id === matchEvent.id
          )
      ) as MatchEventWithId[],
      liveFixtureEventsWithIdPosted:
        this.fixturesEvents[fixtureId]?.liveFixtureEventsWithIdPosted || [],
    }
  }

  public getLiveFixturesEventsNotPosted(fixtureId: number): MatchEventWithId[] {
    this._fixturesEvents[fixtureId].liveFixtureEventsWithId =
      this.fixturesEvents[fixtureId]?.liveFixtureEventsWithId.filter(
        matchEvent =>
          !this.fixturesEvents[fixtureId]?.liveFixtureEventsWithIdPosted.find(
            eventPosted => eventPosted.id === matchEvent.id
          )
      )

    return this.fixturesEvents[fixtureId].liveFixtureEventsWithId
  }

  public setLiveFixturesEventsPosted(fixtureId: number) {
    this._fixturesEvents[fixtureId].liveFixtureEventsWithIdPosted = (
      this.fixturesEvents[fixtureId]?.liveFixtureEventsWithIdPosted || []
    ).concat(this.getLiveFixturesEventsNotPosted(fixtureId))
  }
}
