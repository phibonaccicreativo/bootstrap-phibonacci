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
