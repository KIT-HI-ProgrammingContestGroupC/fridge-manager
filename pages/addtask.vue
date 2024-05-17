<script setup>
const task = ref('');
const { data: tasks } = useFetch('/api/task');

const addTask = () => {
  const { data } = useFetch('/api/task', {
    method: 'post',
    body: { task: task.value },
  });
  task.value = '';
};
</script>

<template>
  <div>
    <h1>Main Page</h1>
    <!-- 表示部分 -->
    <ul>
      <li v-for="task in tasks" :key="task.id">{{ task.task }}</li>
    </ul>

    <!-- 入力部分 -->
    <form @submit.prevent="addTask">
      <div>
        <input v-model="task" />
      </div>
      <div>
        <button type="submit">タスクを登録</button>
      </div>
    </form>
  </div>
</template>