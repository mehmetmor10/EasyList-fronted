import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ShoppingList from '../components/ShoppingList.vue'

describe('ShoppingList', () => {
  it('zeigt den Titel EasyList', () => {
    const wrapper = mount(ShoppingList, {
      global: {
        stubs: {
          ShoppingItem: true
        }
      }
    })
    expect(wrapper.text()).toContain('EasyList')
  })

  it('zeigt Fehlermeldung wenn Felder leer sind', async () => {
    const wrapper = mount(ShoppingList, {
      global: {
        stubs: {
          ShoppingItem: true
        }
      }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Bitte alle Felder ausfüllen')
  })

  it('Suchfeld ist vorhanden', () => {
    const wrapper = mount(ShoppingList, {
      global: {
        stubs: {
          ShoppingItem: true
        }
      }
    })
    const searchInput = wrapper.find('.search-bar input')
    expect(searchInput.exists()).toBe(true)
  })
})