export function processAddress(address: string): string {
	const searchEngineString = localStorage.getItem('search') ?? 'https://www.google.com/search?q=%s';

	if (/^http[s]{0,1}\:\/\//.test(address) == true)
		//valid address
		return address;

	if (
		address.indexOf(' ') == -1 &&
		(address.indexOf(':') > -1 || address.indexOf('.') > -1)
	)
		//protocol missing
		return `http://${address}`;

	return searchEngineString.replace('%s', address);
}
