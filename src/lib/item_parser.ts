import { AssignmentStatement, Expression, NumericLiteral, TableConstructorExpression, TableKey, TableKeyString, TableValue, parse } from 'luaparse';
import { log } from 'console';

export interface Item {
    id: number
    name: string
    description: string
    slots: number
}

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
            slots: Number(extractStr(fields[6])) || 0
        }
        items.push(item)
        
    }
    log(info)
    return items
}

function extractStr(field: TableKey|TableKeyString|TableValue|Expression): string {
    switch(field.type) {
        case "NumericLiteral":
        case "StringLiteral":
            return field.raw

        case "TableKey":
        case "TableKeyString":
        case "TableValue":
            return extractStr(field.value)

        case "TableConstructorExpression":
            let blocks: string[] = []
            for (let entry of field.fields) {
                blocks.push(extractStr(entry))
            }
            return blocks.join("<br>")

        default:
            return ''
    }
}