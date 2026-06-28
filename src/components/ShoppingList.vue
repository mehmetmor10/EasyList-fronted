<template>
  <div class="shopping-list">
    <h2 class="list-title">📋 {{ listName }}</h2>

    <div class="counter">
      {{ remainingCount }} von {{ items.length }} noch zu kaufen
    </div>

    <div class="search-bar">
      <input v-model="searchQuery" placeholder="🔍 Produkt suchen..." />
    </div>

    <div class="form">
      <input v-model="newName" placeholder="Produkt" />
      <input v-model="newQuantity" placeholder="Menge" type="number" min="1" @keydown="preventNegative" />
      <select v-model="newUnit">
        <option value="" disabled>Einheit</option>
        <option>Stück</option>
        <option>kg</option>
        <option>g</option>
        <option>L</option>
        <option>ml</option>
        <option>Packung</option>
        <option>Dose</option>
        <option>Flasche</option>
        <option>Tüte</option>
        <option>Glas</option>
      </select>
      <select v-model="newCategory" @change="handleCategoryChange">
        <option value="" disabled>Kategorie</option>
        <option>Obst</option>
        <option>Gemüse</option>
        <option>Milchprodukte</option>
        <option>Fleisch & Fisch</option>
        <option>Backwaren</option>
        <option>Getränke</option>
        <option>Tiefkühl</option>
        <option>Süßigkeiten</option>
        <option>Haushalt</option>
        <option>Tierbedarf</option>
        <option>Sonstiges</option>
        <option value="custom">Eigene Kategorie...</option>
      </select>
      <input v-if="showCustomCategory" v-model="customCategory" placeholder="Eigene Kategorie eingeben" />
      <button @click="addItem">Hinzufügen</button>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="toolbar">
      <select v-model="filterCategory">
        <option value="">Alle Kategorien</option>
        <option v-for="category in availableCategories" :key="category">{{ category }}</option>
      </select>
      <button class="clear-btn" @click="deleteBought" :disabled="boughtCount === 0">
        Alle gekauften löschen ({{ boughtCount }})
      </button>
    </div>

    <div class="list-header">
      <span>Produkt</span>
      <span>Menge</span>
      <span>Einheit</span>
      <span>Kategorie</span>
      <span></span>
    </div>

    <div v-if="loading" class="loading">
      ⏳ Laden...
    </div>

    <ShoppingItem
      v-for="item in sortedAndFilteredItems"
      :key="item.id"
      :item="item"
      @delete="deleteItem"
      @toggle="toggleItem"
      @edit="editItem"
    />

    <div v-if="sortedAndFilteredItems.length === 0 && !loading" class="empty-state">
      Keine Produkte gefunden.
    </div>
  </div>
</template>

<script>
import ShoppingItem from './ShoppingItem.vue'

