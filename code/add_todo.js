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
        await env.TODOLIST.put(key, JSON.stringify(value))

        // send response
        return new Response(JSON.stringify({ ok: true, id: key }), okResponse)
      }
    }

    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)
  }
}