describe("fixtureAPI", () => {
  it.skip("", () => {})
})
// describe("Fixtures API functions", () => {
//   describe("getLiveFixture", () => {
//     beforeEach(() => {
//       getFixturesMocked.mockReturnValue(
//         Promise.resolve(liveFixturesMock.response as FixtureItem[])
//       )
//     })
//     it("return the live fixture when the correct fixture id and league are passed", async () => {
//       const fixtureId = liveFixturesMock.response[0].fixture.id
//       const leagueId = liveFixturesMock.response[0].league.id
//       const liveFixture = await getLiveFixture(fixtureId, leagueId)
//       expect(liveFixture).toBeDefined()
//       expect(liveFixture?.fixture.id).toEqual(fixtureId)
//     })
//     it("return nothing when an incorrect fixture id is passed", async () => {
//       const fixtureId = 923849234
//       const leagueId = liveFixturesMock.response[0].league.id
//       const liveFixture = await getLiveFixture(fixtureId, leagueId)
//       expect(liveFixture).toBeUndefined()
//     })
//   })

//   describe("getLiveFixtures", () => {
//     const leagueId = 1
//     beforeEach(() => {
//       getFixturesMocked.mockReturnValue(
//         Promise.resolve(liveFixturesMock.response as FixtureItem[])
//       )
//     })
//     afterEach(() => {
//       getFixturesMocked.mockClear()
//     })
//     it("returns the list of live fixtures correctly", async () => {
//       const liveFixtures = await getLiveFixtures(leagueId)
//       expect(liveFixtures).toHaveLength(liveFixturesMock.response.length)
//       expect(liveFixtures[0].fixture.id).toEqual(
//         liveFixturesMock.response[0].fixture.id
//       )
//     })
//     it("call getFixtures API", async () => {
//       const _ = await getLiveFixtures(leagueId)
//       expect(getFixturesMocked).toHaveBeenCalled()
//       expect(getFixturesMocked).toHaveBeenCalledTimes(1)
//       expect(getFixturesMocked).toHaveBeenCalledWith({
//         league: leagueId,
//         live: "all",
//       })
//     })
//   })

//   describe("getFixturesFromLeague", () => {
//     const leagueId = 1
//     const season = "2022"
//     beforeEach(() => {
//       getFixturesMocked.mockReturnValue(
//         Promise.resolve(worldCupFixturesMock.response as FixtureItem[])
//       )
//     })
//     afterEach(() => {
//       getFixturesMocked.mockClear()
//     })
//     it("return list of league fixtures correctly", async () => {
//       const leagueFixtures = await getFixturesFromLeague(leagueId, season)
//       expect(leagueFixtures).toHaveLength(
//         worldCupFixturesMock.response.length
//       )
//       expect(leagueFixtures[0].fixture.id).toEqual(
//         worldCupFixturesMock.response[0].fixture.id
//       )
//     })
//     it("call getFixtures API", async () => {
//       const _ = await getFixturesFromLeague(leagueId, season)
//       expect(getFixturesMocked).toHaveBeenCalled()
//       expect(getFixturesMocked).toHaveBeenCalledTimes(1)
//       expect(getFixturesMocked).toHaveBeenCalledWith({
//         league: leagueId,
//         season: season,
//       })
//     })
//   })
// })
