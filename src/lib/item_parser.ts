import { 
    AssignmentStatement,
    Expression,
    NumericLiteral, 
    TableConstructorExpression,
    TableKey,
    TableKeyString,
    TableValue,
    parse
} from 'luaparse';

export interface Item {
    id: number
    name: string
    description: string
    type: string
    subType: string
    weight: string
}

export var itemTypes: Set<string> = new Set()

const classRe = /Class: (.*)\n/
const compoundRe = /Compound on: (\w+)/
const atkRe = /Attack: (\w+)/
const armorRe = /Armor Type: (\w+)/
const weightRe = /Weight: (.*)/
const positionRe = /Position: (\w+)/

export function parseItems(itemInfo: string): Item[] {
    const info = parse(itemInfo)

    let items: Item[] = []
    let table: TableConstructorExpression = (info.body[0] as AssignmentStatement).init[0] as TableConstructorExpression
    for (let entry of table.fields) {

        let key = (entry as TableKey).key as NumericLiteral
        let fields = ((entry as TableKey).value as TableConstructorExpression).fields
        let item: Item = {
            id: key.value,
            name: extractStr(fields[3]),
            description: extractStr(fields[5]),
            type: '',
            subType: '',
            weight: ''
        }

        if (item.description === "ITEM DUMMIED OUT"
            || item.description === "..."
            || item.description === ",.."
            || item.name.includes("unused")
            || item.name.includes("unsused")) {
            continue
        }

        let weightMatch = weightRe.exec(item.description)
        if (weightMatch) {
            item.weight = weightMatch[1]
        }

        let compoundMatch = compoundRe.exec(item.description)
        let classMatch = classRe.exec(item.description)
        if (compoundMatch) {
            item.type = "Card"
            item.subType = compoundMatch[1]
        } else if (classMatch) {
            let armorMatch = armorRe.exec(item.description)
            if (atkRe.exec(item.description)) {
                item.type = "Weapon"
                item.subType = classMatch[1]
            } else if (armorMatch) {
                item.type = classMatch[1]
                item.subType = armorMatch[1]
            } else {
                item.type = classMatch[1]
            }

            let positionMatch = positionRe.exec(item.description)
            if (positionMatch) {
                item.type += "(" + positionMatch[0] + ")"
            }
        } else {
            item.type = "Etc"
        }
        itemTypes.add(item.type)

        let slots: string = extractStr(fields[6])
        if (slots !== "0") {
            item.name = item.name.concat(' [' + slots + ']')
        }

        items.push(item)

    }
    return items
}

function extractStr(field: TableKey | TableKeyString | TableValue | Expression): string {
    switch (field.type) {
        case "NumericLiteral":
        case "StringLiteral":
            return field.raw
                .replace(/"/g, '') // Replace quotes
                .replace(/\^FFFFFF/g, '\n') // Replace LUA newline with regular newline
                .replace(/\^\w{6}/g, '') // Replace LUA meta tags

        case "TableKey":
        case "TableKeyString":
        case "TableValue":
            return extractStr(field.value)

        case "TableConstructorExpression":
            let blocks: string[] = []
            for (let entry of field.fields) {
                blocks.push(extractStr(entry))
            }
            return blocks.join('\n')

        default:
            return ''
    }
}

export function itemType(item: Item): string {
    let type: string = item.type;
    if (item.subType) {
        type += " - " + item.subType;
    }
    return type;
}