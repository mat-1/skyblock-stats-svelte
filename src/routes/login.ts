import type { RequestHandler } from '@sveltejs/kit'

// @ts-ignore Cloudflare Workers can't read process.env
const discordClientId = DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID
if (!discordClientId)
	console.warn('DISCORD_CLIENT_ID is not set as an environment variable. This is required for logging in with Discord to work.')

export const get: RequestHandler = async ({ request }) => {
	const host = request.headers.get('host')
	if (!discordClientId)
		return {
			status: 500,
			headers: {
				'content-type': 'text/plain',
			},
			body: 'DISCORD_CLIENT_ID is not set as an environment variable. Please contact the owner of the website if this was expected to work.',
		}

	if (!host)
		return {
			status: 400,
			headers: {
				'content-type': 'text/plain',
			},
			body: 'Host header is required.',
		}

	const protocol = request.url.startsWith('https') ? 'https' : 'http'

	return {
		status: 303,
		headers: {
			location: `https://discord.com/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${protocol}://${host}%2Floggedin&response_type=code&scope=identify`
		}
	}
}
