import {
	buildInterface,
	Component,
	Container,
	Div,
	Input,
	State,
	TextInputCfg,
	VStack,
} from '@frugal-ui/base';
import {processAddress} from './helpers';
import './styles.css';

export function main() {
	const inputValue = new State('');
	const currentTitle = new State('');
	const currentUrl = new State('');
	const defaultUrl = localStorage.getItem('default-url') ?? 'about:blank';

	const initialUrl = new URL(window.location.href).searchParams.get('addr') || defaultUrl;
	currentUrl.value = initialUrl;

	buildInterface(
		VStack(
			Div().addToClass('window-draggers'),
			Container(
				'header',
				Input(new TextInputCfg(inputValue, 'Search the web...'))
					.setAccessibilityLabel('search or enter url')
					.access((self) =>
						self.registerKeyboardShortcuts({
							key: 'Enter',
							action: () => {
								currentUrl.value = inputValue.value;
								self.blur();
							},
						}),
					)
					.listen(
						'focus',
						() => (inputValue.value = currentUrl.value),
					)
					.listen(
						'blur',
						() => (inputValue.value = currentTitle.value),
					),
			),

			Component('webview' as any)
				.setAttr('src', initialUrl)
				.access((self: any) => {
					self.listen('dom-ready', () => {
						self.createBinding(currentUrl, (newValue: string) => {
							self.loadURL(processAddress(newValue));
						});
					})
						.listen('page-title-updated', () => {
							currentTitle.value = self.getTitle();
							inputValue.value = self.getTitle();
						})
						.listen('did-finish-load', () => {
							currentUrl._value = self.getURL();
						});
				}),
		),
	);
}
