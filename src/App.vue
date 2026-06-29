<script setup>
import { ref, onMounted, watch } from 'vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import ShoppingLists from './components/ShoppingLists.vue'
import ShoppingList from './components/ShoppingList.vue'

const isLoggedIn = ref(false)
const username = ref('')
const showRegister = ref(false)
const selectedList = ref(null)

onMounted(() => {
  const token = localStorage.getItem('token')
  const savedUsername = localStorage.getItem('username')
  if (token && savedUsername) {
    isLoggedIn.value = true
    username.value = savedUsername
  }
  const saved = localStorage.getItem('selectedList')
  if (saved) {
    selectedList.value = JSON.parse(saved)
  }
})

watch(selectedList, (newVal) => {
  if (newVal) {
    localStorage.setItem('selectedList', JSON.stringify(newVal))
  } else {
    localStorage.removeItem('selectedList')
  }
})

function handleLoginSuccess(name) {
  isLoggedIn.value = true
  username.value = name
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('selectedList')
  isLoggedIn.value = false
  username.value = ''
  selectedList.value = null
}
</script>

<template>
  <div class="app">
    <header class="app-header" v-if="isLoggedIn">
      <div class="logo" @click="selectedList = null" style="cursor: pointer">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#2ecc71"/>
          <path d="M10 13h3.5l4 11h8l3-8.5H14.5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="17" cy="27" r="2" fill="white"/>
          <circle cx="24" cy="27" r="2" fill="white"/>
          <path d="M18 17l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="logo-text">EasyList</span>
      </div>
      <div class="header-right">
        <button v-if="selectedList" class="back-btn" @click="selectedList = null">
          ← Zurück zu Listen
        </button>
        <span class="username">👤 {{ username }}</span>
        <button class="logout-btn" @click="logout">Abmelden</button>
      </div>
    </header>

    <main>
      <template v-if="!isLoggedIn">
        <Register v-if="showRegister" @switchToLogin="showRegister = false" />
        <Login v-else @loginSuccess="handleLoginSuccess" @switchToRegister="showRegister = true" />
      </template>
      <template v-else>
        <ShoppingLists v-if="!selectedList" @selectList="selectedList = $event" />
        <ShoppingList v-else :listId="selectedList.id" :listName="selectedList.name" />
      </template>
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
  justify-content: space-between;
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

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #27ae60;
}

.back-btn {
  padding: 8px 16px;
  background: #f0fff4;
  color: #27ae60;
  border: 2px solid #2ecc71;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #2ecc71;
  color: white;
}

.logout-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>