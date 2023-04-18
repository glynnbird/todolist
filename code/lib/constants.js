export const headers = {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
export const corsHeaders= {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400'
  }
export const okResponse = {
    status: 200,
    headers
  }
export const notOkResponse = {
    status: 400,
    headers
  }
export const notOk =  JSON.stringify({ ok: false })
