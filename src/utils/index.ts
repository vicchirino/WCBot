export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// Network calls counter

export class NetworkCounter {
  private static instance: NetworkCounter

  numberOfCalls: number

  private constructor() {
    this.numberOfCalls = 0
  }

  public static getInstance(): NetworkCounter {
    if (!NetworkCounter.instance) {
      NetworkCounter.instance = new NetworkCounter()
    }
    return NetworkCounter.instance
  }

  public addCall() {
    this.numberOfCalls++
    console.log("### Number of calls: ", this.numberOfCalls)
  }
}
