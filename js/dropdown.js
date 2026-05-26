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
