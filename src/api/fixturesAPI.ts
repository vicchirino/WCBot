import { FixtureResponse } from "../utils/types"
import { getRequest } from "./utils"

export async function getFixtures(
  parameters: any
): Promise<FixtureResponse["response"]> {
  const result = await getRequest<FixtureResponse>("fixtures", parameters)
  return result.response
}
