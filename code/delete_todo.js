import { okResponse, notOkResponse, notOk } from './lib/constants.js'

export default {
  async fetch (request, env, ctx) {

    // parse the json
    const json = await request.json()

    // if there's a id
    if (json.id) {
      // delete the id from the KV store
      await env.TODOLIST.delete(json.id)

      // send response
      return new Response(JSON.stringify({ ok: true, id: json.id }), okResponse)
    }

    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)
  }
}
