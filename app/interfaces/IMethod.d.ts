import { Scope } from "./Scope"

export interface IMethod {
    name: string
    scope: Scope
    describe: string[]
    "return": string
    args: string[]
}