import { notOkResponse, notOk, badMethod, badContentType } from './lib/constants.js'
import { handleCORS } from './lib/cors.js'

export default {
  async fetch (request, env, ctx) {
    // handle CORS "OPTIONS" pre-flight request
    const r = handleCORS(request)
    if (r) {
      return r
    }

    // must be a POST
    if (request.method.toUpperCase() !== 'POST') {
      return new Response(badMethod, notOkResponse)
    }

    // must be an application/json header
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(badContentType, notOkResponse)
    }

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