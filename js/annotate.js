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
        this.curr_index = 0;
        this.init();
    }

    var $doc = $(document.documentElement);

    Notarize.prototype = {
        init: function () {
            this.buildContainer();
            $wrapper=$(this.settings.wrapper);
            this.addToggle(this.settings.toggle);
            //eventually, add ability to initialize swipe toggle here
            $doc.addClass('notes-ready');
            //TODO: figure out how the heck to get this function to load at the right time!!
            //because the addClass should come dead last
            this.alignNotes();
            this.adjustColumn();   
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
                self.toggleNotes(e);
            });  
        },
        toggleNotes: function (e) {
          //TODO: find out why this.nav_is_open doesn't work here.
          //orig condition: if (this.is_nav_open && $doc.hasClass(this.settings.nav_class))
          index = $(e.target).attr('data-index');
            if ($doc.hasClass(this.settings.nav_class) && index==this.curr_index) {
              this.initCloseNotes();
            } else {
              this.openNotes(e);
            }
          $(e.target).toggleClass('active-note');
          $(e.target).parents('p').siblings('p').children('a').removeClass('active-note'); 
          $(e.target).siblings('a').removeClass('active-note'); 
        },
        openNotes: function (e) {
            $doc.addClass(this.settings.nav_class);
            $wrapper.width($doc.width() + 'px');
            this.is_nav_open = true;
            target = e.target;
            this.syncNote(target);
            return false;
        },
        initCloseNotes: function () {
            if (this.is_nav_open == true) {
              // close navigation after transition or immediately
              var duration = (transition_end && transition_prop) ? 
                parseFloat(window.getComputedStyle($wrapper[0], '')[transition_prop + 'Duration']) : 0;
              if (duration > 0) {
                $(document).on('transition', this.closeNotes);
              } else {
                this.closeNotes(null);
              }
            }
            $doc.removeClass(this.settings.nav_class);
            $('.notes-container p').removeClass('active');
        },
        closeNotes: function(e) {
            if (e && e.target === $wrapper) {
              $(document).off(transition_end, this.closeNotes);
            }
            this.is_nav_open = false;
            $wrapper.width('');
        },
        syncNote: function(target) {
          var index = $(target).attr('data-index');
          $('.notes-container p:eq('+ index + ')').addClass('active').siblings().removeClass('active');
          this.curr_index = index;
        },
        //Position sidebar notes to align with text citationss
        alignNotes: function() {
          var notes = $(document).find('.note p').clone();
          var arr = jQuery.makeArray(notes);
          $('.fn').each (function(index){
            $(this).attr('data-index', index);
            var pos = ($(this).offset().top);
            var note = $(notes[index]);
            $(note).appendTo('.notes-container').offset({top: pos, left: 'auto'});
            if (index !=0) {
              var prev_note = $(notes[index-1]);
              var prev_note_bottom = prev_note.offset().top + prev_note.height();
              if (note.offset().top <= prev_note_bottom) {
                note.offset({top: prev_note_bottom + 5, left: 'auto'});
              }
            } 
          });
        },
        //make sure notes column is tall enough to show all notes
        adjustColumn: function() {
          var last_note = $('.notes-container p').last();
          var rock_bottom = last_note.offset().top + last_note.height(); 
          $('.notes-container').css('min-height', rock_bottom + 'px')    
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