[![Compile](https://github.com/Konijima/pz-java-analyser/actions/workflows/Compile.yml/badge.svg)](https://github.com/Konijima/pz-java-analyser/actions/workflows/Compile.yml)

# Requirements

- NodeJS

- Java 17 SDK must be added to the path. (*Require `javap` command to be available*)

<br>

# Command Arguments

## `-src` argument
Set the path to the game root directory where the generator will get the `.class` files from.
```
node dist/index.js -json -src "C:/Program Files (x86)/Steam/steamapps/common/ProjectZomboid"
```

## `-size` argument
Amount of source file to compile at simultaneously.  
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
Compile the generator.
```
npm run compile
```

## Generate JSON
Generate json files.
```
npm run json
```

## Generate TS
Generate ts files.
```
npm run ts
```

## Generate ALL
Generate both json and ts files.
```
npm run all
```

<br>
