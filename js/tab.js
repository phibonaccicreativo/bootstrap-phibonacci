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
