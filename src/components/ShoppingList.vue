<template>
  <div class="shopping-list">
    <h1>EasyList 🛒</h1>
    <div class="list-header">
      <span>Produkt</span>
      <span>Menge</span>
      <span>Kategorie</span>
    </div>
    <ShoppingItem
      v-for="item in items"
      :key="item.id"
      :item="item"
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
      items: [
        { id: 1, name: 'Milch', quantity: 2, category: 'Getränke' },
        { id: 2, name: 'Brot', quantity: 1, category: 'Backwaren' },
        { id: 3, name: 'Äpfel', quantity: 6, category: 'Obst' },
        { id: 4, name: 'Käse', quantity: 1, category: 'Milchprodukte' },
        { id: 5, name: 'Nudeln', quantity: 3, category: 'Trockenwaren' }
      ]
    }
  }
}
</script>

<style scoped>
.shopping-list {
  max-width: 650px;
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
.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  padding: 10px;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  margin-bottom: 5px;
}
</style>