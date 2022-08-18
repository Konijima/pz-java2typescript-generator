[![Compile](https://github.com/Konijima/pz-java-analyser/actions/workflows/Compile.yml/badge.svg)](https://github.com/Konijima/pz-java-analyser/actions/workflows/Compile.yml)

# Requirements

- NodeJS

- Java 17 SDK must be added to the path. (*Require `javap` command to be available*)

<br>

# Sources

Drag n Drop the directories containing `.class` files into the `src` directory.

- astar
- com
- de
- fmod
- javax
- N3D
- org
- se
- zombie

<br>

# Run

## Generate JSON task
Generate json files.
```
npm run generate-json
```

## Generate TS task
Generate ts files.
```
npm run generate-ts
```

## Generate ALL task
Generate both json and ts files.
```
npm run generate-all
```

<br>
