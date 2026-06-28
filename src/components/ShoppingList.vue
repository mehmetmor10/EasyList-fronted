<template>
  <div class="shopping-list">
    <h1>EasyList 🛒</h1>

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
        <option>Obst & Gemüse</option>
        <option>Milchprodukte</option>
        <option>Fleisch & Fisch</option>
        <option>Backwaren</option>
        <option>Getränke</option>
        <option>Tiefkühl</option>
        <option>Süßigkeiten</option>
        <option>Haushalt</option>
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

    <ShoppingItem
      v-for="item in sortedAndFilteredItems"
      :key="item.id"
      :item="item"
      @delete="deleteItem"
      @toggle="toggleItem"
      @edit="editItem"
    />

    <div v-if="sortedAndFilteredItems.length === 0" class="empty-state">
      Keine Produkte gefunden.
    </div>
  </div>
</template>

<script>
import ShoppingItem from './ShoppingItem.vue'

export default {
  name: 'ShoppingList',
  components: { ShoppingItem },
  data() {
    return {
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
        const response = await fetch('https://easylist-backend.onrender.com/items')
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
        await fetch('https://easylist-backend.onrender.com/items', {
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
    deleteItem(id) {
      this.items = this.items.filter(item => item.id !== id)
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
    deleteBought() {
      this.items = this.items.filter(item => !item.bought)
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
  max-width: 750px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}
.counter {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  font-weight: 500;
}
.search-bar {
  margin-bottom: 15px;
}
.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}
.search-bar input:focus {
  outline: none;
  border-color: #2c3e50;
}
.form {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.form input, .form select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1;
}
.form button {
  padding: 8px 16px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.form button:hover {
  background: #3d5166;
}
.error-message {
  background: #fdecea;
  color: #c0392b;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  padding: 8px 14px;
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
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1;
}
.clear-btn {
  padding: 8px 14px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
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
  padding: 10px;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  margin-bottom: 5px;
}
.empty-state {
  text-align: center;
  color: #aaa;
  padding: 20px;
  font-style: italic;
}
</style>