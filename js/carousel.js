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
