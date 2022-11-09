import { FixtureItem, MatchEvent, Team } from "../utils/types"

export class Match {
  fixtureItem: FixtureItem

  constructor(fixtureItem: FixtureItem) {
    this.fixtureItem = fixtureItem
  }

  teams(): { home: Team; away: Team } {
    return this.fixtureItem.teams
  }

  goals(): { home: number | null; away: number | null } {
    return this.fixtureItem.goals
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

  isFixtureHappeningNow(): boolean {
    const now = new Date()
    const minutes = 90 * 60 * 1000
    const fixtureDate = this.fixtureDate()
    const fixtureEstimatedEndDate = new Date(fixtureDate.getTime() + minutes)
    return now > fixtureDate && now < fixtureEstimatedEndDate
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

  getTweetTextForEvent(event: MatchEvent): string {
    if (event.type === "Goal") {
      if (event.detail === "Penalty") {
        return `➡️  Penalty scored!!\n\n⚽ ${event.player.name} - ${
          event.team.name
        }\n\n⏰ ${event.time.elapsed}min ${this.teams().home.name} ${
          this.goals().home
        } - ${this.goals().away} ${this.teams().away.name}`
      }
      if (event.detail === "Own Goal") {
        return `➡️  Own Goal\n\n⚽${event.player.name} - ${
          event.team.name
        }\n\n⏰ ${event.time.elapsed}min ${this.teams().home.name} ${
          this.goals().home
        } - ${this.goals().away} ${this.teams().away.name}`
      }
      if (event.detail === "Normal Goal") {
        return `➡️  Goal\n\n⚽ ${event.player.name} - ${event.team.name}\n${
          event.assist.name ? `👥 ${event.assist.name}` : ""
        }\n${this.teams().home.name} ${this.goals().home} - ${
          this.goals().away
        } ${this.teams().away.name}\n⏰ ${event.time.elapsed}min`
      }
      if (event.detail === "Missed Penalty") {
        return `➡️ Missed Penalty\n❌${event.player.name}\n\n⏰ ${
          event.time.elapsed
        }min ${this.teams().home.name} ${this.goals().home} - ${
          this.goals().away
        } ${this.teams().away.name}`
      }
    }
    if (event.type === "Card") {
      if (event.detail === "Yellow Card") {
        return `${this.teams().home.name} ${this.goals().home} - ${
          this.goals().away
        } ${this.teams().away.name}\n🟡 ${event.player.name} - ${
          event.team.name
        } \n⏰ ${event.time.elapsed}min`
      }
      if (event.detail === "Second Yellow card") {
        return `${this.teams().home.name} ${this.goals().home} - ${
          this.goals().away
        } ${this.teams().away.name}\n🟡🟡 ${event.player.name} - ${
          event.team.name
        } \n⏰ ${event.time.elapsed}min`
      }
      if (event.detail === "Red Card") {
        return `${this.teams().home.name} ${this.goals().home} - ${
          this.goals().away
        } ${this.teams().away.name}\n🔴 ${event.player.name} - ${
          event.team.name
        } \n⏰ ${event.time.elapsed}min`
      }
    }
    return ""
  }
}
