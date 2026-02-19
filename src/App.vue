<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const wikiPages = ref([])
const isMenuOpen = ref(false)
const route = useRoute()

const loadWikiPages = () => {
  const modules = import.meta.glob('./content/*.md')
  wikiPages.value = Object.keys(modules).map((path) => {
    const slug = path.split('/').pop().replace('.md', '')
    return { slug, name: slug.toUpperCase().replace(/-/g, ' ') }
  })
}

watch(() => route.path, () => { isMenuOpen.value = false })
onMounted(loadWikiPages)
</script>

<template>
  <div id="layout" :class="{ 'menu-open': isMenuOpen }">
    <header class="azzaum-header">
      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
        {{ isMenuOpen ? '✕' : '☰' }}
      </button>
      <h1 class="header-title">THE ANCIENT CHRONICLES</h1>
    </header>

    <div class="sidebar-overlay" @click="isMenuOpen = false"></div>

    <aside class="left-pane">
      <div class="sidebar-header">
        <h2>AZZAUM</h2>
        <div class="status-line">BIO-RECURSION ACTIVE</div>
      </div>
      <nav class="nav-links">
        <router-link to="/">CORE LOGS</router-link>
        <div class="nav-section">THE CHRONICLES</div>
        <router-link v-for="page in wikiPages" :key="page.slug" :to="`/wiki/${page.slug}`">
          // {{ page.name }}
        </router-link>
      </nav>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
:root {
  --blood-red: #8b0000;
  --obsidian: #0a0a0a;
  --neural-gray: #1a1a1a;
  --text-primary: #d1d1d1;
}

body {
  margin: 0;
  background-color: var(--obsidian);
  background-image: radial-gradient(circle at 2px 2px, #1a0000 1px, transparent 0);
  background-size: 40px 40px;
  color: var(--text-primary);
  font-family: 'Courier New', Courier, monospace;
  overflow-x: hidden;
}

#layout { display: flex; min-height: 100vh; }
.azzaum-header { display: none; }

.left-pane {
  width: 260px;
  background: var(--neural-gray);
  border-right: 1px solid var(--blood-red);
  padding: 1.5rem;
  position: sticky;
  top: 0;
  height: 100vh;
  box-sizing: border-box;
  flex-shrink: 0;
}

.sidebar-header h2 { color: var(--blood-red); letter-spacing: 5px; margin-bottom: 5px; }
.status-line { font-size: 0.6rem; color: #666; margin-bottom: 20px; }
.nav-links { display: flex; flex-direction: column; gap: 0.5rem; }
.nav-section { font-size: 0.75rem; color: #555; margin-top: 1.5rem; font-weight: bold; }
.nav-links a { color: #888; text-decoration: none; padding: 5px 0; border-left: 2px solid transparent; padding-left: 10px; transition: 0.3s; }
.nav-links a:hover, .nav-links a.router-link-active { color: var(--blood-red); border-left: 2px solid var(--blood-red); background: rgba(139, 0, 0, 0.1); }

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

@media (max-width: 1024px) {
  .azzaum-header {
    display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 60px;
    background: rgba(10, 10, 10, 0.9); backdrop-filter: blur(8px);
    z-index: 1000; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--blood-red); box-sizing: border-box;
  }
  .menu-toggle { background: transparent; color: var(--blood-red); border: 1px solid var(--blood-red); width: 40px; height: 40px; cursor: pointer; }
  .header-title { margin-left: 20px; font-size: 1rem; color: var(--blood-red); font-weight: bold; }
  .left-pane { position: fixed; left: 0; transform: translateX(-100%); z-index: 1500; transition: transform 0.3s; }
  .menu-open .left-pane { transform: translateX(0); }
  .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1400; }
  .menu-open .sidebar-overlay { display: block; }
  .main-content { padding-top: 60px; }
}
</style>