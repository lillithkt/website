import { error } from '@sveltejs/kit';
import environment from './environment';
import { VRChat } from 'vrchat';

const AUTHPROXY_TAG = 'personal';

const vrcClient = new VRChat({
	application: {
		name: `LillithRosePup Website`,
		version: `1.0.0`,
		contact: `https://lilyy.gay`
	},
	authentication: {
		optimistic: false
	},
	headers: {
		'x-proxy-token': environment.AUTHPROXY_KEY,
		'x-proxy-tag': AUTHPROXY_TAG
	},
	baseUrl: `${environment.AUTHPROXY_URL}/api/1`,
	pipeline: {
		baseUrl: `${environment.AUTHPROXY_URL}/api/1`,
		headers: {
			'x-proxy-token': environment.AUTHPROXY_KEY,
			'x-proxy-tag': AUTHPROXY_TAG
		} as unknown as Headers
	}
});

export function getUserAgent() {
	const config = vrcClient.client.getConfig();
	if (!config.headers) throw new Error('Headers does not exist on config');
	if (Array.isArray(config.headers)) {
		const entry = config.headers.find(([key, _]: [string, string]) => key == 'User-Agent');
		if (entry) return entry[1];
		throw new Error('couldnt get User-Agent from entries');
	} else if (config.headers instanceof Headers) {
		const ua = config.headers.get('User-Agent');
		if (ua) return ua;
		throw new Error('Couldnt get User-Agent from headers class');
	} else {
		const ua = config.headers['User-Agent'];
		if (ua) return ua as string;
		throw new Error('Couldnt get User-Agent from headers record');
	}
	throw new Error('Unknown type of config.headers');
}


export function manualFetch(path: string, options: RequestInit = {}) {
	if (!environment.AUTHPROXY_KEY) error(500, 'VRChat API is not configured');
	path = '/api/1' + path;
	if (!options.headers) options.headers = {};
	options.headers = {
		...options.headers,
		'User-Agent': getUserAgent(),
		'Content-Type': 'application/json',
		'x-proxy-token': environment.AUTHPROXY_KEY,
		'x-proxy-tag': AUTHPROXY_TAG
	};
	return fetch(environment.AUTHPROXY_URL + path, options);
}

const vrc = () => {
	if (!environment.AUTHPROXY_KEY) error(500, 'VRChat API is not configured');
	return vrcClient
}
export default vrc;