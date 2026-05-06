<template>
  <div class="shopping-list">
    <h1>EasyList 🛒</h1>

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

    <div class="list-header">
      <span>Produkt</span>
      <span>Menge</span>
      <span>Einheit</span>
      <span>Kategorie</span>
      <span></span>
    </div>

    <ShoppingItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @delete="deleteItem"
      @toggle="toggleItem"
    />
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
      items: [
        { id: 1, name: 'Milch', quantity: 2, unit: 'L', category: 'Getränke', bought: false },
        { id: 2, name: 'Brot', quantity: 1, unit: 'Stück', category: 'Backwaren', bought: false },
        { id: 3, name: 'Äpfel', quantity: 6, unit: 'Stück', category: 'Obst & Gemüse', bought: false },
        { id: 4, name: 'Käse', quantity: 1, unit: 'Packung', category: 'Milchprodukte', bought: false },
        { id: 5, name: 'Nudeln', quantity: 3, unit: 'Packung', category: 'Sonstiges', bought: false }
      ]
    }
  },
  methods: {
    handleCategoryChange() {
      if (this.newCategory === 'custom') {
        this.showCustomCategory = true
        this.newCategory = ''
      } else {
        this.showCustomCategory = false
        this.customCategory = ''
      }
    },
    addItem() {
      const category = this.showCustomCategory ? this.customCategory : this.newCategory
      if (!this.newName || !this.newQuantity || !this.newUnit || !category) return
      if (Number(this.newQuantity) <= 0) return
      this.items.push({
        id: Date.now(),
        name: this.newName,
        quantity: Number(this.newQuantity),
        unit: this.newUnit,
        category: category,
        bought: false
      })
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
    preventNegative(event) {
      if (event.key === '-' || event.key === 'e' || event.key === '0' && this.newQuantity === '') {
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
  margin-bottom: 20px;
}
.form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
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
.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr 80px;
  padding: 10px;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  margin-bottom: 5px;
}
</style>