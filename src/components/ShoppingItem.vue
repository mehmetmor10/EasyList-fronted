<template>
  <div class="shopping-item" :class="{ bought: item.bought }">
    <span class="name">{{ item.name }}</span>
    <span class="quantity">{{ item.quantity }}</span>
    <span class="unit">{{ item.unit }}</span>
    <span class="category">{{ item.category }}</span>
    <div class="actions">
      <button class="check-btn" @click="$emit('toggle', item.id)">✓</button>
      <button class="delete-btn" @click="$emit('delete', item.id)">✕</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShoppingItem',
  props: {
    item: { type: Object, required: true }
  },
  emits: ['delete', 'toggle']
}
</script>

<style scoped>
.shopping-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr 80px;
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  background: white;
  align-items: center;
}
.shopping-item:hover {
  background: #f0f4ff;
}
.shopping-item.bought {
  background: #f5f5f5;
  color: #aaa;
  text-decoration: line-through;
}
.name {
  font-weight: bold;
}
.actions {
  display: flex;
  gap: 5px;
}
.check-btn {
  padding: 4px 8px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.delete-btn {
  padding: 4px 8px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>