<script setup>
const { data: tasks } = useFetch('/api/task');
</script>
<template>
  <div>
    <h1>Main Page</h1>
    <ul>
      <li v-for="task in tasks" :key="task.id">{{ task.task + " " + task.completed }}</li>
    </ul>
  </div>
</template>