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
