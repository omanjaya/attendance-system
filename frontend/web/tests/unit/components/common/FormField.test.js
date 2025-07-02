import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FormField from '@/components/common/FormField.vue'

describe('FormField.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = null
  })

  const createWrapper = (props = {}, slots = {}) => {
    return mount(FormField, {
      props: {
        modelValue: '',
        ...props
      },
      slots,
      global: {
        stubs: {
          TablerIcon: true,
          LoadingSpinner: true
        }
      }
    })
  }

  describe('Basic Functionality', () => {
    it('renders correctly with basic props', () => {
      wrapper = createWrapper({
        label: 'Test Label',
        placeholder: 'Test placeholder'
      })

      expect(wrapper.find('label').text()).toBe('Test Label')
      expect(wrapper.find('input').attributes('placeholder')).toBe('Test placeholder')
    })

    it('emits update:modelValue when input changes', async () => {
      wrapper = createWrapper()
      const input = wrapper.find('input')

      await input.setValue('test value')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test value'])
    })

    it('displays required asterisk when required prop is true', () => {
      wrapper = createWrapper({
        label: 'Required Field',
        required: true
      })

      expect(wrapper.find('.text-danger').text()).toBe('*')
    })

    it('displays optional text when optional prop is true', () => {
      wrapper = createWrapper({
        label: 'Optional Field',
        optional: true
      })

      expect(wrapper.find('.text-muted').text()).toBe('(optional)')
    })
  })

  describe('Input Types', () => {
    it('renders text input by default', () => {
      wrapper = createWrapper()
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })

    it('renders email input when type is email', () => {
      wrapper = createWrapper({ type: 'email' })
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    })

    it('renders password input when type is password', () => {
      wrapper = createWrapper({ type: 'password' })
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    })

    it('renders textarea when type is textarea', () => {
      wrapper = createWrapper({ type: 'textarea' })
      expect(wrapper.find('textarea').exists()).toBe(true)
    })

    it('renders select when type is select', () => {
      wrapper = createWrapper({
        type: 'select',
        options: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' }
        ]
      })

      expect(wrapper.find('select').exists()).toBe(true)
      expect(wrapper.findAll('option')).toHaveLength(3) // Including placeholder option
    })

    it('renders checkbox when type is checkbox', () => {
      wrapper = createWrapper({
        type: 'checkbox',
        checkboxLabel: 'Check me'
      })

      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
      expect(wrapper.find('.form-check-label').text()).toBe('Check me')
    })
  })

  describe('Validation', () => {
    it('displays error message when error prop is provided', () => {
      wrapper = createWrapper({
        error: 'This field is required'
      })

      expect(wrapper.find('.invalid-feedback').text()).toBe('This field is required')
      expect(wrapper.find('input').classes()).toContain('is-invalid')
    })

    it('displays success message when success prop is provided', () => {
      wrapper = createWrapper({
        success: 'Field is valid'
      })

      expect(wrapper.find('.valid-feedback').text()).toBe('Field is valid')
      expect(wrapper.find('input').classes()).toContain('is-valid')
    })

    it('applies error styling when error is boolean true', () => {
      wrapper = createWrapper({
        error: true
      })

      expect(wrapper.find('input').classes()).toContain('is-invalid')
      expect(wrapper.find('.invalid-feedback').text()).toBe('This field has an error')
    })
  })

  describe('Help Text', () => {
    it('displays help text after field by default', () => {
      wrapper = createWrapper({
        helpText: 'This is help text'
      })

      const helpText = wrapper.find('.form-text')
      expect(helpText.text()).toBe('This is help text')
    })

    it('displays help text before field when helpPosition is before', () => {
      wrapper = createWrapper({
        helpText: 'This is help text',
        helpPosition: 'before'
      })

      const helpTexts = wrapper.findAll('.form-text')
      expect(helpTexts).toHaveLength(1)
      expect(helpTexts[0].text()).toBe('This is help text')
    })
  })

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      wrapper = createWrapper({
        disabled: true
      })

      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('applies disabled styling to wrapper', () => {
      wrapper = createWrapper({
        disabled: true
      })

      expect(wrapper.find('.form-field').classes()).toContain('form-field-disabled')
    })
  })

  describe('Icons and Prefixes', () => {
    it('displays prefix icon when prefix prop is provided', () => {
      wrapper = createWrapper({
        prefix: 'user'
      })

      expect(wrapper.find('.input-group-text').exists()).toBe(true)
    })

    it('displays suffix icon when suffix prop is provided', () => {
      wrapper = createWrapper({
        suffix: 'search'
      })

      const suffixElements = wrapper.findAll('.input-group-text')
      expect(suffixElements.length).toBeGreaterThan(0)
    })

    it('displays clear button when clearable and has value', () => {
      wrapper = createWrapper({
        clearable: true,
        modelValue: 'some value'
      })

      expect(wrapper.find('.field-clear').exists()).toBe(true)
    })

    it('emits clear event when clear button is clicked', async () => {
      wrapper = createWrapper({
        clearable: true,
        modelValue: 'some value'
      })

      await wrapper.find('.field-clear').trigger('click')

      expect(wrapper.emitted('clear')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([''])
    })
  })

  describe('Loading State', () => {
    it('displays loading spinner when loading prop is true', () => {
      wrapper = createWrapper({
        loading: true
      })

      expect(wrapper.find('.input-loading').exists()).toBe(true)
    })
  })

  describe('Select Field Options', () => {
    it('normalizes string options correctly', () => {
      wrapper = createWrapper({
        type: 'select',
        options: ['Option 1', 'Option 2']
      })

      const options = wrapper.findAll('option')
      expect(options[1].text()).toBe('Option 1')
      expect(options[1].attributes('value')).toBe('Option 1')
    })

    it('handles object options correctly', () => {
      wrapper = createWrapper({
        type: 'select',
        options: [
          { label: 'First Option', value: 'first' },
          { label: 'Second Option', value: 'second', disabled: true }
        ]
      })

      const options = wrapper.findAll('option')
      expect(options[1].text()).toBe('First Option')
      expect(options[1].attributes('value')).toBe('first')
      expect(options[2].attributes('disabled')).toBeDefined()
    })
  })

  describe('Radio Field', () => {
    it('renders radio group with options', () => {
      wrapper = createWrapper({
        type: 'radio',
        name: 'test-radio',
        options: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' }
        ]
      })

      expect(wrapper.find('fieldset').exists()).toBe(true)
      expect(wrapper.findAll('input[type="radio"]')).toHaveLength(2)
    })

    it('selects correct radio option based on modelValue', () => {
      wrapper = createWrapper({
        type: 'radio',
        modelValue: 'opt2',
        options: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' }
        ]
      })

      const radios = wrapper.findAll('input[type="radio"]')
      expect(radios[0].element.checked).toBe(false)
      expect(radios[1].element.checked).toBe(true)
    })
  })

  describe('File Input', () => {
    it('renders file input with accept attribute', () => {
      wrapper = createWrapper({
        type: 'file',
        accept: 'image/*'
      })

      const fileInput = wrapper.find('input[type="file"]')
      expect(fileInput.exists()).toBe(true)
      expect(fileInput.attributes('accept')).toBe('image/*')
    })

    it('handles multiple file selection', () => {
      wrapper = createWrapper({
        type: 'file',
        multiple: true
      })

      expect(wrapper.find('input[type="file"]').attributes('multiple')).toBeDefined()
    })
  })

  describe('Events', () => {
    it('emits focus event when input is focused', async () => {
      wrapper = createWrapper()

      await wrapper.find('input').trigger('focus')

      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('emits blur event when input loses focus', async () => {
      wrapper = createWrapper()

      await wrapper.find('input').trigger('blur')

      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('emits keydown event when key is pressed', async () => {
      wrapper = createWrapper()

      await wrapper.find('input').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('keydown')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('generates unique field ID', () => {
      wrapper = createWrapper({
        label: 'Test Label'
      })

      const input = wrapper.find('input')
      const label = wrapper.find('label')

      expect(input.attributes('id')).toBeDefined()
      expect(label.attributes('for')).toBe(input.attributes('id'))
    })

    it('sets aria-describedby when help text is present', () => {
      wrapper = createWrapper({
        helpText: 'Help text'
      })

      expect(wrapper.find('input').attributes('aria-describedby')).toBeDefined()
    })

    it('sets aria-invalid when field has error', () => {
      wrapper = createWrapper({
        error: 'Error message'
      })

      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    })
  })
})
