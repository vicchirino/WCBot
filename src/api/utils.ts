import axios from "axios"
import { NetworkCounter } from "../utils"
import dotenv from "dotenv"
dotenv.config()

const API_FOOTBALL_URL = process.env.API_FOOTBALL_URL
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY

const instance = axios.create({
  baseURL: "API_FOOTBALL_URL",
  headers: { "x-apisports-key": API_FOOTBALL_KEY },
})

export function getRequest<T>(endpoint: string, parameters: any): Promise<T> {
  NetworkCounter.getInstance().addCall()
  return instance
    .get(`${API_FOOTBALL_URL}${endpoint}`, { params: parameters })
    .then(res => {
      if (res.status !== 200) {
        // throw new Error(res.statusText)
        console.error(res.statusText)
        return Promise.reject([])
      }
      return res.data as Promise<T>
    })
    .catch(err => {
      console.error(err)
      return Promise.reject([])
    })
}

export function postRequest<T>(endpoint: string, parameters: any): Promise<T> {
  NetworkCounter.getInstance().addCall()
  return instance
    .post(`${API_FOOTBALL_URL}${endpoint}`, null, { params: parameters })
    .then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText)
      }
      return res.data as Promise<T>
    })
    .catch(err => {
      console.log("Error posting request", err)
      throw new Error(err)
    })
}
