import { spawn } from "child_process";
import { IClass } from "../types/IClass";
import { IConstructor } from "../types/IConstructor";
import { IField } from "../types/IField";
import { IMethod } from "../types/IMethod";
import { Scope } from "../types/Scope";
import { trimStr } from "./Utilities";

/**
 * Spawn a javap process for a file
 * @param file 
 * @returns 
 */
export function javap(file: string) {
    return new Promise((resolve, reject) => {
        let output = "";
        let error = "";

        const child = spawn("javap", ["-public", file]);

        child.stdout.on("data", (data: Buffer) => {
            output += "" + data;
        });

        child.stderr.on("data", (data: Buffer) => {
            error += "" + data;
        });

        child.on("close", (code: number) => {
            if (code !== 0) {
                return reject(Object.assign(new Error(error), {code}));
            }

            resolve(processClass(output));
        });
    })
}

/**
 * Spawn a javap process for multiple files
 * @param files 
 */
export function javapGroup(files: string[]): Promise<{[fileName: string]: IClass | undefined}> {
    return new Promise((resolve, reject) => {
        let output = "";
        let error = "";

        const child = spawn("javap", ["-public"].concat(files));

        child.stdout.on("data", (data: Buffer) => {
            output += "" + data;
        });

        child.stderr.on("data", (data: Buffer) => {
            error += "" + data;
        });

        child.on("close", (code: number) => {
            if (code !== 0) {
                return reject(Object.assign(new Error(error), {code}));
            }

            resolve(processClasses(files, output));
        });
    })
}

/**
 * Process multiple java class
 * @param input 
 */
export function processClasses(files: string[], input: string) {
    const lines = input.split("\n");
    const fileLines: string[][] = [];
    lines.forEach(line => line.startsWith("Compiled from") ? fileLines.push([]) : fileLines[fileLines.length - 1].push(line));

    const result: {[fileName: string]: IClass | undefined} = {};
    for (const index in fileLines) {
        const fileText = fileLines[index].join("\n");
        const clazz = processClass(fileText);
        result[files[index]] = clazz;
    }

    return result;
}

/**
 * Process a java class
 * @param input 
 * @returns 
 */
export function processClass(input: string) {
    const splitRegex = new RegExp(`\,(?![^<]*>)`, "gm"); // https://regex101.com/r/B2QdmR/1
    const typeRegex = `[a-zA-Z0-9\\.<>\\?\\$\\[, ]+`; // https://regex101.com/r/E2acae/1
    const classRegex = new RegExp(`(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(class|interface) (${typeRegex}) ?{([^}]+)}`, "gm");
    const methodRegex = new RegExp(`(?:(public|private|protected) )?((?:static|abstract|final) ?)*(?:(${typeRegex}) )?([a-zA-Z]+)\\(([^\\)]*)\\)`);
    const fieldRegex = new RegExp(`(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(${typeRegex}) ([a-zA-Z0-9_]+)`);
    
    let out = classRegex.exec(input);

    if (!out) return;

    const scope = out[1] || "package";
    const describe = out[2];
    const type = out[3];

    const classSplit = out[4].split(" ")[0].split(".");
    const className = classSplit[classSplit.length - 1];

    const packageSplit = out[4].split(" ")[0].split(".");
    const packageName = packageSplit.slice(0, packageSplit.length - 1).join(".");

    const exts = (out[4].includes("extends")) ? out[4].split("extends")[1].split("implements")[0] : null;
    const impls = (out[4].includes("implements")) ? out[4].split("implements")[1] : null;
    const classBody = out[5].split("\n").filter(Boolean).map(trimStr);

    let clazz: IClass = {
        package: packageName,
        name: className,
        scope: scope as Scope,
        type: type,
        describe: (describe) ? describe.trim().split(" ") : [],
        extends: exts ? exts.split(splitRegex).map(trimStr) : [],
        implements: impls ? impls.split(splitRegex).map(trimStr) : [],
        constructors: [],
        fields: [],
        methods: []
    };

    classBody.forEach(member => {
        if(member.includes("<")) {
            member = member.replace(/<(.*)>/, (match) => match.split(", ").join(","));
        }
        let signature = methodRegex.exec(member);
        if (!signature)  {
            signature = fieldRegex.exec(member);
            if (signature) {
                const scope = (signature[1] || "package") as Scope;
                const describe = (signature[2] || "").trim();
                const type = signature[3];
                const name = signature[4];
                const field: IField = {
                    name,
                    scope,
                    type,
                    describe: (describe) ? describe.trim().split(" ") : []
                };
                clazz.fields.push(field);
            }
            return;
        }

        const scope = (signature[1] || "package") as Scope;
        const describe = (signature[2] || "").trim();
        const retVal = signature[3];
        const name = signature[4];
        const args = signature[5];
        if (retVal == undefined) { // no ret, constructor
            const constructor: IConstructor = {
                name: name,
                scope: scope,
                describe: (describe) ? describe.trim().split(" ") : [],
                args: args ? args.split(",").map(trimStr) : []
            };
            clazz.constructors.push(constructor);
        } else {
            const method: IMethod = {
                name,
                scope,
                describe: (describe) ? describe.trim().split(" ") : [],
                "return": retVal,
                args: args ? args.split(",").map(trimStr) : []
            };
            clazz.methods.push(method);
        }
    });

    return clazz;
}
