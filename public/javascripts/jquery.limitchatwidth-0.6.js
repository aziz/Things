/**
 * limitCharWidth 0.6 - Limit inner text to adjust to container width
 *
 * history
 * : 2009-04-05 ver0.6 - Bugfix: previouse version hasn't work on IE.
 * : 2009-04-05 ver0.5 - Spaces at the end of collapsed string is trimed
						 Some code improvement
 * : 2009-03-04 ver0.4 - Now the container needs not necessarily to be set
						 whiteSpace to nowrap
 * : 2009-02-27 ver0.3 - Fixed a bug that occured when the target isn't a block
 * : 2009-02-01 ver0.2 - Fixed a bug that this didn't work on IE6 without width
						 parameter.
 * : 2009-01-28 ver0.1 - Initial release
 *
 * Copyright (c) 2008 Sugama Keita (http://jamadam.com/blog/)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

    var attr_name;
	
    $(document).ready(function(){
        
        attr_name =
            (typeof $('body').get(0).innerText != "undefined")
                ? 'innerText'
                :
            (typeof $('body').get(0).textContent != "undefined")
                ? 'textContent'
                : null;
    });
    
	$.fn.extend({

		unlimitCharWidth: function() {

			return $(this).each(function () {

				$(this).attr(attr_name, $.data(this, 'limitCharWidth'));
			});
		},

		limitCharWidth: function(args) {

			args =
				$.extend({
					alternative : '...',
					width       : null,
					set_title   : false
				}, args || {});

			return $(this).each(function () {

				var current = $(this).attr(attr_name);

				// Set original content to title
				if (! this.title && args.set_title) {
					this.title = $.trim(current);
				}

				// Save original data
				if (! $.data(this, 'limitCharWidth')) {
					$.data(this, 'limitCharWidth', current);
				}

				var org = $.data(this, 'limitCharWidth');

				var width = args.width;

				if (! width) {
					if ($(this).css('display') == 'block') {
						width = $(this).attr(attr_name, '').width();
					} else {
						return $(this);
					}
				}

				$(this).attr(attr_name, org);

				var oldWhiteSpaceSetting = $(this).css('whiteSpace');
				$(this).css({whiteSpace : 'nowrap'});

				var dummyspan = $(this).wrapInner('<span></span>').find('span');

				/*
				dummyspan.css({
					fontSize        : $(this).css('fontSize'),
					fontWeight      : $(this).css('fontWeight'),
					fontFamily      : $(this).css('fontFamily'),
					wordSpacing     : $(this).css('wordSpacing'),
					textIndent      : $(this).css('textIndent'),
					textTransform   : $(this).css('textTransform'),
					letterSpacing   : $(this).css('letterSpacing'),
					whiteSpace      : $(this).css('whiteSpace')
				});
				*/

				if (dummyspan.width() > width) {
					dummyspan.attr(attr_name,
						dummyspan.attr(attr_name) + args.alternative);
				}

				while (dummyspan.width() > width) {

					var newcontent =
						dummyspan.attr(attr_name)
							.slice(0, -1 * (args.alternative.length + 1));

					newcontent = $.trim(newcontent);

					if (newcontent) {
						dummyspan.attr(attr_name, newcontent + args.alternative);
					} else {
						dummyspan.attr(attr_name, '');
						break;
					}
				}

				$(this).css({whiteSpace : oldWhiteSpaceSetting});

				// remove dummy span
				$(this).attr(attr_name, dummyspan.attr(attr_name));
			});
		}
	});
})(jQuery);
