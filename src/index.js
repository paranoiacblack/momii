"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var item_parser_1 = require("./item_parser");
var console_1 = require("console");
var rawCustomItemInfo = (0, fs_1.readFileSync)('../static/iteminfo.lua');
var customItems = (0, item_parser_1.parseItems)(rawCustomItemInfo.toString());
(0, console_1.log)(customItems);
