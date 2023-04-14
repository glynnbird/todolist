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

export default {
  async fetch (request, env, ctx) {
    // write key/value to the KV store, bound to this worker as TODOLIST
    const r = await env.TODOLIST.list()

    // map to a list of objects
    const output = r.keys.map((k) => {
      // k.name = '1681480420026:jam'
      const m = k.name.match(/^([0-9]+):(.*)$/)
      return {
        id: k.name,
        title: m[2],
        ts: new Date(parseInt(m[1])).toISOString()
      }
    })
    // for(let i = 0; i < r.keys.length ; i++) {
    //   const k = r.keys[i].name
    //   const v = await env.TODOLIST.get(k)
    //   output.push({ id: k, description: v })
    // }

    // send response
    return new Response(JSON.stringify({ ok: true, list: output }), okResponse)
  }
}
