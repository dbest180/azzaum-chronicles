<script setup>
import { ref, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const route = useRoute()
const content = ref('')
const toc = ref([])
const activeSection = ref('')
const stats = ref({ readTime: 0, updated: '' })
let observer = null

const loadContent = async () => {
  const slug = route.params.slug
  if (!slug) return

  try {
    const modules = import.meta.glob('../content/*.md', { query: '?raw', import: 'default' })
    const loader = modules[`../content/${slug}.md`]
    if (!loader) throw new Error('Chronicle missing')
    
    const rawMarkdown = await loader()
    
    // Stats
    const words = rawMarkdown.split(/\s+/).length
    stats.value.readTime = Math.ceil(words / 200)
    stats.value.updated = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())

    // Render HTML & Extract Headers for TOC
    const html = marked.parse(rawMarkdown)
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h2, h3')
    
    toc.value = Array.from(headings).map((h, index) => {
      const id = `section-${index}`
      h.id = id // Inject ID into DOM node
      return { id, text: h.innerText, level: h.tagName }
    })

    content.value = DOMPurify.sanitize(doc.body.innerHTML)
    window.scrollTo(0, 0)
    
    await nextTick()
    setupObserver()
  } catch (err) {
    content.value = `<div class="error-state"><h1>LOG PURGED</h1><p>The record for "${slug}" is lost.</p></div>`
    toc.value = []
  }
}

// Interactivity: ScrollSpy Observer
const setupObserver = () => {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
  }, { rootMargin: '0px 0px -80% 0px' })

  document.querySelectorAll('.markdown-body h2, .markdown-body h3').forEach(h => observer.observe(h))
}

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

watch(() => route.params.slug, loadContent)
onMounted(loadContent)
onUnmounted(() => { if (observer) observer.disconnect() })
</script>

<template>
  <div class="three-pane-container">
    <article class="center-pane">
      <header class="wiki-meta">
        <span>SECURE_ACCESS: GRANTED</span>
        <span>READ_TIME: {{ stats.readTime }} MIN</span>
      </header>
      <div v-html="content" class="markdown-body"></div>
    </article>

    <aside class="right-pane">
      <div class="right-pane-sticky">
        <section v-if="route.params.slug === 'The-ANCIENTS'" class="bio-card interactive-hover">
          <h3>BIOMETRICS</h3>
          <ul>
            <li><strong>SKELETAL:</strong> Obsidian Marrow</li>
            <li><strong>NEURAL:</strong> Secondary Lattice</li>
            <li><strong>CELLULAR:</strong> Telomeric Recursion</li>
          </ul>
        </section>
        
        <div class="toc-container interactive-hover" v-if="toc.length">
          <h3>INDEX</h3>
          <ul class="toc-list">
            <li v-for="item in toc" :key="item.id" 
                :class="['toc-item', item.level, { active: activeSection === item.id }]"
                @click="scrollTo(item.id)">
              {{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.three-pane-container {
  display: flex;
  flex-direction: row;
  gap: 3rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.center-pane { flex: 1; min-width: 0; }
.right-pane { width: 280px; flex-shrink: 0; }
.right-pane-sticky { position: sticky; top: 2rem; }

/* Interactivity FX */
.bio-card, .toc-container {
  background: #0d0d0d;
  border: 1px solid #1a0000;
  border-left: 3px solid var(--blood-red);
  padding: 1.5rem;
  margin-bottom: 2rem;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
}

.interactive-hover:hover {
  box-shadow: 0 0 15px rgba(139, 0, 0, 0.2);
  transform: translateX(-5px);
  border-color: #330000;
}

.toc-container h3, .bio-card h3 { color: var(--blood-red); margin-top: 0; letter-spacing: 2px; }

.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-item { cursor: pointer; color: #666; font-size: 0.85rem; padding: 6px 0; transition: 0.2s; }
.toc-item:hover { color: #fff; }
.toc-item.H3 { padding-left: 15px; font-size: 0.75rem; color: #555; }
.toc-item.active { color: var(--blood-red); font-weight: bold; }

.wiki-meta { display: flex; justify-content: space-between; font-family: 'Courier New', monospace; font-size: 0.7rem; color: #444; border-bottom: 1px solid #1a0000; padding-bottom: 10px; margin-bottom: 2rem; }

/* Markdown Center Content */
:deep(.markdown-body) { font-family: 'Inter', sans-serif; line-height: 1.8; color: #ccc; }
:deep(.markdown-body h1) { color: var(--blood-red); font-family: 'Courier New', monospace; text-transform: uppercase; font-size: 2.2rem; margin-bottom: 1.5rem; }
:deep(.markdown-body h2), :deep(.markdown-body h3) { color: #fff; scroll-margin-top: 80px; margin-top: 2rem; border-bottom: 1px solid #1a0000; padding-bottom: 5px; }
:deep(.markdown-body strong) { color: var(--blood-red); }
:deep(.markdown-body blockquote) { border-left: 4px solid var(--blood-red); padding: 1rem; color: #aaa; background: rgba(139,0,0,0.05); font-style: italic; }

@media (max-width: 1024px) {
  .three-pane-container { flex-direction: column; padding: 1.5rem; gap: 2rem; }
  .right-pane { width: 100%; order: -1; /* Moves TOC to top on mobile */ }
  .right-pane-sticky { position: static; }
}
</style>