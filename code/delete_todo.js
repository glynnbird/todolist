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
        await env.TODOLIST.delete(json.id)

        // send response
        return new Response(JSON.stringify({ ok: true, id: json.id }), okResponse)
      }
    }

    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)
  }
}