export default {
  name: 'ShoppingList',
  props: {
    listId: { type: Number, required: true },
    listName: { type: String, required: true }
  },
  components: { ShoppingItem },
  data() {
    return {
      loading: true,
      newName: '',
      newQuantity: '',
      newUnit: '',
      newCategory: '',
      showCustomCategory: false,
      customCategory: '',
      errorMessage: '',
      filterCategory: '',
      searchQuery: '',
      items: []
    }
  },
  created() {
    this.fetchItems()
  },
  computed: {
    remainingCount() {
      return this.items.filter(item => !item.bought).length
    },
    boughtCount() {
      return this.items.filter(item => item.bought).length
    },
    availableCategories() {
      return [...new Set(this.items.map(item => item.category))]
    },
    sortedAndFilteredItems() {
      let result = this.filterCategory
        ? this.items.filter(item => item.category === this.filterCategory)
        : [...this.items]
      if (this.searchQuery) {
        const normalize = (str) => str.toLowerCase()
          .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
          .replace(/ß/g, 'ss')
        const query = normalize(this.searchQuery)
        result = result.filter(item =>
          normalize(item.name).includes(query) ||
          normalize(item.category).includes(query)
        )
      }
      return result.sort((a, b) => Number(a.bought) - Number(b.bought))
    }
  },
  methods: {
    async fetchItems() {
      try {
        const response = await fetch(`https://easylist-backend.onrender.com/lists/${this.listId}/items`)
        const data = await response.json()
        this.items = data.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit || 'Stück',
          category: item.category,
          bought: false
        }))
      } catch (error) {
        console.error('Fehler beim Laden der Items:', error)
      } finally {
        this.loading = false
      }
    },
    handleCategoryChange() {
      if (this.newCategory === 'custom') {
        this.showCustomCategory = true
        this.newCategory = ''
      } else {
        this.showCustomCategory = false
        this.customCategory = ''
      }
    },
    async addItem() {
      const category = this.showCustomCategory ? this.customCategory : this.newCategory
      if (!this.newName || !this.newQuantity || !this.newUnit || !category) {
        this.errorMessage = 'Bitte alle Felder ausfüllen!'
        setTimeout(() => { this.errorMessage = '' }, 3000)
        return
      }
      if (Number(this.newQuantity) <= 0) {
        this.errorMessage = 'Menge muss größer als 0 sein!'
        setTimeout(() => { this.errorMessage = '' }, 3000)
        return
      }
      this.errorMessage = ''
      try {
        await fetch(`https://easylist-backend.onrender.com/lists/${this.listId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.newName,
            quantity: Number(this.newQuantity),
            unit: this.newUnit,
            category: category
          })
        })
        await this.fetchItems()
      } catch (error) {
        this.errorMessage = 'Fehler beim Speichern!'
        setTimeout(() => { this.errorMessage = '' }, 3000)
      }
      this.newName = ''
      this.newQuantity = ''
      this.newUnit = ''
      this.newCategory = ''
      this.showCustomCategory = false
      this.customCategory = ''
    },
    async deleteItem(id) {
      try {
        await fetch(`https://easylist-backend.onrender.com/items/${id}`, {
          method: 'DELETE'
        })
        await this.fetchItems()
      } catch (error) {
        console.error('Fehler beim Löschen:', error)
      }
    },
    toggleItem(id) {
      const item = this.items.find(item => item.id === id)
      if (item) item.bought = !item.bought
    },
    async editItem(updatedItem) {
      try {
        await fetch(`https://easylist-backend.onrender.com/items/${updatedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: updatedItem.name,
            quantity: updatedItem.quantity,
            unit: updatedItem.unit,
            category: updatedItem.category
          })
        })
        await this.fetchItems()
      } catch (error) {
        console.error('Fehler beim Bearbeiten:', error)
      }
    },
    async deleteBought() {
      try {
        const boughtItems = this.items.filter(item => item.bought)
        await Promise.all(
          boughtItems.map(item =>
            fetch(`https://easylist-backend.onrender.com/items/${item.id}`, {
              method: 'DELETE'
            })
          )
        )
        await this.fetchItems()
      } catch (error) {
        console.error('Fehler beim Löschen:', error)
      }
    },
    preventNegative(event) {
      if (event.key === '-' || event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '0' && this.newQuantity === '') {
        event.preventDefault()
      }
    }
  }
}
</script>

<style scoped>
.shopping-list {
  max-width: 780px;
  margin: 40px auto;
  font-family: 'Inter', sans-serif;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(46, 204, 113, 0.12);
}

h1 {
  display: none;
}

.list-title {
  color: #27ae60;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.counter {
  font-size: 14px;
  color: #27ae60;
  margin-bottom: 20px;
  font-weight: 600;
  background: #f0fff4;
  padding: 8px 14px;
  border-radius: 20px;
  display: inline-block;
}

.search-bar {
  margin-bottom: 16px;
}

.search-bar input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8f8f0;
  border-radius: 10px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s;
  background: #f9fffe;
}

.search-bar input:focus {
  outline: none;
  border-color: #2ecc71;
}

.form {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  background: #f9fffe;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e8f8f0;
}

.form input, .form select {
  padding: 10px 12px;
  border: 1.5px solid #d5f5e3;
  border-radius: 8px;
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: border-color 0.2s;
  background: white;
}

.form input:focus, .form select:focus {
  outline: none;
  border-color: #2ecc71;
}

.form button {
  padding: 10px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s, transform 0.1s;
}

.form button:hover {
  background: #27ae60;
  transform: translateY(-1px);
}

.form button:active {
  transform: translateY(0);
}

.error-message {
  background: #fdecea;
  color: #c0392b;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 14px;
  font-size: 14px;
}

.toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.toolbar select {
  padding: 10px 12px;
  border: 1.5px solid #d5f5e3;
  border-radius: 8px;
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  background: white;
}

.clear-btn {
  padding: 10px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  transition: background 0.2s;
}

.clear-btn:hover:not(:disabled) {
  background: #c0392b;
}

.clear-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr 100px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  color: #aaa;
  padding: 40px 20px;
  font-style: italic;
  font-size: 15px;
}

.loading {
  text-align: center;
  padding: 30px;
  color: #27ae60;
  font-weight: 600;
  font-size: 16px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>