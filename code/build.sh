#!/bin/bash
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/add_todo.js -- add_todo.js
# npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/delete_todo.js -- delete_todo.js
# npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/get_todo.js -- get_todo.js
# npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/list_todos.js -- list_todos.js
#npx rollup --format=es --file=dist/router.js -- router.js
