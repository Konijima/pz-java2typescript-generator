export declare interface IClass{
    name: string
    package: string
    type: string
    scope: Scope
    describe: string[]
    extends: string[]
    implements: string[]
    constructors: IConstructor[]
    fields: IField[]
    methods: IMethod[]
}
