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
  'content-type': 'application/json',
  'Access-Control-Allow-Origin': '*'
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
  async fetch (request, env, ctx) {
    // only accept application/json requests
    const contentType = request.headers.get('content-type')
    if (contentType.includes('application/json')) {
      // parse the json
      const json = await request.json()

      // if there's a id
      if (json.id) {
        // delete the id from the KV store
        const r = await env.TODOLIST.get(json.id)
        const v = JSON.parse(r)

        // send response
        return new Response(JSON.stringify({ ok: true, todo: { id: json.id, ...v } }), okResponse)
      }
    }

    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)
  }
}
