import { okResponse } from './lib/constants.js'
import { mustBePOST, mustBeJSON, apiKey } from './lib/checks.js'

export async function onRequest(context) {
  // handle POST/JSON/apikey chcecks
  const r = apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // list keys in the KV store, bound to this worker as TODOLIST
  const l = await context.env.TODOLIST.list()

  // map to a list of objects
  const output = l.keys.map((k) => {
    // k.name = '1681480420026'
    return {
      id: k.name,
      ...k.metadata
    }
  })

  // send response
  return new Response(JSON.stringify({ ok: true, list: output }), okResponse)

}
