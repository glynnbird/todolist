import { okResponse, notOkResponse, notOk } from './lib/constants.js'

export default {
  async fetch (request, env, ctx) {

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
      // put the data in "metadata" instead of value, so that it comes back
      // in the .list() request
      await env.TODOLIST.put(key, null, { metadata: value })

      // send response
      return new Response(JSON.stringify({ ok: true, id: key }), okResponse)
    }
    
    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)
  }
}