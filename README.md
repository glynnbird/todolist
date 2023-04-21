# todolist

## Terraform-built infrastructure

This app requires some Cloudflare infrastructure, all of which is created using Terraform:

1. A KV namespace.
2. Various Workers that are bound to the KV namespace from (1).
3. A "router" Worker that can invoke Workers from (2) in response to HTTP traffic.
4. A custom domain whose traffic is sent to the router worker from step (3).

## Data model

As we only have simple KeyValue store and the Cloudflare KV.list() operation only returns the keys (not the values), the data model packs some data into the key.

| key                    | value                                                            |
|------------------------|------------------------------------------------------------------|
| 1681893518478:Oranges  | {"time":"2023-04-19T08:38:38.478Z","description":"Big ones"}     |
| 1681894657902:Lemonade | {"time":"2023-04-19T08:57:37.902Z","description":"Cloudy"}       |
| 1681897942565:Bread    | {"time":"2023-04-19T09:52:22.565Z","description":"French stick"} |

The keys have a timestamp prefix followed a `:` and then by the `title` of the Todo. This allows us to get time-ordered list of todo titles with just the `KV.list()` function. If we want the `description`, the client will have to fetch each todo's body.

## API

All methods that change data or pass parameters use the `POST` method and expect an `application/json` content type.

## Add a todo - POST /add

Parameters:

- `title` - the title of the todo (required)
- `description` - additional description

e.g.

```sh
curl -X POST -H'Content-type:application/json' -d'{"title":"Milk","description":"semi-skimmed"}' "https://$URL/add" 
{"ok":true,"id":"1681482390981:Milk"}
```
## Get a single todo - POST /get

Parameters:

- `id` - the id of the todo (required)

e.g.

```sh
curl -X POST -H'Content-type:application/json' -d'{"id":"1681482390981:Milk"}' "https://$URL/get"
{"ok":true,"todo":{"id":"1681482390981:Milk","time":"2023-04-14T14:26:30.981Z","description":"semi-skimmed"}}
```

## List multiple todos - POST /list

Parameters

- n/a

e.g.

```sh
curl -X POST -H'Content-type:application/json' "https://$URL/list"
{"ok":true,"list":[{"id":"1681480376706:water","title":"water","ts":"2023-04-14T13:52:56.706Z"},{"id":"1681480420026:jam","title":"jam","ts":"2023-04-14T13:53:40.026Z"},{"id":"1681482390981:Milk","title":"Milk","ts":"2023-04-14T14:26:30.981Z"}]}
```

## Delete a todo - POST /delete

Parameters:

- `id` - the id of the todo to delete (required)

```sh
curl -X POST -H'Content-type:application/json' -d'{"id":"1681482390981:Milk"}' "https://$URL/delete"
{"ok":true,"id":"1681482390981:Milk"}
```

## Build

The Cloudflare Worker platform will only accept a single JavaScript file per worker. When you have multiple workers, there is a tendency for them to share data: constants, library functions etc. It is anathema to developers to repeat code across files so what is the solution?

 - write code in the normal way, with centralised "lib" files containing code or data that is shared.
 - use `import` statements in each worker file to import data from the files
 - use the [rollup](https://rollupjs.org/) utility to pre-process each worker JS file prior to uploading.

 This produces files in the `dist` folder which are those expected by Terraform for deployment.

 e.g. in `lib/somefile.js`

```js
export const someFunction = () => {
  return true  
}
```

And in your worker JS file:

```js
import { someFunction } from './lib/somefile.js'
someFunction()
```

And roll up with:

```sh
# create a distributable file in the 'dist' folder based on the source file
npx rollup --format=es --file=dist/add_todo.js -- add_todo.js
```

We can also "minify" the rolled up files to make them smaller, but this does change variable names to single-letter names which makes debugging tricky:

```sh
# create a minified distributable file in the 'dist' folder based on the source file
npx rollup -p @rollup/plugin-terser --format=es --file=dist/add_todo.js -- add_todo.js
```

## Routing

There are number of options:

1. Routes - for each worker, attach a URL to it. This requires us to set up a DNS CNAME that is proxied by Cloudflare so that Cloudflare can intercept the traffic. One "route" is required for each worker.
2. Custom Domains - Cloudflare allows you to set up a custom domain e.g. `something.glynnnbird.com` which gets routed to a single worker. This worker can do all of the housekeeping and the invoke the right worker to handle the request. This is a simpler approach because it automatically brings the CNAME under Terraform control and plumbs it into the Worker.

My `router.js` does some sanity checks

- Is this a `POST` request?
- Is the user supplying a `Content-type: application/json` header?

If not, they get HTTP 400.

It also handles `OPTIONS` (CORS pre-flight checks) for all routes in one place.

It then checks the incoming path (e.g. `/add`) and decides which Worker to call. These handler Workers are do not have public routes, so you can only get to them through the router.

The router worker needs "service bindings" to be able to call another worker. This is all set up in Terraform. 

The router worker is not bound to the KV namespace, but the individual workers are.