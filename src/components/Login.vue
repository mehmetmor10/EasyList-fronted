<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-logo">
        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#2ecc71"/>
          <path d="M10 13h3.5l4 11h8l3-8.5H14.5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="17" cy="27" r="2" fill="white"/>
          <circle cx="24" cy="27" r="2" fill="white"/>
          <path d="M18 17l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="auth-logo-text">EasyList</span>
      </div>

      <h2>Willkommen zurück!</h2>
      <p class="auth-subtitle">Melde dich an um fortzufahren</p>

      <div class="form-group">
        <label>Benutzername oder Email</label>
        <input v-model="username" type="text" placeholder="Benutzername oder Email" @keyup.enter="login" />
      </div>

      <div class="form-group">
        <label>Passwort</label>
        <input v-model="password" type="password" placeholder="Dein Passwort" @keyup.enter="login" />
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button class="auth-btn" @click="login" :disabled="loading">
        {{ loading ? '⏳ Laden...' : 'Anmelden' }}
      </button>

      <p class="auth-switch">
        Noch kein Account?
        <span @click="$emit('switchToRegister')">Jetzt registrieren</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  emits: ['loginSuccess', 'switchToRegister'],
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      loading: false
    }
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        this.errorMessage = 'Bitte alle Felder ausfüllen!'
        setTimeout(() => { this.errorMessage = '' }, 3000)
        return
      }
      this.loading = true
      try {
        const response = await fetch('https://easylist-backend.onrender.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        })
        if (!response.ok) {
          const error = await response.text()
          this.errorMessage = error
          return
        }
        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.username)
        this.$emit('loginSuccess', data.username)
      } catch (error) {
        this.errorMessage = 'Fehler beim Anmelden!'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0fff4;
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 24px rgba(46, 204, 113, 0.12);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  justify-content: center;
}

.auth-logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #27ae60;
}

h2 {
  color: #2c3e50;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}

.auth-subtitle {
  color: #aaa;
  font-size: 14px;
  text-align: center;
  margin-bottom: 28px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8f8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #2ecc71;
}

.error-message {
  background: #fdecea;
  color: #c0392b;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 16px;
  font-size: 14px;
}

.auth-btn {
  width: 100%;
  padding: 14px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: background 0.2s, transform 0.1s;
  margin-bottom: 20px;
}

.auth-btn:hover:not(:disabled) {
  background: #27ae60;
  transform: translateY(-1px);
}

.auth-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.auth-switch {
  text-align: center;
  font-size: 14px;
  color: #aaa;
}

.auth-switch span {
  color: #2ecc71;
  font-weight: 600;
  cursor: pointer;
}

.auth-switch span:hover {
  text-decoration: underline;
}
</style>