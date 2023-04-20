import { notOkResponse, notOk, badMethod, badContentType } from './lib/constants.js'
import { handleCORS } from './lib/cors.js'

export default {
  async fetch (request, env, ctx) {
    // handle CORS "OPTIONS" pre-flight request
    const r = handleCORS(request)
    console.log('CORS', r)
    if (r) {
      return r
    }

    // must be a POST
    if (request.method.toUpperCase() !== 'POST') {
      return new Response(badMethod, notOkResponse)
    }
    console.log('POST request')

    // must be an application/json header
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(badContentType, notOkResponse)
    }

    // parse the incoming URL
    const u = new URL(request.url)
    switch (u.pathname) {
      case '/get':
        console.log('calling getToDo')
        return await env.WORKER_GET_TODO.fetch(request, env, ctx)
      break
      
      case '/delete':
        console.log('calling deleteToDo')
        return await env.WORKER_DELETE_TODO.fetch(request, env, ctx)
      break

      case '/list':
        console.log('calling listToDos')
        return await env.WORKER_LIST_TODOS.fetch(request, env, ctx)
      break

      case '/add':
        console.log('calling addToDo')
        return await env.WORKER_ADD_TODO.fetch(request, env, ctx)
      break

      default:
        return new Response(notOk, notOkResponse)
    }
  }
}