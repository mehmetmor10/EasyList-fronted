<template>
  <div class="lists-container">
    <h2>Meine Einkaufslisten</h2>

    <div class="create-form">
      <input v-model="newListName" placeholder="Name der Liste..." />
      <button @click="createList">+ Neue Liste</button>
    </div>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div v-if="loading" class="loading">⏳ Laden...</div>

    <div v-else-if="lists.length === 0" class="empty-state">
      Noch keine Listen vorhanden. Erstelle deine erste Liste!
    </div>

    <div v-else class="lists-grid">
      <div
        v-for="list in lists"
        :key="list.id"
        class="list-card"
        @click="$emit('selectList', list)"
      >
        <div class="list-card-header">
          <span class="list-name">📋 {{ list.name }}</span>
          <button class="delete-list-btn" @click.stop="deleteList(list.id)">✕</button>
        </div>
        <div class="list-actions">
          <button class="rename-btn" @click.stop="startRename(list)">✏️</button>
        </div>
        <div v-if="renamingId === list.id" class="rename-form" @click.stop>
          <input v-model="newName" placeholder="Neuer Name..." />
          <button @click.stop="saveRename(list.id)">💾</button>
          <button @click.stop="renamingId = null">✕</button>
        </div>
        <div class="list-date">
          {{ formatDate(list.createdAt) }}
        </div>
        <div class="list-item-count">
          🛒 {{ list.itemCount }} {{ list.itemCount === 1 ? 'Produkt' : 'Produkte' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShoppingLists',
  emits: ['selectList'],
  data() {
    return {
      lists: [],
      newListName: '',
      errorMessage: '',
      loading: true,
      renamingId: null,
      newName: ''
    }
  },
  created() {
    this.fetchLists()
  },
  methods: {
    async fetchLists() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('https://easylist-backend.onrender.com/lists', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          localStorage.removeItem('selectedList')
          window.location.reload()
          return
        }
        const lists = await response.json()
        for (const list of lists) {
          const itemsResponse = await fetch(`https://easylist-backend.onrender.com/lists/${list.id}/items`)
          const items = await itemsResponse.json()
          list.itemCount = items.length
        }
        this.lists = lists
      } catch (error) {
        console.error('Fehler beim Laden der Listen:', error)
      } finally {
        this.loading = false
      }
    },
    async createList() {
      if (!this.newListName.trim()) {
        this.errorMessage = 'Bitte einen Namen eingeben!'
        setTimeout(() => { this.errorMessage = '' }, 3000)
        return
      }
      try {
        const token = localStorage.getItem('token')
        await fetch('https://easylist-backend.onrender.com/lists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: this.newListName })
        })
        this.newListName = ''
        await this.fetchLists()
      } catch (error) {
        console.error('Fehler beim Erstellen der Liste:', error)
      }
    },
    async deleteList(id) {
      if (!confirm('Bist du sicher dass du diese Liste löschen möchtest?')) {
        return
      }
      try {
        await fetch(`https://easylist-backend.onrender.com/lists/${id}`, {
          method: 'DELETE'
        })
        await this.fetchLists()
      } catch (error) {
        console.error('Fehler beim Löschen der Liste:', error)
      }
    },
    startRename(list) {
      this.renamingId = list.id
      this.newName = list.name
    },
    async saveRename(id) {
      try {
        await fetch(`https://easylist-backend.onrender.com/lists/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.newName })
        })
        this.renamingId = null
        await this.fetchLists()
      } catch (error) {
        console.error('Fehler beim Umbenennen:', error)
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.lists-container {
  max-width: 780px;
  margin: 40px auto;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(46, 204, 113, 0.12);
}

h2 {
  color: #27ae60;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

.create-form {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.create-form input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e8f8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s;
}

.create-form input:focus {
  outline: none;
  border-color: #2ecc71;
}

.create-form button {
  padding: 12px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: background 0.2s, transform 0.1s;
}

.create-form button:hover {
  background: #27ae60;
  transform: translateY(-1px);
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

.loading {
  text-align: center;
  padding: 30px;
  color: #27ae60;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  color: #aaa;
  padding: 40px;
  font-style: italic;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.list-card {
  background: #f9fffe;
  border: 2px solid #e8f8f0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.list-card:hover {
  border-color: #2ecc71;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.15);
  transform: translateY(-2px);
}

.list-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.list-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
}

.delete-list-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-list-btn:hover {
  background: #c0392b;
}

.list-actions {
  margin-bottom: 8px;
}

.rename-btn {
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.rename-btn:hover {
  background: #d68910;
}

.rename-form {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.rename-form input {
  flex: 1;
  padding: 6px 8px;
  border: 1.5px solid #d5f5e3;
  border-radius: 6px;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
}

.rename-form button {
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
}

.rename-form button:first-of-type {
  background: #2ecc71;
}

.rename-form button:last-of-type {
  background: #95a5a6;
}

.list-date {
  font-size: 12px;
  color: #aaa;
}

.list-item-count {
  font-size: 12px;
  color: #27ae60;
  font-weight: 600;
  margin-top: 4px;
}
</style>