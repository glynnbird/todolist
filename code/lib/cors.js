import {  corsHeaders } from './constants.js'

export const handleCORS = (request) => {
  // handle OPTIONS (CORS pre-flight request)
  if (request.method.toUpperCase() === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Headers': request.headers.get(
          'Access-Control-Request-Headers'
        )
      }
    })
  }
}