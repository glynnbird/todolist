import { notOkResponse, notOk, badMethod, badContentType } from './lib/constants.js'
import { handleCORS } from './lib/cors.js'
import { default as addToDo } from './add_todo.js'
import { default as listToDos } from './list_todos.js'
import { default as deleteToDo } from './delete_todo.js'
import { default as getToDo } from './get_todo.js'

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
        return getToDo.fetch(request, env, ctx)
      break
      
      case '/delete':
        console.log('calling deleteToDo')
        return deleteToDo.fetch(request, env, ctx)
      break

      case '/list':
        console.log('calling listToDos')
        return listToDos.fetch(request, env, ctx)
      break

      case '/add':
        console.log('calling addToDo')
        return addToDo.fetch(request, env, ctx)
      break

      default:
        return new Response(notOk, notOkResponse)
    }
  }
}