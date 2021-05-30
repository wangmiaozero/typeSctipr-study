"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.BimTreeTable = void 0;
/*
 * @Description: BimTreeTable
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-05-25 22:56:42
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-05-25 22:56:50
 */
var BaseTable_1 = require("./BaseTable");
/**
 * Table is known as ObjectStore in IndexedDb
 * BimTreeTable in IndexedDb
 */
var BimTreeTable = /** @class */ (function (_super) {
    __extends(BimTreeTable, _super);
    function BimTreeTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BimTreeTable.prototype.databaseName = function () {
        return BaseTable_1.BaseTable.DEFAULT_DB_NAME;
    };
    BimTreeTable.prototype.tableName = function () {
        return 'bim_tree';
    };
    BimTreeTable.instance = function () {
        if (!BimTreeTable._instance) {
            BimTreeTable._instance = new BimTreeTable();
        }
        return BimTreeTable._instance;
    };
    BimTreeTable._instance = undefined;
    return BimTreeTable;
}(BaseTable_1.BaseTable));
exports.BimTreeTable = BimTreeTable;
