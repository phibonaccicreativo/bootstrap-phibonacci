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
