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
