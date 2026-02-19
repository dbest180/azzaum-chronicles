<script setup>
</script>

<template>
  <div class="home">
    <h1>Project Codex: The Archives</h1>
    <p>Select a topic from the sidebar to begin.</p>
    <router-link to="/wiki/javascript">View JavaScript Notes</router-link>
    <p><router-link to="/wiki/vue">Vue Notes</router-link></p>
    <p><router-link to="wiki/markdown">View Markdown Notes</router-link></p>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  margin-top: 4rem;
}
a {
  color: #42b883;
  text-decoration: none;
  font-weight: bold;
}
</style>