import { Scope } from "./Scope"

export interface IMethod {
    name: string
    scope: Scope
    describe: string[]
    returnType: string
    args: string[]
}