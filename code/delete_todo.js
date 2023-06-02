import { okResponse, notOkResponse, notOk } from './lib/constants.js'
import { handleCORS, mustBePOST, mustBeJSON, apiKey } from './lib/checks.js'

export async function onRequest(context) {
  // handle CORS/POST/JSON/apikey chcecks
  const r = handleCORS(context.request) || apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // parse the json
  const json = await context.request.json()

  // if there's a id
  if (json.id) {
    // delete the id from the KV store
    await context.env.TODOLIST.delete(json.id)

    // send response
    return new Response(JSON.stringify({ ok: true, id: json.id }), okResponse)
  }

  // everyone else gets a 400 response
  return new Response(notOk, notOkResponse)
  
}
