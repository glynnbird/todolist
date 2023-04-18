import { okResponse, notOkResponse, notOk } from './lib/constants.js'
import { handleCORS } from './lib/cors.js'

export default {
  async fetch (request, env, ctx) {
    // list keys in the KV store, bound to this worker as TODOLIST
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

    // send response
    return new Response(JSON.stringify({ ok: true, list: output }), okResponse)
  }
}
