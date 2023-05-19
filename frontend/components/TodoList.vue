<script setup>
  // input attributes
  const { todos } = defineProps(['todos'])

  // emitted events
  defineEmits(['deleteTodo'])
</script>
<template>
  <v-list>
    <v-list-item v-for="todo in todos" :key="todo.id">
      <v-list-item-title>{{  todo.title }}</v-list-item-title>
      <v-list-item-subtitle v-if="todo.description">{{ todo.description }}</v-list-item-subtitle>
      <template v-slot:append>
        <v-btn
          color="grey-lighten-1"
          icon="mdi-delete"
          variant="text"
          @click="$emit('deleteTodo', todo.id)"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
  <!-- if empty, show instructions -->
  <div v-if="todos.length === 0">
    <v-img alt="Photo by Eden Constantino on Unsplash" src="/images/eden-constantino-bTukYI4DjOs-unsplash.jpg"></v-img>
    Your To do list is empty. Start by clicking the <NuxtLink href="/add">+</NuxtLink> icon in the top left.
  </div>
</template>