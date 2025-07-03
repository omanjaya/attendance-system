class d {
  constructor() {
    ;((this.ajaxHandler = window.AjaxHandler),
      (this.modalHandler = window.ModalHandler),
      (this.notificationManager = window.NotificationManager),
      (this.validator = new FormValidator()),
      (this.calendar = null),
      (this.currentFilters = ['holiday', 'event', 'exam', 'meeting', 'training']),
      (this.events = window.calendarEvents || []),
      this.init())
  }
  init() {
    ;(this.setupValidation(), this.setupModals(), this.initializeCalendar(), this.bindEvents())
  }
  setupValidation() {
    ;(this.validator.addRule('title', ValidationRules.required, 'Event title is required'),
      this.validator.addRule('start_date', ValidationRules.required, 'Start date is required'),
      this.validator.addRule('end_date', ValidationRules.required, 'End date is required'),
      this.validator.addRule('type', ValidationRules.required, 'Event type is required'))
  }
  setupModals() {
    ;(this.modalHandler.register('addEventModal', {
      form: '#createEventForm',
      validator: this.validator,
      onSubmit: (e, t) => this.submitEventForm('create', t)
    }),
      this.modalHandler.register('editEventModal', {
        form: '#editEventForm',
        validator: this.validator,
        onSubmit: (e, t) => this.submitEventForm('edit', t)
      }),
      this.modalHandler.register('eventDetailsModal', { resetOnHide: !1 }))
  }
  initializeCalendar() {
    const e = document.getElementById(window.calendarConfig.id)
    if (!e) {
      console.warn('Calendar element not found')
      return
    }
    ;((this.calendar = new FullCalendar.Calendar(e, {
      ...window.calendarConfig,
      events: this.getFilteredEvents(),
      select: t => this.handleDateSelect(t),
      eventClick: t => this.handleEventClick(t),
      eventDrop: t => this.handleEventDrop(t),
      eventResize: t => this.handleEventResize(t),
      datesSet: t => this.handleDatesSet(t)
    })),
      this.calendar.render())
  }
  bindEvents() {
    document.querySelectorAll('#calendar-filters input[type="checkbox"]').forEach(t => {
      t.addEventListener('change', () => this.updateFilters())
    })
  }
  getFilteredEvents() {
    return this.events.filter(e => this.currentFilters.includes(e.type))
  }
  updateFilters() {
    const e = document.querySelectorAll('#calendar-filters input[type="checkbox"]:checked')
    ;((this.currentFilters = Array.from(e).map(t => t.value)),
      this.calendar && (this.calendar.removeAllEvents(), this.calendar.addEventSource(this.getFilteredEvents())))
  }
  handleDateSelect(e) {
    const t = e.start.toISOString().split('T')[0],
      a = e.end ? e.end.toISOString().split('T')[0] : t
    ;(this.modalHandler.show('addEventModal', { start_date: t, end_date: a }), this.calendar.unselect())
  }
  handleEventClick(e) {
    const t = e.event,
      a = {
        id: t.id,
        title: t.title,
        description: t.extendedProps.description,
        type: t.extendedProps.type,
        start_date: t.start.toISOString().split('T')[0],
        end_date: t.end ? t.end.toISOString().split('T')[0] : t.start.toISOString().split('T')[0],
        start_time: t.start.toTimeString().split(' ')[0].substring(0, 5),
        end_time: t.end ? t.end.toTimeString().split(' ')[0].substring(0, 5) : '',
        location: t.extendedProps.location,
        organizer: t.extendedProps.organizer,
        priority: t.extendedProps.priority,
        is_all_day: t.allDay
      }
    this.showEventDetails(a)
  }
  async handleEventDrop(e) {
    const t = e.event,
      a = t.start.toISOString().split('T')[0],
      i = t.end ? t.end.toISOString().split('T')[0] : a
    try {
      const s = await this.ajaxHandler.put(`/calendar/${t.id}`, { start_date: a, end_date: i })
      s.success
        ? (this.notificationManager.success('Event moved successfully'),
          this.updateEventData(t.id, { start_date: a, end_date: i }))
        : (e.revert(), this.notificationManager.showResponse(s))
    } catch {
      ;(e.revert(), this.notificationManager.error('Failed to move event'))
    }
  }
  async handleEventResize(e) {
    const t = e.event,
      a = t.end ? t.end.toISOString().split('T')[0] : t.start.toISOString().split('T')[0]
    try {
      const i = await this.ajaxHandler.put(`/calendar/${t.id}`, { end_date: a })
      i.success
        ? (this.notificationManager.success('Event duration updated'), this.updateEventData(t.id, { end_date: a }))
        : (e.revert(), this.notificationManager.showResponse(i))
    } catch {
      ;(e.revert(), this.notificationManager.error('Failed to resize event'))
    }
  }
  handleDatesSet(e) {
    const t = e.view.type,
      a = e.view.currentStart
    console.log('Calendar view changed:', t, a)
  }
  showEventDetails(e) {
    let t = document.getElementById('eventDetailsModal')
    ;(t || (this.createEventDetailsModal(), (t = document.getElementById('eventDetailsModal'))),
      this.populateEventDetailsModal(e),
      this.modalHandler.show('eventDetailsModal'))
  }
  createEventDetailsModal() {
    ;(document.body.insertAdjacentHTML(
      'beforeend',
      `
            <div class="modal fade" id="eventDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="eventDetailsTitle">Event Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="eventDetailsBody">
                            <!-- Content will be populated dynamically -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="editEventBtn">Edit Event</button>
                            <button type="button" class="btn btn-danger" id="deleteEventBtn">Delete Event</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    ),
      this.modalHandler.register('eventDetailsModal'))
  }
  populateEventDetailsModal(e) {
    const t = document.getElementById('eventDetailsTitle'),
      a = document.getElementById('eventDetailsBody'),
      i = document.getElementById('editEventBtn'),
      s = document.getElementById('deleteEventBtn')
    ;(t && (t.textContent = e.title),
      a &&
        (a.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <dl class="row">
                            <dt class="col-5">Type:</dt>
                            <dd class="col-7"><span class="badge bg-primary">${e.type}</span></dd>
                            <dt class="col-5">Start Date:</dt>
                            <dd class="col-7">${e.start_date}</dd>
                            <dt class="col-5">End Date:</dt>
                            <dd class="col-7">${e.end_date}</dd>
                            ${e.start_time ? `<dt class="col-5">Start Time:</dt><dd class="col-7">${e.start_time}</dd>` : ''}
                            ${e.end_time ? `<dt class="col-5">End Time:</dt><dd class="col-7">${e.end_time}</dd>` : ''}
                        </dl>
                    </div>
                    <div class="col-md-6">
                        <dl class="row">
                            ${e.location ? `<dt class="col-5">Location:</dt><dd class="col-7">${e.location}</dd>` : ''}
                            ${e.organizer ? `<dt class="col-5">Organizer:</dt><dd class="col-7">${e.organizer}</dd>` : ''}
                            <dt class="col-5">Priority:</dt>
                            <dd class="col-7"><span class="badge bg-${this.getPriorityColor(e.priority)}">${e.priority}</span></dd>
                            <dt class="col-5">All Day:</dt>
                            <dd class="col-7">${e.is_all_day ? 'Yes' : 'No'}</dd>
                        </dl>
                    </div>
                </div>
                ${e.description ? `<div class="mt-3"><strong>Description:</strong><p class="mt-2">${e.description}</p></div>` : ''}
            `),
      i && (i.onclick = () => this.editEvent(e)),
      s && (s.onclick = () => this.deleteEvent(e.id, e.title)))
  }
  getPriorityColor(e) {
    return { low: 'success', medium: 'warning', high: 'danger', urgent: 'dark' }[e] || 'secondary'
  }
  editEvent(e) {
    ;(this.modalHandler.hide('eventDetailsModal'), this.modalHandler.show('editEventModal', e))
  }
  async deleteEvent(e, t) {
    var i
    if (
      await this.modalHandler.showConfirmation({
        title: 'Delete Event',
        message: `Are you sure you want to delete "${t}"?`,
        confirmText: 'Delete',
        confirmClass: 'btn-danger'
      })
    )
      try {
        const s = await this.ajaxHandler.delete(`/calendar/${e}`)
        s.success
          ? (this.notificationManager.success('Event deleted successfully'),
            (i = this.calendar.getEventById(e)) == null || i.remove(),
            this.modalHandler.hide('eventDetailsModal'))
          : this.notificationManager.showResponse(s)
      } catch {
        this.notificationManager.error('Failed to delete event')
      }
  }
  async submitEventForm(e, t) {
    const a = this.modalHandler.getFormData(t)
    try {
      let i
      if (
        (e === 'create'
          ? (i = await this.ajaxHandler.post('/calendar', a))
          : (i = await this.ajaxHandler.put(`/calendar/${a.id}`, a)),
        i.success)
      )
        if (
          (this.notificationManager.success(`Event ${e === 'create' ? 'created' : 'updated'} successfully`),
          this.modalHandler.hide(`${e}EventModal`),
          e === 'create')
        )
          this.calendar.addEvent(i.data.event)
        else {
          const s = this.calendar.getEventById(a.id)
          s &&
            (s.setProp('title', a.title),
            s.setStart(a.start_date),
            s.setEnd(a.end_date),
            s.setExtendedProp('description', a.description),
            s.setExtendedProp('type', a.type))
        }
      else this.notificationManager.showResponse(i)
    } catch {
      this.notificationManager.error(`Failed to ${e} event`)
    }
  }
  updateEventData(e, t) {
    const a = this.events.findIndex(i => i.id === e)
    a !== -1 && (this.events[a] = { ...this.events[a], ...t })
  }
  changeView(e) {
    this.calendar && this.calendar.changeView(e)
  }
  goToday() {
    this.calendar && this.calendar.today()
  }
  goPrev() {
    this.calendar && this.calendar.prev()
  }
  goNext() {
    this.calendar && this.calendar.next()
  }
  selectAllFilters() {
    ;(document.querySelectorAll('#calendar-filters input[type="checkbox"]').forEach(t => (t.checked = !0)),
      this.updateFilters())
  }
  clearAllFilters() {
    ;(document.querySelectorAll('#calendar-filters input[type="checkbox"]').forEach(t => (t.checked = !1)),
      this.updateFilters())
  }
  refreshCalendar() {
    this.calendar && this.calendar.refetchEvents()
  }
}
window.CalendarManager = d
