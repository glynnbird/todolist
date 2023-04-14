/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const headers = {
	'content-type': 'application/json'
}
const okResponse = {
  status: 200,
  headers
}
const notOkResponse = {
	status: 400,
	headers
}
const notOk = JSON.stringify({ ok: false })

export default {
	async fetch(request, env, ctx) {
	  // only accept application/json requests	
		const contentType = request.headers.get("content-type");
    if (contentType.includes("application/json")) {

			// parse the json
      const json = await request.json()

			// if there's a title
			if (json.title) {

        // create a time-based key
				const ts = (new Date().getTime()).toString()
				const key = `${ts}:${json.title}`

				// write key/value to the KV store, bound to this worker as TODOLIST
				const value = {
					time: new Date().toISOString(),
					description: json.description
				}
				const r = await env.TODOLIST.put(key, JSON.stringify(value))

				// send response
				return new Response(JSON.stringify({ ok: true, id: key }), okResponse)
			}
    }

		// everyone else gets a 400 response
		return new Response(notOk, notOkResponse)	
	}
}