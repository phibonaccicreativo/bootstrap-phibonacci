/*!
 * Bootstrap 3, Maintained by Phibonacci Creativo v3.4.2-phibonacci.0 (https://www.phibonacci-creativo.com/)
 * Copyright 2011-2019 Twitter, Inc. (original), maintained by Phibonacci Creativo
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function (jQuery) {
  'use strict';
  var version = jQuery.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function (jQuery) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: https://modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // https://blog.alexmaccaw.com/css-transitions
  jQuery.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var jQueryel = this
    jQuery(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) jQuery(jQueryel).trigger(jQuery.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  jQuery(function () {
    jQuery.support.transition = transitionEnd()

    if (!jQuery.support.transition) return

    jQuery.event.special.bsTransitionEnd = {
      bindType: jQuery.support.transition.end,
      delegateType: jQuery.support.transition.end,
      handle: function (e) {
        if (jQuery(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function (jQuery) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    jQuery(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.4.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var jQuerythis    = jQuery(this)
    var selector = jQuerythis.attr('data-target')

    if (!selector) {
      selector = jQuerythis.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*jQuery)/, '') // strip for ie7
    }

    selector    = selector === '#' ? [] : selector
    var jQueryparent = jQuery(document).find(selector)

    if (e) e.preventDefault()

    if (!jQueryparent.length) {
      jQueryparent = jQuerythis.closest('.alert')
    }

    jQueryparent.trigger(e = jQuery.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    jQueryparent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      jQueryparent.detach().trigger('closed.bs.alert').remove()
    }

    jQuery.support.transition && jQueryparent.hasClass('fade') ?
      jQueryparent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis = jQuery(this)
      var data  = jQuerythis.data('bs.alert')

      if (!data) jQuerythis.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call(jQuerythis)
    })
  }

  var old = jQuery.fn.alert

  jQuery.fn.alert             = Plugin
  jQuery.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  jQuery.fn.alert.noConflict = function () {
    jQuery.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  jQuery(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.4.2
 * https://getbootstrap.com/docs/3.4/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

function sanitizeInput(input) {
  'use strict';

  if (!input) return input
  var tempDiv = document.createElement('div')
  tempDiv.textContent = input
  return tempDiv.innerHTML
}

+function (jQuery) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.jQueryelement  = jQuery(element)
    this.options   = jQuery.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.4.2'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var jQueryel  = this.jQueryelement
    var val  = jQueryel.is('input') ? 'val' : 'html'
    var data = jQueryel.data()

    state += 'Text'

    if (data.resetText == null) jQueryel.data('resetText', jQueryel[val]())

    // push to event loop to allow forms to submit
    setTimeout(jQuery.proxy(function () {
      jQueryel[val](data[state] == null ? this.options[state] : sanitizeInput(data[state]))

      if (state == 'loadingText') {
        this.isLoading = true
        jQueryel.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        jQueryel.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var jQueryparent = this.jQueryelement.closest('[data-toggle="buttons"]')

    if (jQueryparent.length) {
      var jQueryinput = this.jQueryelement.find('input')
      if (jQueryinput.prop('type') == 'radio') {
        if (jQueryinput.prop('checked')) changed = false
        jQueryparent.find('.active').removeClass('active')
        this.jQueryelement.addClass('active')
      } else if (jQueryinput.prop('type') == 'checkbox') {
        if ((jQueryinput.prop('checked')) !== this.jQueryelement.hasClass('active')) changed = false
        this.jQueryelement.toggleClass('active')
      }
      jQueryinput.prop('checked', this.jQueryelement.hasClass('active'))
      if (changed) jQueryinput.trigger('change')
    } else {
      this.jQueryelement.attr('aria-pressed', !this.jQueryelement.hasClass('active'))
      this.jQueryelement.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) jQuerythis.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = jQuery.fn.button

  jQuery.fn.button             = Plugin
  jQuery.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  jQuery.fn.button.noConflict = function () {
    jQuery.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  jQuery(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var jQuerybtn = jQuery(e.target).closest('.btn')
      Plugin.call(jQuerybtn, 'toggle')
      if (!(jQuery(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if (jQuerybtn.is('input,button')) jQuerybtn.trigger('focus')
        else jQuerybtn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      jQuery(e.target).closest('.btn').toggleClass('focus', /^focus(in)?jQuery/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function (jQuery) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.jQueryelement    = jQuery(element)
    this.jQueryindicators = this.jQueryelement.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.jQueryactive     = null
    this.jQueryitems      = null

    this.options.keyboard && this.jQueryelement.on('keydown.bs.carousel', jQuery.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.jQueryelement
      .on('mouseenter.bs.carousel', jQuery.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', jQuery.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.4.1'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval(jQuery.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.jQueryitems = item.parent().children('.item')
    return this.jQueryitems.index(item || this.jQueryactive)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.jQueryitems.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.jQueryitems.length
    return this.jQueryitems.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.jQueryactive = this.jQueryelement.find('.item.active'))

    if (pos > (this.jQueryitems.length - 1) || pos < 0) return

    if (this.sliding)       return this.jQueryelement.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.jQueryitems.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.jQueryelement.find('.next, .prev').length && jQuery.support.transition) {
      this.jQueryelement.trigger(jQuery.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var jQueryactive   = this.jQueryelement.find('.item.active')
    var jQuerynext     = next || this.getItemForDirection(type, jQueryactive)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if (jQuerynext.hasClass('active')) return (this.sliding = false)

    var relatedTarget = jQuerynext[0]
    var slideEvent = jQuery.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.jQueryelement.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.jQueryindicators.length) {
      this.jQueryindicators.find('.active').removeClass('active')
      var jQuerynextIndicator = jQuery(this.jQueryindicators.children()[this.getItemIndex(jQuerynext)])
      jQuerynextIndicator && jQuerynextIndicator.addClass('active')
    }

    var slidEvent = jQuery.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if (jQuery.support.transition && this.jQueryelement.hasClass('slide')) {
      jQuerynext.addClass(type)
      if (typeof jQuerynext === 'object' && jQuerynext.length) {
        jQuerynext[0].offsetWidth // force reflow
      }
      jQueryactive.addClass(direction)
      jQuerynext.addClass(direction)
      jQueryactive
        .one('bsTransitionEnd', function () {
          jQuerynext.removeClass([type, direction].join(' ')).addClass('active')
          jQueryactive.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.jQueryelement.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      jQueryactive.removeClass('active')
      jQuerynext.addClass('active')
      this.sliding = false
      this.jQueryelement.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.carousel')
      var options = jQuery.extend({}, Carousel.DEFAULTS, jQuerythis.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) jQuerythis.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = jQuery.fn.carousel

  jQuery.fn.carousel             = Plugin
  jQuery.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  jQuery.fn.carousel.noConflict = function () {
    jQuery.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var jQuerythis   = jQuery(this)
    var href    = jQuerythis.attr('href')
    if (href) {
      href = href.replace(/.*(?=#[^\s]+jQuery)/, '') // strip for ie7
    }

    var target  = jQuerythis.attr('data-target') || href
    var jQuerytarget = jQuery(document).find(target)

    if (!jQuerytarget.hasClass('carousel')) return

    var options = jQuery.extend({}, jQuerytarget.data(), jQuerythis.data())
    var slideIndex = jQuerythis.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call(jQuerytarget, options)

    if (slideIndex) {
      jQuerytarget.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  jQuery(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  jQuery(window).on('load', function () {
    jQuery('[data-ride="carousel"]').each(function () {
      var jQuerycarousel = jQuery(this)
      Plugin.call(jQuerycarousel, jQuerycarousel.data())
    })
  })

}(jQuery);

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

/* ========================================================================
 * Bootstrap: dropdown.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function (jQuery) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    jQuery(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.4.1'

  function getParent(jQuerythis) {
    var selector = jQuerythis.attr('data-target')

    if (!selector) {
      selector = jQuerythis.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*jQuery)/, '') // strip for ie7
    }

    var jQueryparent = selector !== '#' ? jQuery(document).find(selector) : null

    return jQueryparent && jQueryparent.length ? jQueryparent : jQuerythis.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    jQuery(backdrop).remove()
    jQuery(toggle).each(function () {
      var jQuerythis         = jQuery(this)
      var jQueryparent       = getParent(jQuerythis)
      var relatedTarget = { relatedTarget: this }

      if (!jQueryparent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && jQuery.contains(jQueryparent[0], e.target)) return

      jQueryparent.trigger(e = jQuery.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      jQuerythis.attr('aria-expanded', 'false')
      jQueryparent.removeClass('open').trigger(jQuery.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var jQuerythis = jQuery(this)

    if (jQuerythis.is('.disabled, :disabled')) return

    var jQueryparent  = getParent(jQuerythis)
    var isActive = jQueryparent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !jQueryparent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        jQuery(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter(jQuery(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      jQueryparent.trigger(e = jQuery.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      jQuerythis
        .trigger('focus')
        .attr('aria-expanded', 'true')

      jQueryparent
        .toggleClass('open')
        .trigger(jQuery.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var jQuerythis = jQuery(this)

    e.preventDefault()
    e.stopPropagation()

    if (jQuerythis.is('.disabled, :disabled')) return

    var jQueryparent  = getParent(jQuerythis)
    var isActive = jQueryparent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) jQueryparent.find(toggle).trigger('focus')
      return jQuerythis.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var jQueryitems = jQueryparent.find('.dropdown-menu' + desc)

    if (!jQueryitems.length) return

    var index = jQueryitems.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < jQueryitems.length - 1) index++         // down
    if (!~index)                                    index = 0

    jQueryitems.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis = jQuery(this)
      var data  = jQuerythis.data('bs.dropdown')

      if (!data) jQuerythis.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call(jQuerythis)
    })
  }

  var old = jQuery.fn.dropdown

  jQuery.fn.dropdown             = Plugin
  jQuery.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  jQuery.fn.dropdown.noConflict = function () {
    jQuery.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  jQuery(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#modals
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function (jQuery) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options = options
    this.jQuerybody = jQuery(document.body)
    this.jQueryelement = jQuery(element)
    this.jQuerydialog = this.jQueryelement.find('.modal-dialog')
    this.jQuerybackdrop = null
    this.isShown = null
    this.originalBodyPad = null
    this.scrollbarWidth = 0
    this.ignoreBackdropClick = false
    this.fixedContent = '.navbar-fixed-top, .navbar-fixed-bottom'

    if (this.options.remote) {
      this.jQueryelement
        .find('.modal-content')
        .load(this.options.remote, jQuery.proxy(function () {
          this.jQueryelement.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION = '3.4.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e = jQuery.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.jQueryelement.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.jQuerybody.addClass('modal-open')

    this.escape()
    this.resize()

    this.jQueryelement.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', jQuery.proxy(this.hide, this))

    this.jQuerydialog.on('mousedown.dismiss.bs.modal', function () {
      that.jQueryelement.one('mouseup.dismiss.bs.modal', function (e) {
        if (jQuery(e.target).is(that.jQueryelement)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = jQuery.support.transition && that.jQueryelement.hasClass('fade')

      if (!that.jQueryelement.parent().length) {
        that.jQueryelement.appendTo(that.jQuerybody) // don't move modals dom position
      }

      that.jQueryelement
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.jQueryelement[0].offsetWidth // force reflow
      }

      that.jQueryelement.addClass('in')

      that.enforceFocus()

      var e = jQuery.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.jQuerydialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.jQueryelement.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.jQueryelement.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = jQuery.Event('hide.bs.modal')

    this.jQueryelement.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    jQuery(document).off('focusin.bs.modal')

    this.jQueryelement
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.jQuerydialog.off('mousedown.dismiss.bs.modal')

    jQuery.support.transition && this.jQueryelement.hasClass('fade') ?
      this.jQueryelement
        .one('bsTransitionEnd', jQuery.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    jQuery(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', jQuery.proxy(function (e) {
        if (document !== e.target &&
          this.jQueryelement[0] !== e.target &&
          !this.jQueryelement.has(e.target).length) {
          this.jQueryelement.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.jQueryelement.on('keydown.dismiss.bs.modal', jQuery.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.jQueryelement.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      jQuery(window).on('resize.bs.modal', jQuery.proxy(this.handleUpdate, this))
    } else {
      jQuery(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.jQueryelement.hide()
    this.backdrop(function () {
      that.jQuerybody.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.jQueryelement.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.jQuerybackdrop && this.jQuerybackdrop.remove()
    this.jQuerybackdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.jQueryelement.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = jQuery.support.transition && animate

      this.jQuerybackdrop = jQuery(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.jQuerybody)

      this.jQueryelement.on('click.dismiss.bs.modal', jQuery.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.jQueryelement[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.jQuerybackdrop[0].offsetWidth // force reflow

      this.jQuerybackdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.jQuerybackdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.jQuerybackdrop) {
      this.jQuerybackdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      jQuery.support.transition && this.jQueryelement.hasClass('fade') ?
        this.jQuerybackdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.jQueryelement[0].scrollHeight > document.documentElement.clientHeight

    this.jQueryelement.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.jQueryelement.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.jQuerybody.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    var scrollbarWidth = this.scrollbarWidth
    if (this.bodyIsOverflowing) {
      this.jQuerybody.css('padding-right', bodyPad + scrollbarWidth)
      jQuery(this.fixedContent).each(function (index, element) {
        var actualPadding = element.style.paddingRight
        var calculatedPadding = jQuery(element).css('padding-right')
        jQuery(element)
          .data('padding-right', actualPadding)
          .css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px')
      })
    }
  }

  Modal.prototype.resetScrollbar = function () {
    this.jQuerybody.css('padding-right', this.originalBodyPad)
    jQuery(this.fixedContent).each(function (index, element) {
      var padding = jQuery(element).data('padding-right')
      jQuery(element).removeData('padding-right')
      element.style.paddingRight = padding ? padding : ''
    })
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.jQuerybody.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.jQuerybody[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var jQuerythis = jQuery(this)
      var data = jQuerythis.data('bs.modal')
      var options = jQuery.extend({}, Modal.DEFAULTS, jQuerythis.data(), typeof option == 'object' && option)

      if (!data) jQuerythis.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = jQuery.fn.modal

  jQuery.fn.modal = Plugin
  jQuery.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  jQuery.fn.modal.noConflict = function () {
    jQuery.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  jQuery(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var jQuerythis = jQuery(this)
    var href = jQuerythis.attr('href')
    var target = jQuerythis.attr('data-target') ||
      (href && href.replace(/.*(?=#[^\s]+jQuery)/, '')) // strip for ie7

    var jQuerytarget = jQuery(document).find(target)
    var option = jQuerytarget.data('bs.modal') ? 'toggle' : jQuery.extend({ remote: !/#/.test(href) && href }, jQuerytarget.data(), jQuerythis.data())

    if (jQuerythis.is('a')) e.preventDefault()

    jQuerytarget.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      jQuerytarget.one('hidden.bs.modal', function () {
        jQuerythis.is(':visible') && jQuerythis.trigger('focus')
      })
    })
    Plugin.call(jQuerytarget, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.4.3
 * https://getbootstrap.com/docs/3.4/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function (jQuery) {
  'use strict';

  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn']

  var uriAttrs = [
    'background',
    'cite',
    'href',
    'itemtype',
    'longdesc',
    'poster',
    'src',
    'xlink:href'
  ]

  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*jQuery/i

  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  }

  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|jQuery))/gi

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*jQuery/i

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase()

    if (jQuery.inArray(attrName, allowedAttributeList) !== -1) {
      if (jQuery.inArray(attrName, uriAttrs) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN))
      }

      return true
    }

    var regExp = jQuery(allowedAttributeList).filter(function (index, value) {
      return value instanceof RegExp
    })

    // Check if a regular expression validates the attribute.
    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true
      }
    }

    return false
  }

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.jQueryelement   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.4.3'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    },
    sanitize : true,
    sanitizeFn : null,
    whiteList : DefaultWhitelist
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.jQueryelement  = jQuery(element)
    this.options   = this.getOptions(options)
    this.jQueryviewport = this.options.viewport && jQuery(document).find(jQuery.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.jQueryelement) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.jQueryelement[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.jQueryelement.on('click.' + this.type, this.options.selector, jQuery.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.jQueryelement.on(eventIn  + '.' + this.type, this.options.selector, jQuery.proxy(this.enter, this))
        this.jQueryelement.on(eventOut + '.' + this.type, this.options.selector, jQuery.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = jQuery.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.sanitizeHtml = function (unsafeHtml, whiteList) {
    if (!unsafeHtml) return ''

    whiteList = whiteList || {
      a: ['href', 'title', 'target', 'rel'],
      b: [], strong: [], i: [], em: [], u: [],
      p: [], br: [], ul: [], ol: [], li: [],
      span: ['title'], div: ['class', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height']
    }

    var allowedProtocols = /^(https?|mailto|tel):/i

    // Parse inertly using <template>, avoids execution
    var template = document.createElement('template')
    template.innerHTML = unsafeHtml
    var content = template.content || template

    function clean(node) {
      switch (node.nodeType) {
        case Node.TEXT_NODE:
          return document.createTextNode(node.nodeValue)
        case Node.ELEMENT_NODE:
          var tag = node.nodeName.toLowerCase()
          if (!whiteList[tag]) {
            // unwrap non-whitelisted tags
            var frag = document.createDocumentFragment()
            for (var c = node.firstChild; c; c = c.nextSibling) {
              var cleaned = clean(c)
              if (cleaned) frag.appendChild(cleaned)
            }
            return frag
          }

          var el = document.createElement(tag)
          var attrs = whiteList[tag]
          for (var i = 0; i < node.attributes.length; i++) {
            var attr = node.attributes[i]
            var name = attr.name.toLowerCase()
            var val = attr.value

            // block inline event handlers
            if (name.indexOf('on') === 0) continue

            if (attrs.indexOf(name) !== -1) {
              if ((name === 'href' || name === 'src')) {
                var vtrim = val.trim()
                if (allowedProtocols.test(vtrim) || vtrim.startsWith('/') || vtrim.startsWith('.')) {
                  el.setAttribute(name, vtrim)
                }
              } else {
                el.setAttribute(name, val)
              }
            }
          }

          for (var c2 = node.firstChild; c2; c2 = c2.nextSibling) {
            var cleanedChild = clean(c2)
            if (cleanedChild) el.appendChild(cleanedChild)
          }
          return el
      }
      return null
    }

    var frag = document.createDocumentFragment()
    for (var child = content.firstChild; child; child = child.nextSibling) {
      var cleaned = clean(child)
      if (cleaned) frag.appendChild(cleaned)
    }

    var wrapper = document.createElement('div')
    wrapper.appendChild(frag)
    return wrapper.innerHTML
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    var dataAttributes = this.jQueryelement.data()

    for (var dataAttr in dataAttributes) {
      if (dataAttributes.hasOwnProperty(dataAttr) && jQuery.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) {
        delete dataAttributes[dataAttr]
      }
    }

    options = jQuery.extend({}, this.getDefaults(), dataAttributes, options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    if (options.sanitize) {
      options.template = this.sanitizeHtml(options.template, options.whiteList)
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && jQuery.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : jQuery(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      jQuery(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof jQuery.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : jQuery(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      jQuery(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof jQuery.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = jQuery.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.jQueryelement.trigger(e)

      var inDom = jQuery.contains(this.jQueryelement[0].ownerDocument.documentElement, this.jQueryelement[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var jQuerytip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      jQuerytip.attr('id', tipId)
      this.jQueryelement.attr('aria-describedby', tipId)

      if (this.options.animation) jQuerytip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, jQuerytip[0], this.jQueryelement[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      jQuerytip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? jQuerytip.appendTo(jQuery(document).find(this.options.container)) : jQuerytip.insertAfter(this.jQueryelement)
      this.jQueryelement.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = jQuerytip[0].offsetWidth
      var actualHeight = jQuerytip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.jQueryviewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        jQuerytip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.jQueryelement.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      jQuery.support.transition && this.jQuerytip.hasClass('fade') ?
        jQuerytip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var jQuerytip   = this.tip()
    var width  = jQuerytip[0].offsetWidth
    var height = jQuerytip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt(jQuerytip.css('margin-top'), 10)
    var marginLeft = parseInt(jQuerytip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // jQuery.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    jQuery.offset.setOffset(jQuerytip[0], jQuery.extend({
      using: function (props) {
        jQuerytip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    jQuerytip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = jQuerytip[0].offsetWidth
    var actualHeight = jQuerytip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    jQuerytip.offset(offset)
    this.replaceArrow(arrowDelta, jQuerytip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var jQuerytip  = this.tip()
    var title = this.getTitle()

    if (this.options.html) {
      if (this.options.sanitize) {
        title = this.sanitizeHtml(title, this.options.whiteList)
      }

      jQuerytip.find('.tooltip-inner').html(title)
    } else {
      jQuerytip.find('.tooltip-inner').text(title)
    }

    jQuerytip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var jQuerytip = jQuery(this.jQuerytip)
    var e    = jQuery.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') jQuerytip.detach()
      if (that.jQueryelement) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.jQueryelement
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.jQueryelement.trigger(e)

    if (e.isDefaultPrevented()) return

    jQuerytip.removeClass('in')

    jQuery.support.transition && jQuerytip.hasClass('fade') ?
      jQuerytip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var jQuerye = this.jQueryelement
    if (jQuerye.attr('title') || typeof jQuerye.attr('data-original-title') != 'string') {
      jQuerye.attr('data-original-title', jQuerye.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function (jQueryelement) {
    jQueryelement   = jQueryelement || this.jQueryelement

    var el     = jQueryelement[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = jQuery.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using jQuery.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : jQueryelement.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : jQueryelement.scrollTop() }
    var outerDims = isBody ? { width: jQuery(window).width(), height: jQuery(window).height() } : null

    return jQuery.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.jQueryviewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.jQueryviewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var jQuerye = this.jQueryelement
    var o  = this.options

    title = jQuerye.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call(jQuerye[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.jQuerytip) {
      this.jQuerytip = jQuery(this.options.template)
      if (this.jQuerytip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.jQuerytip
  }

  Tooltip.prototype.arrow = function () {
    return (this.jQueryarrow = this.jQueryarrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = jQuery(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        jQuery(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.jQueryelement.off('.' + that.type).removeData('bs.' + that.type)
      if (that.jQuerytip) {
        that.jQuerytip.detach()
      }
      that.jQuerytip = null
      that.jQueryarrow = null
      that.jQueryviewport = null
      that.jQueryelement = null
    })
  }

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) jQuerythis.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = jQuery.fn.tooltip

  jQuery.fn.tooltip             = Plugin
  jQuery.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  jQuery.fn.tooltip.noConflict = function () {
    jQuery.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function (jQuery) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!jQuery.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.4.1'

  Popover.DEFAULTS = jQuery.extend({}, jQuery.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = jQuery.extend({}, jQuery.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var jQuerytip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    if (this.options.html) {
      var typeContent = typeof content

      if (this.options.sanitize) {
        title = this.sanitizeHtml(title)

        if (typeContent === 'string') {
          content = this.sanitizeHtml(content)
        }
      }

      jQuerytip.find('.popover-title').html(title)
      jQuerytip.find('.popover-content').children().detach().end()[
        typeContent === 'string' ? 'html' : 'append'
      ](content)
    } else {
      jQuerytip.find('.popover-title').text(title)
      jQuerytip.find('.popover-content').children().detach().end().text(content)
    }

    jQuerytip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!jQuerytip.find('.popover-title').html()) jQuerytip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var jQuerye = this.jQueryelement
    var o  = this.options

    return jQuerye.attr('data-content')
      || (typeof o.content == 'function' ?
        o.content.call(jQuerye[0]) :
        o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.jQueryarrow = this.jQueryarrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) jQuerythis.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = jQuery.fn.popover

  jQuery.fn.popover             = Plugin
  jQuery.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  jQuery.fn.popover.noConflict = function () {
    jQuery.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function (jQuery) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.jQuerybody          = jQuery(document.body)
    this.jQueryscrollElement = jQuery(element).is(document.body) ? jQuery(window) : jQuery(element)
    this.options        = jQuery.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.jQueryscrollElement.on('scroll.bs.scrollspy', jQuery.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.4.1'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.jQueryscrollElement[0].scrollHeight || Math.max(this.jQuerybody[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!jQuery.isWindow(this.jQueryscrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.jQueryscrollElement.scrollTop()
    }

    this.jQuerybody
      .find(this.selector)
      .map(function () {
        var jQueryel   = jQuery(this)
        var href  = jQueryel.data('target') || jQueryel.attr('href')
        var jQueryhref = /^#./.test(href) && jQuery(href)

        return (jQueryhref
          && jQueryhref.length
          && jQueryhref.is(':visible')
          && [[jQueryhref[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.jQueryscrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.jQueryscrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = jQuery(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    jQuery(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) jQuerythis.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = jQuery.fn.scrollspy

  jQuery.fn.scrollspy             = Plugin
  jQuery.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  jQuery.fn.scrollspy.noConflict = function () {
    jQuery.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  jQuery(window).on('load.bs.scrollspy.data-api', function () {
    jQuery('[data-spy="scroll"]').each(function () {
      var jQueryspy = jQuery(this)
      Plugin.call(jQueryspy, jQueryspy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function (jQuery) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = jQuery(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.4.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var jQuerythis    = this.element
    var jQueryul      = jQuerythis.closest('ul:not(.dropdown-menu)')
    var selector = jQuerythis.data('target')

    if (!selector) {
      selector = jQuerythis.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*jQuery)/, '') // strip for ie7
    }

    if (jQuerythis.parent('li').hasClass('active')) return

    var jQueryprevious = jQueryul.find('.active:last a')
    var hideEvent = jQuery.Event('hide.bs.tab', {
      relatedTarget: jQuerythis[0]
    })
    var showEvent = jQuery.Event('show.bs.tab', {
      relatedTarget: jQueryprevious[0]
    })

    jQueryprevious.trigger(hideEvent)
    jQuerythis.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var jQuerytarget = jQuery(document).find(selector)

    this.activate(jQuerythis.closest('li'), jQueryul)
    this.activate(jQuerytarget, jQuerytarget.parent(), function () {
      jQueryprevious.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: jQuerythis[0]
      })
      jQuerythis.trigger({
        type: 'shown.bs.tab',
        relatedTarget: jQueryprevious[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var jQueryactive    = container.find('> .active')
    var transition = callback
      && jQuery.support.transition
      && (jQueryactive.length && jQueryactive.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      jQueryactive
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
        .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
        .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
          .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)
      }

      callback && callback()
    }

    jQueryactive.length && transition ?
      jQueryactive
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    jQueryactive.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis = jQuery(this)
      var data  = jQuerythis.data('bs.tab')

      if (!data) jQuerythis.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = jQuery.fn.tab

  jQuery.fn.tab             = Plugin
  jQuery.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  jQuery.fn.tab.noConflict = function () {
    jQuery.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call(jQuery(this), 'show')
  }

  jQuery(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#affix
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function (jQuery) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = jQuery.extend({}, Affix.DEFAULTS, options)

    var target = this.options.target === Affix.DEFAULTS.target ? jQuery(this.options.target) : jQuery(document).find(this.options.target)

    this.jQuerytarget = target
      .on('scroll.bs.affix.data-api', jQuery.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  jQuery.proxy(this.checkPositionWithEventLoop, this))

    this.jQueryelement     = jQuery(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.4.1'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.jQuerytarget.scrollTop()
    var position     = this.jQueryelement.offset()
    var targetHeight = this.jQuerytarget.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.jQueryelement.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.jQuerytarget.scrollTop()
    var position  = this.jQueryelement.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout(jQuery.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.jQueryelement.is(':visible')) return

    var height       = this.jQueryelement.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max(jQuery(document).height(), jQuery(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.jQueryelement)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.jQueryelement)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.jQueryelement.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = jQuery.Event(affixType + '.bs.affix')

      this.jQueryelement.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.jQueryelement
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.jQueryelement.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) jQuerythis.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = jQuery.fn.affix

  jQuery.fn.affix             = Plugin
  jQuery.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  jQuery.fn.affix.noConflict = function () {
    jQuery.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  jQuery(window).on('load', function () {
    jQuery('[data-spy="affix"]').each(function () {
      var jQueryspy = jQuery(this)
      var data = jQueryspy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call(jQueryspy, data)
    })
  })

}(jQuery);
