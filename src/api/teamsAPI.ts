import { TeamsResponse } from "../utils/types"
import { getRequest } from "./utils"

export async function getTeams(leagueID: number, season = "2022") {
  const result = await getRequest<TeamsResponse>("teams", {
    league: leagueID,
    season,
  })
  return result.response
}
