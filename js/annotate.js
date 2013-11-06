//Jquery plugin based on dbushell's excelent demo:
//https://github.com/dbushell/Responsive-Off-Canvas-Menu

;(function ($, window, document, undefined) {   
    var pluginName = 'footnote';

    // normalize vendor prefixes
    var transition_prop = window.Modernizr.prefixed('transition'),
        transition_end = (function() {
          var props = {
              'WebkitTransition' : 'webkitTransitionEnd',
              'MozTransition'    : 'transitionend',
              'OTransition'      : 'oTransitionEnd otransitionend',
              'msTransition'     : 'MSTransitionEnd',
              'transition'       : 'transitionend'
          };
          return props.hasOwnProperty(transition_prop) ? props[transition_prop] : false;
      })();

    
    var defaults = {
           toggle: ".fn",
           nav_class: "notes-on", 
           wrapper: ".content-wrapper"
        };

    function Notarize(element, options) {   
        this.element = element;
        this.$el = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.is_nav_open = false; 
        this.init();
    }

    var $doc = $(document.documentElement);

    Notarize.prototype = {
        init: function () {
            $doc.addClass(this.settings.nav_class);
            this.buildContainer();
            $wrapper=$(this.settings.wrapper);
            this.addToggle(this.settings.toggle);
            //eventually, add ability to initialize swipe toggle here
            var notes = $(document).find('.note p');
            var arr = jQuery.makeArray(notes);
            $doc.addClass('notes-ready');
            //TODO: figure out how the heck to get this to load at the right time!!
            $('.fn').each (function(index){
              $(this).attr('data-index', index);
              var pos = ($(this).offset().top);
              var note = $(notes[index]);
              $(note).appendTo('.notes-container').offset({top: pos, left: 'auto'});
            });
        },
        buildContainer: function (target_menu) {
            offContent = '<div></div>';   
            $('body').children().wrapAll('<div class="content-wrapper">');
            $(offContent).addClass('notes-container').insertBefore('.content-wrapper');
        },
        addToggle: function (toggle) {
            var self = this;
            $(toggle).on('click.' + pluginName, function (e) {
                e.preventDefault();
                // var tag = this.tagName;
                // var index = $(tag).index(this); 
                // self.showNote(index);
                self.toggleNotes(e);
            });  
        },
        toggleNotes: function (e) {
            if (this.is_nav_open && $doc.hasClass(this.settings.nav_class)) {
              this.initCloseNote();
            } else {
              this.openNote(e);
            }
        },
        openNote: function (e) {
            $doc.addClass(this.settings.nav_class);
            $wrapper.width($doc.width() + 'px');
            this.is_nav_open = true;
            target = e.target;
            this.showNote(target);
            return false;
        },
        initCloseNote: function () {
            if (this.is_nav_open == true) {
              // close navigation after transition or immediately
              var duration = (transition_end && transition_prop) ? 
                parseFloat(window.getComputedStyle($wrapper[0], '')[transition_prop + 'Duration']) : 0;
              if (duration > 0) {
                $(document).on('transition', this.closeNote);
              } else {
                this.closeNote(null);
              }
            }
            $doc.removeClass(this.settings.nav_class);
            $('.notes-container p').removeClass('active');
        },
        closeNote: function(e) {
            if (e && e.target === $wrapper) {
              $(document).off(transition_end, this.closeNote);
            }
            this.is_nav_open = false;
            $wrapper.width('');
        },
        showNote: function(target) {
          var index = $(target).attr('data-index');
          $('.notes-container p:eq('+ index + ')').addClass('active');
        }
    };

    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Notarize( this, options ));
            }
        });
    };

})( jQuery, window, document );