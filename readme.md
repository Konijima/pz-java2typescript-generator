[![Compile](https://github.com/Konijima/pz-java2typescript-generator/actions/workflows/Compile.yml/badge.svg)](https://github.com/Konijima/pz-java2typescript-generator/actions/workflows/Compile.yml)

# Requirements

- NodeJS

- Java 17 SDK must be added to the path.  
(*Require `javap` command to be available in your terminal*)

<br>

# Command Arguments

## `-src` argument
Set the path to the game root directory where the generator will get the `.class` files.
```
node dist/index.js -json -src "C:/Program Files (x86)/Steam/steamapps/common/ProjectZomboid"
```

## `-size` argument
Amount of source files to compile simultaneously.
```
node dist/index.js -json -size 200
```
> *Bigger number is faster but there is a limit due to NodeJS subprocess character limit of the command executed.*

## `-out` argument
Set the path where the generated typescript will be saved.
```
node dist/index.js -ts -out C:/GeneratedTS
```

<br>

# Run

## Compile Generator
```
npm run compile
```

## Generate JSON
Generate json files needed to generate the typescript files.
```
npm run json
```

## Generate TS
Generate the typescript files.
```
npm run ts
```

## Generate ALL
Generate both json and ts files in one command.
```
npm run all
```

<br>
