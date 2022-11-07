import { FixtureItem, MatchEvent } from "../utils/types"

export function getTweetTextForFixtureEvent(
  fixtureItem: FixtureItem,
  event: MatchEvent
): string {
  if (event.type === "Goal") {
    if (event.detail === "Penalty") {
      return `➡️  Penalty scored!!\n\n⚽ ${event.player.name} - ${event.team.name}\n\n⏰ ${event.time.elapsed}min ${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}`
    }
    if (event.detail === "Own Goal") {
      return `➡️  Own Goal\n\n⚽${event.player.name} - ${event.team.name}\n\n⏰ ${event.time.elapsed}min ${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}`
    }
    if (event.detail === "Normal Goal") {
      return `➡️  Goal\n\n⚽ ${event.player.name} - ${event.team.name}\n${
        event.assist.name ? `👥 ${event.assist.name}` : ""
      }\n${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${
        fixtureItem.goals.away
      } ${fixtureItem.teams.away.name}\n⏰ ${event.time.elapsed}min`
    }
    if (event.detail === "Missed Penalty") {
      return `➡️ Missed Penalty\n❌${event.player.name}\n\n⏰ ${event.time.elapsed}min ${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}`
    }
  }
  if (event.type === "Card") {
    if (event.detail === "Yellow Card") {
      return `${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}\n🟡 ${event.player.name} - ${event.team.name} \n⏰ ${event.time.elapsed}min`
    }
    if (event.detail === "Second Yellow card") {
      return `${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}\n🟡🟡 ${event.player.name} - ${event.team.name} \n⏰ ${event.time.elapsed}min`
    }
    if (event.detail === "Red Card") {
      return `${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}\n🔴 ${event.player.name} - ${event.team.name} \n⏰ ${event.time.elapsed}min`
    }
  }
  return ""
}
