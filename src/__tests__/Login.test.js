import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Login from '../components/Login.vue'

describe('Login', () => {
  it('zeigt Login Formular an', () => {
    const wrapper = mount(Login)
    expect(wrapper.text()).toContain('Anmelden')
  })

  it('zeigt Fehlermeldung wenn Felder leer sind', async () => {
    const wrapper = mount(Login)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Bitte alle Felder ausfüllen')
  })

  it('Link zu Registrierung ist vorhanden', () => {
    const wrapper = mount(Login)
    expect(wrapper.text()).toContain('Jetzt registrieren')
  })
})