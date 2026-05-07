<template>
  <div class="shopping-item" :class="{ bought: item.bought }">
    <template v-if="!editing">
      <span class="name">{{ item.name }}</span>
      <span class="quantity">{{ item.quantity }}</span>
      <span class="unit">{{ item.unit }}</span>
      <span class="category">{{ item.category }}</span>
      <div class="actions">
        <button class="check-btn" @click="$emit('toggle', item.id)">✓</button>
        <button class="edit-btn" @click="startEdit">✏️</button>
        <button class="delete-btn" @click="$emit('delete', item.id)">✕</button>
      </div>
    </template>

    <template v-else>
      <input v-model="editName" class="edit-input" placeholder="Produkt" />
      <input v-model="editQuantity" type="number" min="1" class="edit-input" placeholder="Menge" @keydown="preventNegative" />
      <select v-model="editUnit" class="edit-input">
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
      <div class="edit-category">
        <select v-model="editCategory" @change="handleEditCategoryChange" class="edit-input">
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
        <input v-if="showCustomEditCategory" v-model="customEditCategory" class="edit-input" placeholder="Eigene Kategorie" />
      </div>
      <div class="actions">
        <button class="save-btn" @click="saveEdit">💾</button>
        <button class="cancel-btn" @click="editing = false">✕</button>
      </div>
    </template>

    <div v-if="editError" class="edit-error">{{ editError }}</div>
  </div>
</template>

<script>
const STANDARD_CATEGORIES = [
  'Obst & Gemüse', 'Milchprodukte', 'Fleisch & Fisch', 'Backwaren',
  'Getränke', 'Tiefkühl', 'Süßigkeiten', 'Haushalt', 'Sonstiges'
]

export default {
  name: 'ShoppingItem',
  props: {
    item: { type: Object, required: true }
  },
  emits: ['delete', 'toggle', 'edit'],
  data() {
    return {
      editing: false,
      editName: '',
      editQuantity: '',
      editUnit: '',
      editCategory: '',
      showCustomEditCategory: false,
      customEditCategory: '',
      editError: ''
    }
  },
  methods: {
    startEdit() {
      this.editing = true
      this.editName = this.item.name
      this.editQuantity = this.item.quantity
      this.editUnit = this.item.unit
      this.editError = ''

      if (STANDARD_CATEGORIES.includes(this.item.category)) {
        this.editCategory = this.item.category
        this.showCustomEditCategory = false
        this.customEditCategory = ''
      } else {
        this.editCategory = 'custom'
        this.showCustomEditCategory = true
        this.customEditCategory = this.item.category
      }
    },
    handleEditCategoryChange() {
      if (this.editCategory === 'custom') {
        this.showCustomEditCategory = true
        this.customEditCategory = ''
      } else {
        this.showCustomEditCategory = false
        this.customEditCategory = ''
      }
    },
    preventNegative(event) {
      if (event.key === '-' || event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '0' && this.editQuantity === '') {
        event.preventDefault()
      }
    },
    saveEdit() {
      const category = this.showCustomEditCategory ? this.customEditCategory : this.editCategory
      if (!this.editName || !this.editQuantity || !this.editUnit || !category) {
        this.editError = 'Bitte alle Felder ausfüllen!'
        setTimeout(() => { this.editError = '' }, 3000)
        return
      }
      if (Number(this.editQuantity) <= 0) {
        this.editError = 'Menge muss größer als 0 sein!'
        setTimeout(() => { this.editError = '' }, 3000)
        return
      }
      this.$emit('edit', {
        id: this.item.id,
        name: this.editName,
        quantity: Number(this.editQuantity),
        unit: this.editUnit,
        category: category
      })
      this.editing = false
      this.editError = ''
    }
  }
}
</script>

<style scoped>
.shopping-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr 100px;
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
.edit-input {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 90%;
  font-size: 14px;
}
.edit-category {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.actions {
  display: flex;
  gap: 4px;
}
.check-btn {
  padding: 4px 6px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.edit-btn {
  padding: 4px 6px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.delete-btn {
  padding: 4px 6px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.save-btn {
  padding: 4px 6px;
  background: #2980b9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cancel-btn {
  padding: 4px 6px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.edit-error {
  grid-column: 1 / -1;
  color: #c0392b;
  background: #fdecea;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 13px;
  margin-top: 4px;
}
</style>