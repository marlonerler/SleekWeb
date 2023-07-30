import {
	buildInterface,
	Button,
	Component,
	Container,
	Div,
	Header,
	Input,
	State,
	Sheet,
	TextInputCfg,
	VStack,
	Label,
	LocalStorageState,
	ScrollArea,
	Text,
} from '@frugal-ui/base';
import { processAddress } from './helpers';
import './styles.css';
import { API } from './preload';

declare const electron: typeof API;

export function main() {
	// Data
	const inputValue = new State('');
	const currentTitle = new State('');
	const currentUrl = new State('');
	const defaultUrl = new LocalStorageState('default-url', 'about:blank');
	const searchEngineString = new LocalStorageState(
		'search',
		'https://www.google.com/search?q=%s',
	);
	const initialUrl =
		new URL(window.location.href).searchParams.get('addr') ||
		defaultUrl.value;
	currentUrl.value = initialUrl;
	const isLoading = new State(true);

	const isSettingsSheetOpen = new State(false);

	// Comms
	electron.onNavMessage((item) => {
		switch (item) {
			case 'settings':
				isSettingsSheetOpen.value = true;
				break;
		}
	});
	electron.onStateMessage((state) => {
		console.log(state);
		document.body.toggleAttribute('focused', state == 'focus');
	});
	electron.onAccentChange((color) => {
		document.body.style.setProperty('--system-accent', `#${color}`);
	});

	// Interface
	buildInterface(
		VStack(
			Div(
				Text('Loading...').setVisibleIfMatch(isLoading, true).addToClass('progress-texts'),
			).setID('background'),
			Div().setID('window-dragger'),
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

			Container(
				'main',
				Component('webview' as any)
					.setAttr(
						'src',
						processAddress(initialUrl, searchEngineString.value),
					)
					.access((self: any) => {
						self.listen('dom-ready', () => {
							self.createBinding(
								currentUrl,
								(newValue: string) => {
									self.loadURL(
										processAddress(
											newValue,
											searchEngineString.value,
										),
									);
								},
							);

							electron.onPageMessage((action) => {
								try {
									self[action]();
								} catch {
									console.error(
										`Error with ${action}`,
										self[action],
									);
								}
							});
						})
							.listen('page-title-updated', () => {
								currentTitle.value = self.getTitle();
								inputValue.value = self.getTitle();
								document.title = self.getTitle();
							})
							.listen('did-stop-loading', () => {
								currentUrl._value = self.getURL();
								isLoading.value = false;
							})
							.listen('did-start-loading', () => {
								currentUrl._value = self.getURL();
								isLoading.value = true;
							});
					}),

				Sheet(
					{
						accessibilityLabel: 'settings',
						isOpen: isSettingsSheetOpen,
					},

					VStack(
						Header(
							{
								text: 'Settings',
							},
							Button({
								accessibilityLabel: 'close settings',
								iconName: 'close',
								action: () =>
									(isSettingsSheetOpen.value = false),
							}),
						),

						ScrollArea(
							// Start Page
							Label(
								'Start page',
								Input(
									new TextInputCfg(defaultUrl, 'about:blank'),
								),
							),
							// Search Engine
							Label(
								'Search engine',
								Input(
									new TextInputCfg(
										searchEngineString,
										'%s for search query',
									),
								),
							),
						).useDefaultSpacing(),
					)
						.useDefaultSpacing()
						.useDefaultPadding(),
				).addToClass('settings'),
			),
		),
	);
}
