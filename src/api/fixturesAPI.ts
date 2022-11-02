import { FixtureResponse, EventResponse } from "../utils/types"
import { getRequest } from "./utils"

export async function getFixtures(
  parameters: any
): Promise<FixtureResponse["response"]> {
  const result = await getRequest<FixtureResponse>("fixtures", parameters)
  return result.response
}

export async function getEvents(parameters: {
  fixture: number
}): Promise<EventResponse["response"]> {
  const result = await getRequest<EventResponse>("fixtures/events", parameters)
  return result.response
}
