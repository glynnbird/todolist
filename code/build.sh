#!/bin/bash
npx rollup --format=es --file=dist/add_todo.js -- add_todo.js
npx rollup --format=es --file=dist/delete_todo.js -- delete_todo.js
npx rollup --format=es --file=dist/get_todo.js -- get_todo.js
npx rollup --format=es --file=dist/list_todos.js -- list_todos.js