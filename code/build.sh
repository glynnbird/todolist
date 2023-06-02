#!/bin/bash
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/add_todo.js -- add_todo.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/delete_todo.js -- delete_todo.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/get_todo.js -- get_todo.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/list_todos.js -- list_todos.js
#npx rollup --format=es --file=dist/router.js -- router.js
