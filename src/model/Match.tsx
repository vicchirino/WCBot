import { FixtureItem, MatchEvent, Team } from "../utils/types"
import { teamNameWithFlag } from "./utils"

export class Match {
  fixtureItem: FixtureItem

  constructor(fixtureItem: FixtureItem) {
    this.fixtureItem = fixtureItem
  }

  teams(): { home: Team; away: Team } {
    return this.fixtureItem.teams
  }

  homeTeamName(rtl = true): string {
    return teamNameWithFlag(this.teams().home.name, rtl)
  }

  awayTeamName(rtl = true): string {
    return teamNameWithFlag(this.teams().away.name, rtl)
  }

  goals(): { home: number | null; away: number | null } {
    return this.fixtureItem.goals
  }

  getVenue(): string {
    return `${this.fixtureItem.fixture?.venue.name}, ${this.fixtureItem.fixture?.venue.city}`
  }

  fixtureDate(): Date {
    return new Date(this.fixtureItem.fixture.date)
  }

  fixtureId(): number {
    return this.fixtureItem.fixture.id
  }

  leagueId(): number {
    return this.fixtureItem.league.id
  }

  matchEvents(): MatchEvent[] {
    return this.fixtureItem.events || []
  }

  private getFixtureStatus(): string {
    return this.fixtureItem.fixture.status?.short || "TBD"
  }

  isFixtureLive(): boolean {
    const status = this.getFixtureStatus()
    return (
      status === "LIVE" ||
      status === "1H" ||
      status === "2H" ||
      status === "HT" ||
      status === "ET" ||
      status === "P" ||
      this.isFixtureHappeningNow()
    )
  }

  isFixtureFinished(): boolean {
    const status = this.getFixtureStatus()
    return status === "FT" || status === "AET" || status === "PEN"
  }

  isFixtureHappeningNow(): boolean {
    const now = new Date()
    const nintyMinutes = 90 * 60 * 1000
    const twoMinutes = 2 * 60 * 1000
    const fixtureDate = this.fixtureDate()
    const fixtureEstimatedEndDate = new Date(
      fixtureDate.getTime() + nintyMinutes
    )
    const fixtureStartDateWithMargin = new Date(
      fixtureDate.getTime() + twoMinutes
    )
    return now > fixtureStartDateWithMargin && now < fixtureEstimatedEndDate
  }

  isFixtureNearToStart(): boolean {
    // 20 minutes before the match
    const minutes = 20
    const fixtureDate = this.fixtureDate()
    const now = new Date()
    if (fixtureDate < now) {
      return false
    }
    const nowWithMinutes = new Date(now.getTime() + minutes * 60 * 1000)
    return nowWithMinutes > fixtureDate
  }

  isFixtureReadyToPostPoll(): boolean {
    // 60 minutes before the match
    const minutes = 60
    const fixtureDate = this.fixtureDate()
    const now = new Date()
    if (fixtureDate < now) {
      return false
    }
    const nowWithMinutes = new Date(now.getTime() + minutes * 60 * 1000)
    return nowWithMinutes > fixtureDate
  }

  isFixtureInTheFuture(): boolean {
    return this.fixtureDate() > new Date()
  }

  isFixtureInThePast(): boolean {
    return this.fixtureDate() < new Date()
  }

  isFixtureFromToday(): boolean {
    const today = new Date()
    const fixtureDate = this.fixtureDate()
    return (
      today.getFullYear() === fixtureDate.getFullYear() &&
      today.getMonth() === fixtureDate.getMonth() &&
      today.getDate() === fixtureDate.getDate()
    )
  }

