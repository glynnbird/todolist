# todolist

## Terraform-built infrastructure

This app requires some Cloudflare infrastructure, all of which is created using Terraform:

1. A KV namespace.
2. A Cloudflare Pages project, tied to this repo with a binding to the KV Namespace from (1).
3. A custom domain whose traffic is sent the static website from (2).
4. The static website also contains a number of functions which are served out by Cloudflare Workers on the /api/* route.

## Data model

As we only have simple KeyValue store and the Cloudflare KV.list() operation only returns the keys (not the values), the data model packs some data into the key.

| key           | value |  metadata                                                                        |
|---------------|-------|----------------------------------------------------------------------------------|
| 1681893518478 | null  | {"time":"2023-04-19T08:38:38.478Z","title":"Grapes","description":"Big ones"}    |
| 1681894657902 | null  | {"time":"2023-04-19T08:57:37.902Z","title":"Lemonade","description":"Cloudy"}    |
| 1681897942565 | null  | {"time":"2023-04-19T09:52:22.565Z","title":"Bread","description":"French stick"} |

The keys is a timestamp. This allows us to get time-ordered list of todo titles with just the `KV.list()` function. The value is left blank because we're able to fit everything in the `metadata` object which has to be < 1kB, but does come back from the `KV.list` function.

## API

All methods that change data or pass parameters use the `POST` method and expect an `application/json` content type. All API endpoints require a valid `apikey` header or you will get a 401 response.

## Add a todo - POST /api/add_todo

Parameters:

- `title` - the title of the todo (required)
- `description` - additional description

e.g.

```sh
curl -X POST -H'Content-type:application/json' -H'apikey: abc123' -d'{"title":"Milk","description":"semi-skimmed"}' "https://$URL/api/add_todo" 
{"ok":true,"id":"1681482390981:Milk"}
```
## Get a single todo - POST /api/get_todo

Parameters:

- `id` - the id of the todo (required)

e.g.

```sh
curl -X POST -H'Content-type:application/json' -H'apikey: abc123' -d'{"id":"1681482390981:Milk"}' "https://$URL/api/get_todo"
{"ok":true,"todo":{"id":"1681482390981:Milk","time":"2023-04-14T14:26:30.981Z","description":"semi-skimmed"}}
```

## List multiple todos - POST /api/list_todos

Parameters

- n/a

e.g.

```sh
curl -X POST -H'Content-type:application/json' -H'apikey: abc123' "https://$URL/api/list_todos"
{"ok":true,"list":[{"id":"1681480376706:water","title":"water","ts":"2023-04-14T13:52:56.706Z"},{"id":"1681480420026:jam","title":"jam","ts":"2023-04-14T13:53:40.026Z"},{"id":"1681482390981:Milk","title":"Milk","ts":"2023-04-14T14:26:30.981Z"}]}
```

## Delete a todo - POST /api/delete_todo

Parameters:

- `id` - the id of the todo to delete (required)

```sh
curl -X POST -H'Content-type:application/json' -H'apikey: abc123' -d'{"id":"1681482390981:Milk"}' "https://$URL/api/delete_todo"
{"ok":true,"id":"1681482390981:Milk"}
```

## Build

The Cloudflare Worker platform will only accept a single JavaScript file per worker. When you have multiple workers, there is a tendency for them to share data: constants, library functions etc. It is anathema to developers to repeat code across files so what is the solution?

 - write code in the normal way, with centralised "lib" files containing code or data that is shared.
 - use `import` statements in each worker file to import data from the files
 - use the [rollup](https://rollupjs.org/) utility to pre-process each worker JS file prior to uploading.

 This produces files in the `/functions/api` folder which are those picked up by Cloudflare and turned into Workers.

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
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/add_todo.js -- add_todo.js
```

## Routing

There are number of options:

1. Routes - for each worker, attach a URL to it. This requires us to set up a DNS CNAME that is proxied by Cloudflare so that Cloudflare can intercept the traffic. One "route" is required for each worker.
2. Custom Domains - Cloudflare allows you to set up a custom domain e.g. `something.glynnnbird.com` which gets routed to a single worker. This worker can do all of the housekeeping and the invoke the right worker to handle the request. This is a simpler approach because it automatically brings the CNAME under Terraform control and plumbs it into the Worker.
3. Cloudflare Pages Workers - hosting the static site and the API on the same domain. This is easier as you don't need CORS.


## Using itty-router

If you're making a complex API with lots of methods and parameterised paths like `/todo/:id` then it makes sense to use [itty-router](https://github.com/kwhitley/itty-router) which is Cloudflare Worker compatible and gives you an Express-like interface.

I did get it working but found that `params` didn't get passed down to bound workers properly. I gave up in the end.

If I ever come back to it, remember that you need to do `npm install --save-dev @rollup/plugin-node-resolve` first. This allows rollup to bundle in Node.js dependencies with your own JavaScript files.

