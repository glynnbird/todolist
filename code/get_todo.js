import { okResponse, notOkResponse, notOk } from './lib/constants.js'
import { handleCORS } from './lib/cors.js'

export default {
  async fetch (request, env, ctx) {
    // handle CORS "OPTIONS" pre-flight request
    const r = handleCORS(request)
    if (r) {
      return r
    }

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