  getTextForEvent(matchEvent: MatchEvent): string {
    if (matchEvent.type === "Goal") {
      if (matchEvent.detail === "Penalty") {
        return `➡️  Penalty scored!!\n\n⚽ ${
          matchEvent.player.name
        } - ${teamNameWithFlag(matchEvent.team.name)}\n\n⏰ ${
          matchEvent.time.elapsed
        }' ${this.homeTeamName()} ${this.goals().home} - ${
          this.goals().away
        } ${this.awayTeamName(false)}`
      }
      if (matchEvent.detail === "Own Goal") {
        return `➡️  Own Goal\n\n⚽ ${
          matchEvent.player.name
        } - ${teamNameWithFlag(matchEvent.team.name)}\n\n⏰ ${
          matchEvent.time.elapsed
        }' ${this.homeTeamName()} ${this.goals().home} - ${
          this.goals().away
        } ${this.awayTeamName(false)}`
      }
      if (matchEvent.detail === "Normal Goal") {
        return `➡️  Goal!!\n\n⚽ ${matchEvent.player.name} - ${teamNameWithFlag(
          matchEvent.team.name
        )}${
          matchEvent.assist.name ? `\n👥 ${matchEvent.assist.name}` : ""
        }\n\n⏰ ${matchEvent.time.elapsed}' ${this.homeTeamName()} ${
          this.goals().home
        } - ${this.goals().away} ${this.awayTeamName(false)}`
      }
      if (matchEvent.detail === "Missed Penalty") {
        return `➡️ Missed Penalty\n❌ ${
          matchEvent.player.name
        } - ${teamNameWithFlag(matchEvent.team.name)}\n\n⏰ ${
          matchEvent.time.elapsed
        }' ${this.homeTeamName()} ${this.goals().home} - ${
          this.goals().away
        } ${this.awayTeamName(false)}`
      }
    }
    if (matchEvent.type === "Card") {
      if (matchEvent.detail === "Yellow Card") {
        return `🟡 Yellow card\n\n👤 ${
          matchEvent.player.name
        } - ${teamNameWithFlag(matchEvent.team.name)}\n\n⏰ ${
          matchEvent.time.elapsed
        }' ${this.homeTeamName()} ${this.goals().home} - ${
          this.goals().away
        } ${this.awayTeamName(false)}`
      }
      if (matchEvent.detail === "Second Yellow card") {
        return `🟡🟡 Second yellow card\n\n👤 ${
          matchEvent.player.name
        } - ${teamNameWithFlag(matchEvent.team.name)}\n\n⏰ ${
          matchEvent.time.elapsed
        }' ${this.homeTeamName()} ${this.goals().home} - ${
          this.goals().away
        } ${this.awayTeamName(false)}`
      }
      if (matchEvent.detail === "Red Card") {
        return `🔴 Red card\n\n👤 ${
          matchEvent.player.name
        } - ${teamNameWithFlag(matchEvent.team.name)}\n\n⏰ ${
          matchEvent.time.elapsed
        }' ${this.homeTeamName()} ${this.goals().home} - ${
          this.goals().away
        } ${this.awayTeamName(false)}`
      }
    }
    if (matchEvent.type === "Var") {
      if (matchEvent.detail === "Goal cancelled") {
        return `🔎 Var - Goal cancelled!\n\n${
          matchEvent.player.name
        } - ${teamNameWithFlag(matchEvent.team.name)}\n\n⏰ ${
          matchEvent.time.elapsed
        }' ${this.homeTeamName()} ${this.goals().home} - ${
          this.goals().away
        } ${this.awayTeamName(false)}`
      }
      if (matchEvent.detail === "Penalty confirmed") {
        return `🔎 Var - Penalty confirmed for ${teamNameWithFlag(
          matchEvent.team.name
        )}\n\n⏰ ${matchEvent.time.elapsed}' ${this.homeTeamName()} ${
          this.goals().home
        } - ${this.goals().away} ${this.awayTeamName(false)}`
      }
    }
    if (matchEvent.type === "subst") {
      return `🔄 Substituion - ${teamNameWithFlag(
        matchEvent.team.name
      )}\n\n➡️ ${matchEvent.player.name}\n⬅️ ${matchEvent.assist.name}\n\n⏰ ${
        matchEvent.time.elapsed
      }' ${this.homeTeamName()} ${this.goals().home} - ${
        this.goals().away
      } ${this.awayTeamName(false)}`
    }
    return ""
  }

  getTextForReadyToStart(): string {
    return `🔔 ${this.teams().home.name} vs ${
      this.teams().away.name
    } is about to start!\n\n⏰ ${this.fixtureDate().toLocaleTimeString()}\n\n🏟 ${this.getVenue()}`
  }

  getTextForFinished(): string {
    return `⏰ End of match\n\n${this.homeTeamName()} ${this.goals().home} - ${
      this.goals().away
    } ${this.awayTeamName(false)}`
  }

  getTextForStarted(): string {
    return `⏰ Kick off: ${this.homeTeamName()} - ${this.awayTeamName(
      false
    )}\n\n🏟 ${this.getVenue()}`
  }

  getTextForPolls(): string {
    return `${this.teams().home.name} vs ${
      this.teams().away.name
    }\n\n⏰ ${this.fixtureDate().toLocaleTimeString()}\n\nWho's going to win?\n\n#FIFAWorldCup #Qatar2022 🏆⚽️`
  }
}
