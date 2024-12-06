var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { app } from 'electron';
import path from 'path';
import { Level } from 'level';
import { isDev } from '../util.js';
export default class Database {
    constructor(databasePath, encoding = 'json') {
        this.isOpen = false;
        this.db = new Level(path.join(app.getAppPath(), isDev() ? '.' : '..', databasePath), { valueEncoding: encoding });
    }
    open(onError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isOpen) {
                    yield this.db.open();
                    this.isOpen = true;
                }
            }
            catch (err) {
                if (onError) {
                    return onError(err);
                }
                else {
                    this.handleError(err, onError, 'open');
                }
            }
        });
    }
    handleError(err, onError, methodName) {
        if (onError) {
            onError(err);
        }
        else {
            console.error(`Error in ${methodName}:`, err);
        }
        throw err;
    }
    put(key, value, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.put(key, value);
            }
            catch (err) {
                yield this.handleError(err, onError, 'put');
            }
        });
    }
    get(key, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield this.db.get(key);
                return value;
            }
            catch (err) {
                yield this.handleError(err, onError, 'get');
            }
        });
    }
    getLastRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                let lastRecord = null;
                try {
                    for (var _d = true, _e = __asyncValues(this.db.iterator({ reverse: true, limit: 1 })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const [key, value] = _c;
                        lastRecord = { key, value };
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return lastRecord;
            }
            catch (err) {
                yield this.handleError(err, undefined, 'getLastRecord');
                return null;
            }
        });
    }
    delete(key, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.del(key);
                return true;
            }
            catch (err) {
                yield this.handleError(err, onError, 'delete');
                return false;
            }
        });
    }
    readAll() {
        return __awaiter(this, arguments, void 0, function* (start = 0, limit, onError) {
            var _a, e_2, _b, _c;
            const allEntries = [];
            try {
                let count = 0;
                try {
                    for (var _d = true, _e = __asyncValues(this.db.iterator({ gt: start })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const [key, value] = _c;
                        if (limit && count >= start + limit)
                            break;
                        allEntries.push({ key, value });
                        count++;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return allEntries;
            }
            catch (err) {
                yield this.handleError(err, onError, 'readAll');
                return [];
            }
        });
    }
    has(key, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.get(key);
                return true;
            }
            catch (err) {
                yield this.handleError(err, onError, 'has');
                return false;
            }
        });
    }
    close(onError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.close();
            }
            catch (err) {
                yield this.handleError(err, onError, 'close');
            }
        });
    }
    isEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_3, _b, _c;
            try {
                let isEmpty = true;
                try {
                    for (var _d = true, _e = __asyncValues(this.db.iterator({ limit: 1 })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const _ = _c;
                        isEmpty = false;
                        break;
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return isEmpty;
            }
            catch (err) {
                yield this.handleError(err, undefined, 'isEmpty');
                return true;
            }
        });
    }
    create32BitKey(value) {
        const buffer = Buffer.alloc(4);
        buffer.writeInt32LE(value, 0);
        return buffer.toString('hex');
    }
    decode32BitKey(key) {
        const buffer = Buffer.from(key, 'hex');
        return buffer.readInt32LE(0);
    }
}
