"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.BaseTable = void 0;
/*
 * @Description: BaseTable
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-05-25 22:54:54
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-05-25 22:55:08
 */
/**
 * Table is known as ObjectStore in IndexedDb
 */
var BaseTable = /** @class */ (function () {
    function BaseTable() {
        this.db = undefined;
        this.isCreatingTable = false;
    }
    /**
     * Derived class have to override this method and return a database name!
     */
    BaseTable.prototype.databaseName = function () {
        throw new Error('Derived class have to override \'databaseName\', and set a proper database name!');
    };
    /**
     * Derived class have to override this method and return a table name!
     */
    BaseTable.prototype.tableName = function () {
        throw new Error('Derived class have to override \'tableName\', and set a proper table name!');
    };
    /**
     * Make sure to open database, and the table is already created before add/put/delete, etc.
     */
    BaseTable.prototype.checkAndOpenDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timeLeft;
            var _this = this;
            return __generator(this, function (_a) {
                timeLeft = 2000;
                while (this.isCreatingTable && timeLeft > 0) {
                    // need to wait until db is opened! because we are not sure if onsuccess is runned already! WTF!
                    console.log('Database is openning, need to wait...');
                    this.sleep(1000);
                    timeLeft -= 1000;
                }
                if (!this.db) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.openDatabase(_this.databaseName(), 2, function () {
                                if (_this.db && !_this.isCreatingTable) {
                                    resolve(_this.db);
                                }
                                console.log("successCallback called, this.db: " + !!_this.db + ", this.isCreatingStore: " + _this.isCreatingTable);
                            }, function () {
                                reject(new Error('Failed to open database!'));
                            }, function () {
                                if (_this.db) {
                                    resolve(_this.db);
                                }
                                console.log("successCallback called, this.db: " + !!_this.db + ", this.isCreatingStore: " + _this.isCreatingTable);
                            });
                        })];
                }
                else {
                    return [2 /*return*/, Promise.resolve(this.db)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Opens a database
     */
    BaseTable.prototype.openDatabase = function (database, version, successCallback, errorCallback, upgradeneededCallback) {
        if (this.isCreatingTable) {
            return; // avoid re-entry
        }
        this.isCreatingTable = true;
        var request = window.indexedDB.open(database, version);
        var table = this.tableName();
        var self = this;
        request.onsuccess = function (event) {
            self.db = request.result;
            console.log("IndexedDb " + database + " is opened.");
            if (self.db.objectStoreNames.contains(table)) {
                self.isCreatingTable = false;
            }
            successCallback && successCallback(event);
        };
        request.onerror = function (event) {
            console.error("Failed to open database. " + event);
            self.isCreatingTable = false;
            errorCallback && errorCallback(event);
        };
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            console.log("Creating table " + table + ".");
            if (!db.objectStoreNames.contains(table)) {
                db.createObjectStore(table, { keyPath: 'key', autoIncrement: true }); // keyPath: 'ssn', 'key'
            }
            self.isCreatingTable = false;
            console.log("Table " + table + " opened");
            upgradeneededCallback && upgradeneededCallback(event);
        };
    };
    /**
     * Adds a record to a table
     */
    BaseTable.prototype.add = function (record, successCallback, errorCallback) {
        var table = this.tableName();
        this.checkAndOpenDatabase().then(function (db) {
            var objectStore = db.transaction([table], 'readwrite').objectStore(table);
            var request = objectStore.add(record);
            request.onsuccess = successCallback;
            request.onerror = errorCallback;
        });
    };
    /**
     * Saves a record
     */
    BaseTable.prototype.save = function (record, successCallback, errorCallback) {
        var table = this.tableName();
        this.checkAndOpenDatabase().then(function (db) {
            var objectStore = db.transaction([table], 'readwrite').objectStore(table);
            var request = objectStore.put(record);
            request.onsuccess = successCallback;
            request.onerror = errorCallback;
        });
    };
    /**
     * Deletes a record
     */
    BaseTable.prototype["delete"] = function (key, successCallback, errorCallback) {
        var table = this.tableName();
        this.checkAndOpenDatabase().then(function (db) {
            var objectStore = db.transaction([table], 'readwrite').objectStore(table);
            var request = objectStore["delete"](key);
            request.onsuccess = successCallback;
            request.onerror = errorCallback;
        });
    };
    /**
     * Updates a record
     */
    BaseTable.prototype.update = function () {
        this.checkAndOpenDatabase().then(function (db) {
            // TODO
        });
    };
    /**
     * Queries records in a table
     */
    BaseTable.prototype.query = function (queryString, successCallback, errorCallback) {
        var table = this.tableName();
        this.checkAndOpenDatabase().then(function (db) {
            var objectStore = db.transaction([table], 'readonly').objectStore(table);
            var cursor = objectStore.openCursor();
            var result = [];
            cursor.onsuccess = function (event) {
                var csr = event.target.result; // cursor
                if (csr) {
                    console.log("Name for SSN " + csr.key + " 'is' " + csr.value.name);
                    csr["continue"]();
                    result.push(csr.value);
                }
                else {
                    successCallback && successCallback(result);
                }
            };
            cursor.onerror = errorCallback;
        });
    };
    BaseTable.prototype.sleep = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve('');
                        }, ms);
                    })];
            });
        });
    };
    BaseTable.DEFAULT_DB_NAME = 'xx_db';
    return BaseTable;
}());
exports.BaseTable = BaseTable;
