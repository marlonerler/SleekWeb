"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const base_1 = require("@frugal-ui/base");
const helpers_1 = require("./helpers");
require("./styles.css");
function main() {
    var _a, _b;
    const inputValue = new base_1.State('');
    const currentTitle = new base_1.State('');
    const currentUrl = new base_1.State('');
    const defaultUrl = (_a = localStorage.getItem('default-url')) !== null && _a !== void 0 ? _a : 'about:blank';
    const initialUrl = (_b = new URL(window.location.href).searchParams.get('addr')) !== null && _b !== void 0 ? _b : defaultUrl;
    currentUrl.value = initialUrl;
    (0, base_1.buildInterface)((0, base_1.VStack)((0, base_1.Div)().addToClass('window-draggers'), (0, base_1.Container)('header', (0, base_1.Input)(new base_1.TextInputCfg(inputValue, 'Search the web...'))
        .setAccessibilityLabel('search or enter url')
        .access((self) => self.registerKeyboardShortcuts({
        key: 'Enter',
        action: () => {
            currentUrl.value = inputValue.value;
            self.blur();
        },
    }))
        .listen('focus', () => (inputValue.value = currentUrl.value))
        .listen('blur', () => (inputValue.value = currentTitle.value))), (0, base_1.Component)('webview')
        .setAttr('src', initialUrl)
        .access((self) => {
        self.listen('dom-ready', () => {
            self.createBinding(currentUrl, (newValue) => {
                self.loadURL((0, helpers_1.processAddress)(newValue));
            });
        })
            .listen('page-title-updated', () => {
            currentTitle.value = self.getTitle();
            inputValue.value = self.getTitle();
        })
            .listen('did-finish-load', () => {
            currentUrl._value = self.getURL();
        });
    })));
}
exports.main = main;
