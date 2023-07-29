"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAddress = void 0;
function processAddress(address) {
    var _a;
    const searchEngineString = (_a = localStorage.getItem('search')) !== null && _a !== void 0 ? _a : 'https://www.google.com/search?q=%s';
    if (/^http[s]{0,1}\:\/\//.test(address) == true)
        //valid address
        return address;
    if (address.indexOf(' ') == -1 &&
        (address.indexOf(':') > -1 || address.indexOf('.') > -1))
        //protocol missing
        return `http://${address}`;
    return searchEngineString.replace('%s', address);
}
exports.processAddress = processAddress;
