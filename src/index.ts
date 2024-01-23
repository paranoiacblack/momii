import text from 'bundle-text:../static/iteminfo.lua';
import {Item, parseItems} from './lib/item_parser';
import { log } from 'console';

const customItems: Item[] = parseItems(text)
log(customItems)