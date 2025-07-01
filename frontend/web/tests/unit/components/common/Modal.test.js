import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from '@/components/common/Modal.vue'

describe('Modal.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = null
    // Reset DOM
    document.body.innerHTML = ''
    document.body.className = ''
  })

  const createWrapper = (props = {}, slots = {}) => {
    return mount(Modal, {
      props: {
        visible: false,
        ...props
      },
      slots,
      global: {
        stubs: {
          LoadingSpinner: true
        }
      },
      attachTo: document.body
    })
  }

  describe('Basic Functionality', () => {
    it('renders modal when visible is true', async () => {
      wrapper = createWrapper({ visible: true })
      
      expect(wrapper.find('.modal.show').exists()).toBe(true)
      expect(wrapper.find('.modal-backdrop').exists()).toBe(true)
    })

    it('does not render modal when visible is false', () => {
      wrapper = createWrapper({ visible: false })
      
      expect(wrapper.find('.modal').exists()).toBe(false)
      expect(wrapper.find('.modal-backdrop').exists()).toBe(false)
    })

    it('displays title when provided', () => {
      wrapper = createWrapper({
        visible: true,
        title: 'Test Modal'
      })

      expect(wrapper.find('.modal-title').text()).toBe('Test Modal')
    })

    it('displays message when provided', () => {
      wrapper = createWrapper({
        visible: true,
        message: 'This is a test message'
      })

      expect(wrapper.find('.modal-body p').text()).toBe('This is a test message')
    })
  })

  describe('Modal Sizes', () => {
    it('applies correct size class for small modal', () => {
      wrapper = createWrapper({
        visible: true,
        size: 'sm'
      })

      expect(wrapper.find('.modal-dialog').classes()).toContain('modal-sm')
    })

    it('applies correct size class for large modal', () => {
      wrapper = createWrapper({
        visible: true,
        size: 'lg'
      })

      expect(wrapper.find('.modal-dialog').classes()).toContain('modal-lg')
    })

    it('applies fullscreen class when size is fullscreen', () => {
      wrapper = createWrapper({
        visible: true,
        size: 'fullscreen'
      })

      expect(wrapper.find('.modal-dialog').classes()).toContain('modal-fullscreen')
    })
  })

  describe('Modal Variants', () => {
    it('applies danger variant styling', () => {
      wrapper = createWrapper({
        visible: true,
        variant: 'danger'
      })

      expect(wrapper.find('.modal').classes()).toContain('modal-danger')
    })

    it('applies warning variant styling', () => {
      wrapper = createWrapper({
        visible: true,
        variant: 'warning'
      })

      expect(wrapper.find('.modal').classes()).toContain('modal-warning')
    })
  })

  describe('Modal Options', () => {
    it('shows close button when closable is true', () => {
      wrapper = createWrapper({
        visible: true,
        title: 'Test',
        closable: true
      })

      expect(wrapper.find('.btn-close').exists()).toBe(true)
    })

    it('hides close button when closable is false', () => {
      wrapper = createWrapper({
        visible: true,
        title: 'Test',
        closable: false
      })

      expect(wrapper.find('.btn-close').exists()).toBe(false)
    })

    it('applies centered styling when centered is true', () => {
      wrapper = createWrapper({
        visible: true,
        centered: true
      })

      expect(wrapper.find('.modal-dialog').classes()).toContain('modal-dialog-centered')
    })

    it('applies scrollable styling when scrollable is true', () => {
      wrapper = createWrapper({
        visible: true,
        scrollable: true
      })

      expect(wrapper.find('.modal-dialog').classes()).toContain('modal-dialog-scrollable')
    })
  })

  describe('Default Actions', () => {
    it('shows default actions when showDefaultActions is true', () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true
      })

      expect(wrapper.find('.modal-footer').exists()).toBe(true)
      expect(wrapper.findAll('.modal-footer .btn')).toHaveLength(2)
    })

    it('shows only confirm button when showCancel is false', () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true,
        showCancel: false
      })

      expect(wrapper.findAll('.modal-footer .btn')).toHaveLength(1)
      expect(wrapper.find('.modal-footer .btn').text()).toContain('Confirm')
    })

    it('shows only cancel button when showConfirm is false', () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true,
        showConfirm: false
      })

      expect(wrapper.findAll('.modal-footer .btn')).toHaveLength(1)
      expect(wrapper.find('.modal-footer .btn').text()).toContain('Cancel')
    })

    it('uses custom button text', () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true,
        cancelText: 'Close',
        confirmText: 'Save Changes'
      })

      const buttons = wrapper.findAll('.modal-footer .btn')
      expect(buttons[0].text()).toBe('Close')
      expect(buttons[1].text()).toBe('Save Changes')
    })
  })

  describe('Events', () => {
    it('emits update:visible when close button is clicked', async () => {
      wrapper = createWrapper({
        visible: true,
        title: 'Test'
      })

      await wrapper.find('.btn-close').trigger('click')

      expect(wrapper.emitted('update:visible')).toBeTruthy()
      expect(wrapper.emitted('update:visible')[0]).toEqual([false])
    })

    it('emits confirm event when confirm button is clicked', async () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true
      })

      const confirmButton = wrapper.findAll('.modal-footer .btn')[1]
      await confirmButton.trigger('click')

      expect(wrapper.emitted('confirm')).toBeTruthy()
    })

    it('emits cancel event when cancel button is clicked', async () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true
      })

      const cancelButton = wrapper.findAll('.modal-footer .btn')[0]
      await cancelButton.trigger('click')

      expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('emits hide event when backdrop is clicked and closeOnBackdrop is true', async () => {
      wrapper = createWrapper({
        visible: true,
        closeOnBackdrop: true
      })

      await wrapper.find('.modal-backdrop').trigger('click')

      expect(wrapper.emitted('update:visible')).toBeTruthy()
      expect(wrapper.emitted('update:visible')[0]).toEqual([false])
    })

    it('does not close when backdrop is clicked and closeOnBackdrop is false', async () => {
      wrapper = createWrapper({
        visible: true,
        closeOnBackdrop: false
      })

      await wrapper.find('.modal-backdrop').trigger('click')

      expect(wrapper.emitted('update:visible')).toBeFalsy()
    })

    it('closes when escape key is pressed and closeOnEscape is true', async () => {
      wrapper = createWrapper({
        visible: true,
        closeOnEscape: true
      })

      await wrapper.find('.modal').trigger('keydown.esc')

      expect(wrapper.emitted('update:visible')).toBeTruthy()
      expect(wrapper.emitted('update:visible')[0]).toEqual([false])
    })

    it('does not close when escape key is pressed and closeOnEscape is false', async () => {
      wrapper = createWrapper({
        visible: true,
        closeOnEscape: false
      })

      await wrapper.find('.modal').trigger('keydown.esc')

      expect(wrapper.emitted('update:visible')).toBeFalsy()
    })
  })

  describe('Persistent Modal', () => {
    it('applies blur effect when persistent is true', () => {
      wrapper = createWrapper({
        visible: true,
        persistent: true
      })

      expect(wrapper.find('.modal').classes()).toContain('modal-blur')
    })

    it('does not close when persistent and backdrop is clicked', async () => {
      wrapper = createWrapper({
        visible: true,
        persistent: true,
        closeOnBackdrop: true
      })

      await wrapper.find('.modal-backdrop').trigger('click')

      expect(wrapper.emitted('update:visible')).toBeFalsy()
    })
  })

  describe('Loading State', () => {
    it('disables confirm button when loading is true', () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true,
        loading: true
      })

      const confirmButton = wrapper.findAll('.modal-footer .btn')[1]
      expect(confirmButton.attributes('disabled')).toBeDefined()
    })

    it('shows loading spinner when loading is true', () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true,
        loading: true
      })

      expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(true)
    })
  })

  describe('Button Styling', () => {
    it('applies correct button classes for danger variant', () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true,
        variant: 'danger'
      })

      const buttons = wrapper.findAll('.modal-footer .btn')
      expect(buttons[0].classes()).toContain('btn-outline-danger')
      expect(buttons[1].classes()).toContain('btn-danger')
    })

    it('applies correct button classes for warning variant', () => {
      wrapper = createWrapper({
        visible: true,
        showDefaultActions: true,
        variant: 'warning'
      })

      const buttons = wrapper.findAll('.modal-footer .btn')
      expect(buttons[1].classes()).toContain('btn-warning')
    })
  })

  describe('Slots', () => {
    it('renders custom header content', () => {
      wrapper = createWrapper({
        visible: true
      }, {
        header: '<h3>Custom Header</h3>'
      })

      expect(wrapper.find('.modal-header h3').text()).toBe('Custom Header')
    })

    it('renders custom footer content', () => {
      wrapper = createWrapper({
        visible: true
      }, {
        footer: '<button class="custom-btn">Custom Button</button>'
      })

      expect(wrapper.find('.modal-footer .custom-btn').exists()).toBe(true)
    })

    it('renders custom body content', () => {
      wrapper = createWrapper({
        visible: true
      }, {
        default: '<div class="custom-content">Custom Content</div>'
      })

      expect(wrapper.find('.modal-body .custom-content').text()).toBe('Custom Content')
    })
  })

  describe('Accessibility', () => {
    it('sets correct ARIA attributes', () => {
      wrapper = createWrapper({
        visible: true,
        title: 'Test Modal'
      })

      const modal = wrapper.find('.modal')
      expect(modal.attributes('aria-modal')).toBe('true')
      expect(modal.attributes('role')).toBe('dialog')
      expect(modal.attributes('aria-labelledby')).toBeDefined()
    })

    it('sets aria-describedby when body content exists', () => {
      wrapper = createWrapper({
        visible: true,
        title: 'Test Modal',
        message: 'Test message'
      })

      const modal = wrapper.find('.modal')
      expect(modal.attributes('aria-describedby')).toBeDefined()
    })
  })
})