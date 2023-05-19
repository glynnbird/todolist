<script setup>
  // composables
  const todos = useTodos()
  const alert = useAlert()
  const auth = useAuth()

  // config
  const config = useRuntimeConfig()

  // local page items
  const title = ref(0)
  title.value = ''
  const description = ref(1)
  description.value = ''
  const busy = ref(2)
  busy.value = false
  
  // method - add new todo 
  async function addToDo() {
    if (!title.value) {
      return
    }
    busy.value = true
    const t = {
      title: title.value,
      description: description.value
    }
    console.log('API', '/add', t)
    const ret = await useFetch(`${config.public['apiBase']}/add`, {
      method: 'post',
      body: t,
      headers: {
        'content-type': 'application/json',
        apikey: auth.value.apiKey
      }
    })
    t.id = ret.data.value.id
    todos.value.push(t)

    // create alert
    alert.value.ts = new Date().getTime()
    alert.value.message = 'Added new to do'
    busy.value = false 

    // bounce to home page
    await navigateTo('/')
  }
</script>
<template>
  <PageTitle title="Add ToDo"></PageTitle>
  <v-form>
    <v-text-field
      v-model="title"
      label="Title"
      required
      autofocus
      @keydown.enter="addToDo()"
    ></v-text-field>

    <v-text-field
      v-model="description"
      label="Description"
      @keydown.enter="addToDo()"
    ></v-text-field>

    <v-btn
      :disabled="title.length === 0 || busy"
      color="success"
      class="mr-4"
      @click="addToDo()"
    >
      Add
    </v-btn>
  </v-form>
</template>
