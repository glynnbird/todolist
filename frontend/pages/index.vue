<script setup>
  // composables
  const todos = useTodos()
  const auth = useAuth()

  // config
  const config = useRuntimeConfig()

  // if this is the first time,
  if (todos.value.length === 0) {
    try {
      //  fetch the list from the API
      console.log('API', '/list')
      const r = await useFetch(`${config.public['apiBase']}/list`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      todos.value = r.data.value.list
    } catch (e) {
      console.error('failed to fetch list of todos', e)
    }
  }
    
  // delete an individual todo
  const deleteTodo = async  (id) => {
    console.log('API', '/delete', id)
    try {
      const ret = await useFetch(`${config.public['apiBase']}/delete`, {
        method: 'post',
        body: {
          id
        },
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      for (let i = 0; i < todos.value.length; i++) {
        if (todos.value[i].id === id) {
          todos.value.splice(i,1)
          break
        }
      }
    } catch (e) {
      console.error('Could not delete', id, e)
    }
  }
</script>
<template>
  <PageTitle title="ToDo List"></PageTitle>
  <TodoList :todos="todos" @deleteTodo="deleteTodo"></TodoList>
</template>
