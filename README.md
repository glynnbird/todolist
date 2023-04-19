# todolist

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
curl -X POST "https://$URL/list"
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