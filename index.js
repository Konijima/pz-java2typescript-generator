const fs = require("fs")
const path = require("path")
const spawn = require('child_process').spawn

const srcPath = path.join(__dirname, "src")
const outPath = path.join(__dirname, "out")

function getAllSrcFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, "/", file)
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllSrcFiles(fullPath, arrayOfFiles)
        } else if (fullPath.endsWith('.class')) {
            arrayOfFiles.push(fullPath)
        }
    })

    return arrayOfFiles
}

function trimStr(str) {
    return str.trim();
}

function processClass(input) {
    const splitRegex = new RegExp(`\,(?![^<]*>)`, 'gm') // https://regex101.com/r/B2QdmR/1
    const typeRegex = `[a-zA-Z0-9\\.<>\\?\\$\\[, ]+`; // https://regex101.com/r/E2acae/1
    const classRegex = new RegExp(`(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(class|interface) (${typeRegex}) ?{([^}]+)}`, 'gm');
    const methodRegex = new RegExp(`(?:(public|private|protected) )?((?:static|abstract|final) ?)*(?:(${typeRegex}) )?([a-zA-Z]+)\\(([^\\)]*)\\)`);
    const fieldRegex = new RegExp(`(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(${typeRegex}) ([a-zA-Z0-9_]+)`);
    
    let out = classRegex.exec(input)

    // console.log(out)

    if (!out) return

    const scope = out[1] || 'package'
    const describe = out[2]
    const type = out[3]

    const classSplit = out[4].split(" ")[0].split('.')
    const className = classSplit[classSplit.length - 1]

    const packageSplit = out[4].split(" ")[0].split('.')
    const packageName = packageSplit.slice(0, packageSplit.length - 1).join('.')

    const exts = (out[4].includes('extends')) ? out[4].split("extends")[1].split("implements")[0] : null
    const impls = (out[4].includes('implements')) ? out[4].split("implements")[1] : null
    const classBody = out[5].split('\n').filter(Boolean).map(trimStr)

    let clazz = {
        name: className,
        package: packageName,
        type: type,
        scope: scope,
        describe: (describe) ? describe.trim().split(" ") : [],
        extends: exts ? exts.split(splitRegex).map(trimStr) : [],
        implements: impls ? impls.split(splitRegex).map(trimStr) : [],
        constructors: [],
        fields: [],
        methods: []
    }

    classBody.forEach(member => {
        if(member.includes('<')) {
            member = member.replace(/<(.*)>/, (match) => match.split(', ').join(','));
        }
        let signature = methodRegex.exec(member);
        if (!signature)  {
            signature = fieldRegex.exec(member);
            if (signature) {
                const scope = signature[1] || 'package';
                const describe = (signature[2] || '').trim();
                const type = signature[3];
                const name = signature[4];
                clazz.fields.push({
                    name: name,
                    scope: scope,
                    type: type,
                    describe: (describe) ? describe.trim().split(" ") : []
                });
            }

            return;
        }

        const scope = signature[1] || 'package';
        const describe = (signature[2] || '').trim();
        const retVal = signature[3];
        const name = signature[4];
        const args = signature[5];
        if (retVal == undefined) { // no ret, constructor
            const cons = {
                scope: scope,
                name: name,
                describe: (describe) ? describe.trim().split(" ") : [],
                args: args ? args.split(',').map(trimStr) : []
            };

            clazz.constructors.push(cons);
        } else {
            const m = {
                scope: scope,
                describe: (describe) ? describe.trim().split(" ") : [],
                'return': retVal,
                name: name,
                args: args ? args.split(',').map(trimStr) : []
            };

            clazz.methods.push(m);
        }
    })

    return clazz
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        let output = ''
        let error = ''

        const child = spawn('javap', ['-public', file])

        child.stdout.on('data', data => {
            output += '' + data
        })

        child.stderr.on('data', data => {
            error += '' + data
        })

        child.on('close', code => {
            if (code !== 0) {
                return reject(Object.assign(new Error(error), {code}))
            }

            resolve(processClass(output))
        })
    })
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}

(async () => {
    console.log("Java Generator initializing...")

    let startTime = Date.now()
    let processCount = 0
    let completed = 0
    let lastPrint = ""

    const files = getAllSrcFiles(srcPath)

    if (fs.existsSync(outPath)) {
        console.log(`Deleting ${outPath} ...`)
        fs.rmSync(outPath, { force: true, recursive: true })
    }
    fs.mkdirSync(outPath, { recursive: true })

    for (const file of files) {
        const savePath = path.join(outPath, file.replace(srcPath + '\\', '').replace('.class', '.json').replaceAll('\\', '.'))
        processCount++
        readFile(file)
        .then(data => {
            if (data) {
                fs.mkdir(path.dirname(savePath), { recursive: true }, () => fs.writeFile(savePath, JSON.stringify(data, null, 2), { encoding: "utf-8" }, () => {}))
            }
            completed++
            processCount--
        })
        .catch(error => {
            completed++
            processCount--
            console.error(error)
        })
        
        // Wait
        let wait = processCount > 10
        while (wait) {
            await sleep(100)
            wait = processCount > 0
        }

        // Progress Print
        const newPrint = `Progress: ${Math.round(completed / files.length * 100)}%`
        if (lastPrint !== newPrint) {
            lastPrint = newPrint
            console.log(newPrint, `(${completed}/${files.length})`)
        }
    }

    console.log(`Completed in ${(Date.now() - startTime) / 1000} seconds!`)

})()
