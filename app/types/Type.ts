import { nameClassWithoutPackage } from "../modules/Utilities";

export const primitivesType: {[key: string]: string} = {
    'void': 'void',
    'java.lang.Object': 'any',
    'int': 'number',
    'java.lang.Integer': 'number',
    'long': 'number',
    'java.lang.Long': 'number',
    'float': 'number',
    'java.lang.Float': 'number',
    'double': 'number',
    'short': 'number',
    'java.lang.Double': 'number',
    'java.lang.String': 'string',
    'boolean': 'boolean',
    'java.lang.Boolean': 'boolean',
    'java.time.LocalDate': 'string',
    'java.time.LocalDateTime': 'string',
    'java.time.ZonedDateTime': 'string',
    'java.util.Collection': 'Array',
    'java.util.List': 'Array',
    'java.util.ArrayList': 'Array',
    'java.util.Iterator': 'Array',
    'java.util.Set': 'Set',
    'java.util.Map': 'Map',
    'java.util.HashMap': 'Map',
    'java.util.UUID': 'string'
};

const regexpComposed = /([^<]+)<([^>]+)>/;

export function generateType(javaType: string) {
    if (primitivesType[javaType]) return primitivesType[javaType];

    return javaType;
};
