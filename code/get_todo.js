import { okResponse, notOkResponse, missingResponse, notOk } from './lib/constants.js'

export default {
  async fetch (request, env, ctx) {

    // parse the json
    const json = await request.json()

    // if there's a id
    if (json.id) {
      // delete the id from the KV store
      const r = await env.TODOLIST.get(json.id)
      const v = JSON.parse(r)
      if (v === null) {
        return new Response(JSON.stringify({ ok: false, msg: 'Missing' }), missingResponse);
      }

      // send response
      return new Response(JSON.stringify({ ok: true, todo: { id: json.id, ...v } }), okResponse)
    }

    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)
  }
}
