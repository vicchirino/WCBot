import { compareMatchDates } from "../domain/match"
import { MatchEvent, MatchEventWithId } from "../utils/types"
import { Match } from "./Match"

type MatchesEvents = {
  [key: number]: {
    liveMatchesEventsWithId: MatchEventWithId[]
    liveMatchesEventsWithIdPosted: MatchEventWithId[]
  }
}

export class TournamentStore {
  private static instance: TournamentStore

  private _matches: Match[] = []
  private liveMatches: Match[] = []
  private liveMatchesPosted: Match[] = []
  private matchesPolls: Match[] = []
  private matchesPollsPosted: Match[] = []
  private matchesNearToStart: Match[] = []
  private matchesNearToStartPosted: Match[] = []
  private _matchesEvents: MatchesEvents = {}

  matchesFromToday: Match[] = []

  public static getInstance(): TournamentStore {
    if (!TournamentStore.instance) {
      TournamentStore.instance = new TournamentStore()
    }
    return TournamentStore.instance
  }

  public get matches() {
    return this._matches
  }

  public get matchesEvents() {
    return this._matchesEvents
  }

  public setMatches(matches: Match[]) {
    this._matches = matches.sort((matchA, matchB) =>
      compareMatchDates(matchA, matchB)
    )
    this.liveMatches = this._matches.filter(match => match.isFixtureLive())
    this.matchesNearToStart = this._matches.filter(match =>
      match.isFixtureNearToStart()
    )
    this.matchesFromToday = this._matches.filter(match =>
      match.isFixtureFromToday()
    )
  }

  public getLiveMatchesNotPosted(): Match[] {
    this.liveMatches = this._matches.filter(
      match =>
        match.isFixtureLive() &&
        !this.liveMatchesPosted.find(
          matchPosted => matchPosted.fixtureId() === match.fixtureId()
        )
    )
    return this.liveMatches
  }

  public setLiveMatchesPosted() {
    this.liveMatchesPosted = this.liveMatchesPosted.concat(
      this.getLiveMatchesNotPosted()
    )
  }

  public getMatchesPollsNotPosted(): Match[] {
    this.matchesPolls = this._matches.filter(
      match =>
        match.isFixtureReadyToPostPoll() &&
        !this.matchesPollsPosted.find(
          matchPosted => matchPosted.fixtureId() === match.fixtureId()
        )
    )
    return this.matchesPolls
  }

  public setMatchesPollsPosted() {
    this.matchesPollsPosted = this.matchesPollsPosted.concat(
      this.getMatchesPollsNotPosted()
    )
  }

  public getMatchesNearToStartNotPosted(): Match[] {
    this.matchesNearToStart = this._matches.filter(
      match =>
        match.isFixtureNearToStart() &&
        !this.matchesNearToStartPosted.find(
          postedMatch => postedMatch.fixtureId() === match.fixtureId()
        )
    )
    return this.matchesNearToStart
  }

  public setMatchesNearToStartPosted() {
    this.matchesNearToStartPosted = this.matchesNearToStartPosted.concat(
      this.getMatchesNearToStartNotPosted()
    )
  }

  public setLiveMatchesEvents(matchId: number, matchEvents: MatchEvent[]) {
    const matchEventsSorted = matchEvents.sort(
      (eventA, eventB) => eventA.time.elapsed - eventB.time.elapsed
    )
    const liveMatchesEventsWithId = matchEventsSorted.map(
      (matchEvent, index) => {
        return { id: index, ...matchEvent }
      }
    )
    this._matchesEvents[matchId] = {
      liveMatchesEventsWithId: liveMatchesEventsWithId.filter(
        matchEvent =>
          !this.matchesEvents[matchId]?.liveMatchesEventsWithIdPosted.find(
            eventPosted => eventPosted.id === matchEvent.id
          )
      ) as MatchEventWithId[],
      liveMatchesEventsWithIdPosted:
        this.matchesEvents[matchId]?.liveMatchesEventsWithIdPosted || [],
    }
  }

  public getLiveMatchesEventsNotPosted(matchId: number): MatchEventWithId[] {
    this._matchesEvents[matchId].liveMatchesEventsWithId = this.matchesEvents[
      matchId
    ]?.liveMatchesEventsWithId.filter(
      matchEvent =>
        !this.matchesEvents[matchId]?.liveMatchesEventsWithIdPosted.find(
          eventPosted => eventPosted.id === matchEvent.id
        )
    )

    return this.matchesEvents[matchId].liveMatchesEventsWithId
  }

  public setLiveMatchesEventsPosted(matchId: number) {
    this._matchesEvents[matchId].liveMatchesEventsWithIdPosted = (
      this.matchesEvents[matchId]?.liveMatchesEventsWithIdPosted || []
    ).concat(this.getLiveMatchesEventsNotPosted(matchId))
  }
}
