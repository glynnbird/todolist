import { notOkResponse, notOk } from './lib/constants.js'
import { handleCORS, mustBePOST, mustBeJSON, apiKey } from './lib/checks.js'

export default {
  async fetch (request, env, ctx) {
    // handle CORS/POST/JSON/apikey chcecks
    const r = handleCORS(request) || apiKey(request, env) || mustBePOST(request) || mustBeJSON(request)
    if (r) return r

    // parse the incoming URL
    const u = new URL(request.url)

    // list of allowed paths and which worker will handle the request 
    const mapping = {
      '/get': env.WORKER_GET_TODO,
      '/delete': env.WORKER_DELETE_TODO,
      '/list': env.WORKER_LIST_TODOS,
      '/add': env.WORKER_ADD_TODO
    }
    const worker = mapping[u.pathname]
    if (worker) {
      // pass the request to the handling worker
      return await worker.fetch(request, env, ctx)
    }
    // if you get here it's because the request pathname is not recognised - so HTTP 400
    return new Response(notOk, notOkResponse)
  }
}