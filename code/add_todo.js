import { okResponse, notOkResponse, notOk } from './lib/constants.js'
import { handleCORS, mustBePOST, mustBeJSON, apiKey } from './lib/checks.js'

export async function onRequest(context) {
  // handle CORS/POST/JSON/apikey chcecks
  const r = handleCORS(context.request) || apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // parse the json
  const json = await context.request.json()

  // if there's a title
  if (json.title) {
    // create a time-based key
    const key = (new Date().getTime()).toString()

    // write key/value to the KV store, bound to this worker as TODOLIST
    const metadata = {
      time: new Date().toISOString(),
      title: json.title,
      description: json.description
    }
    // put the data in "metadata" instead of value, so that it comes back
    // in the .list() request
    await context.env.TODOLIST.put(key, null, { metadata })

    // send response
    return new Response(JSON.stringify({ ok: true, id: key }), okResponse)
  }
  
  // everyone else gets a 400 response
  return new Response(notOk, notOkResponse)

}
