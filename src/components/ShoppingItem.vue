<template>
  <div class="shopping-item" :class="{ bought: item.bought }">
    <template v-if="!editing">
      <span class="name">{{ item.name }}</span>
      <span class="quantity">{{ item.quantity }}</span>
      <span class="unit">{{ item.unit }}</span>
      <span class="category">{{ getCategorySymbol(item.category) }} {{ item.category }}</span>
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
  'Obst', 'Gemüse', 'Milchprodukte', 'Fleisch & Fisch', 'Backwaren',
  'Getränke', 'Tiefkühl', 'Süßigkeiten', 'Haushalt', 'Tierbedarf', 'Sonstiges'
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
    },
       getCategorySymbol(category) {
         const symbols = {
           'Obst': '🍎',
           'Gemüse': '🥦',
           'Milchprodukte': '🥛',
           'Fleisch & Fisch': '🥩',
           'Backwaren': '🍞',
           'Getränke': '🥤',
           'Tiefkühl': '🧊',
           'Süßigkeiten': '🍬',
           'Haushalt': '🧹',
           'Tierbedarf': '🐾',
           'Sonstiges': '📦'
         }
         return symbols[category] || '🛒'
       }
     }
   }

</script>

<style scoped>
.shopping-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr 100px;
  padding: 14px 16px;
  border-bottom: 1px solid #e8f8f0;
  background: white;
  align-items: center;
  transition: background 0.15s;
  border-radius: 8px;
  margin-bottom: 2px;
}

.shopping-item:hover {
  background: #f0fff4;
}

.shopping-item.bought {
  background: #f9f9f9;
  color: #bbb;
  text-decoration: line-through;
}

.name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
}

.shopping-item.bought .name {
  color: #bbb;
}

.edit-input {
  padding: 6px 8px;
  border: 1.5px solid #d5f5e3;
  border-radius: 6px;
  width: 90%;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s;
}

.edit-input:focus {
  outline: none;
  border-color: #2ecc71;
}

.edit-category {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.actions {
  display: flex;
  gap: 5px;
}

.check-btn {
  padding: 5px 8px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s, transform 0.1s;
}

.check-btn:hover {
  background: #27ae60;
  transform: translateY(-1px);
}

.edit-btn {
  padding: 5px 8px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.edit-btn:hover {
  background: #d68910;
  transform: translateY(-1px);
}

.delete-btn {
  padding: 5px 8px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.delete-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

.save-btn {
  padding: 5px 8px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #27ae60;
}

.cancel-btn {
  padding: 5px 8px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #7f8c8d;
}

.edit-error {
  grid-column: 1 / -1;
  color: #c0392b;
  background: #fdecea;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  margin-top: 6px;
}
</style>