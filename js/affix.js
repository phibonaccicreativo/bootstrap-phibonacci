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
