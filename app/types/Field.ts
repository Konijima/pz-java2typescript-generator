import { IField } from "../interfaces/IField";
import { generateType } from "./Type";

export function generateField(field: IField): string {
    const _static = field.describe.includes("static");

    let result: string[] = [];

    let fieldLine = "            ";
    fieldLine += (field.scope) ? `${field.scope} ` : '';
    fieldLine += (_static) ? `static ` : '';
    fieldLine += 'readonly ';
    fieldLine += field.name;
    fieldLine += `: ${generateType(field.type)};`;

    result.push(fieldLine);

    return result.join('\n');
};
