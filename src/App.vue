<script setup>
import ShoppingList from './components/ShoppingList.vue'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="logo">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#2ecc71"/>
          <path d="M10 13h3.5l4 11h8l3-8.5H14.5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="17" cy="27" r="2" fill="white"/>
          <circle cx="24" cy="27" r="2" fill="white"/>
          <path d="M18 17l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="logo-text">EasyList</span>
      </div>
    </header>
    <main>
      <ShoppingList />
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #f0fff4;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
}

.app-header {
  background: white;
  padding: 16px 32px;
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.15);
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #27ae60;
  letter-spacing: -0.5px;
}
</style>