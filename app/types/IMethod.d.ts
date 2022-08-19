import { Scope } from "./Scope"

export declare interface IMethod {
    name: string
    scope: Scope
    describe: string[]
    "return": string
    args: string[]
}