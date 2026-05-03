<template>
  <div class="shopping-item">
    <span class="name">{{ item.name }}</span>
    <span class="quantity">{{ item.quantity }}</span>
    <span class="category">{{ item.category }}</span>
  </div>
</template>

<script>
export default {
  name: 'ShoppingItem',
  props: {
    item: { type: Object, required: true }
  }
}
</script>

<style scoped>
.shopping-item {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  background: white;
}
.shopping-item:hover {
  background: #f0f4ff;
}
.name {
  font-weight: bold;
}
</style>