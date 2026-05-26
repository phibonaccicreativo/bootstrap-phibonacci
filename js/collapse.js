/* ========================================================================
 * Bootstrap: collapse.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function (jQuery) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.jQueryelement      = jQuery(element)
    this.options       = jQuery.extend({}, Collapse.DEFAULTS, options)
    this.jQuerytrigger      = jQuery('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.jQueryparent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.jQueryelement, this.jQuerytrigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.4.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.jQueryelement.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.jQueryelement.hasClass('in')) return

    var activesData
    var actives = this.jQueryparent && this.jQueryparent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = jQuery.Event('show.bs.collapse')
    this.jQueryelement.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.jQueryelement
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.jQuerytrigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.jQueryelement
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.jQueryelement
        .trigger('shown.bs.collapse')
    }

    if (!jQuery.support.transition) return complete.call(this)

    var scrollSize = jQuery.camelCase(['scroll', dimension].join('-'))

    this.jQueryelement
      .one('bsTransitionEnd', jQuery.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.jQueryelement[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.jQueryelement.hasClass('in')) return

    var startEvent = jQuery.Event('hide.bs.collapse')
    this.jQueryelement.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.jQueryelement[dimension](this.jQueryelement[dimension]())[0].offsetHeight

    this.jQueryelement
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.jQuerytrigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.jQueryelement
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!jQuery.support.transition) return complete.call(this)

    this.jQueryelement
      [dimension](0)
      .one('bsTransitionEnd', jQuery.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.jQueryelement.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return jQuery(document).find(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each(jQuery.proxy(function (i, element) {
        var jQueryelement = jQuery(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger(jQueryelement), jQueryelement)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function (jQueryelement, jQuerytrigger) {
    var isOpen = jQueryelement.hasClass('in')

    jQueryelement.attr('aria-expanded', isOpen)
    jQuerytrigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger(jQuerytrigger) {
    var href
    var target = jQuerytrigger.attr('data-target')
      || (href = jQuerytrigger.attr('href')) && href.replace(/.*(?=#[^\s]+jQuery)/, '') // strip for ie7

    return jQuery(document).find(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.collapse')
      var options = jQuery.extend({}, Collapse.DEFAULTS, jQuerythis.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) jQuerythis.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = jQuery.fn.collapse

  jQuery.fn.collapse             = Plugin
  jQuery.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  jQuery.fn.collapse.noConflict = function () {
    jQuery.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  jQuery(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var jQuerythis   = jQuery(this)

    if (!jQuerythis.attr('data-target')) e.preventDefault()

    var jQuerytarget = getTargetFromTrigger(jQuerythis)
    var data    = jQuerytarget.data('bs.collapse')
    var option  = data ? 'toggle' : jQuerythis.data()

    Plugin.call(jQuerytarget, option)
  })

}(jQuery);
