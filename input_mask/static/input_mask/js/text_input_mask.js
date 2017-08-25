// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function($, window, document, undefined) {

    "use strict";

    var pluginName = 'djangoInputMask';

    function Plugin(container, options) {
        this.container = container;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function() {
            $(this.container).find('[data-input-mask]').each(this.initInputMask);
            $(this.container).find('[data-money-mask]').each(this.initMoneyMask);
        },

        initInputMask: function() {
            var input = $(this),
                opts = input.attr('data-input-mask').replace(/&quot;/g, '"'),
                opts = JSON.parse(opts),
                mask = opts.mask;

            opts.placeholder = input.attr('placeholder');

            // maxlength causes a bug in jquery-maskedinput in android
            input.removeAttr('maxlength');
            input.mask(mask, opts);
        },

        initMoneyMask: function() {
            var input = $(this),
                opts = input.attr('data-money-mask').replace(/&quot;/g, '"'),
                opts = JSON.parse(opts);

            var value = input.val()
            if (value != '') {
                // Get decimals
                var decimal_separator = '.'
                if (value.indexOf(',') != -1) {
                    decimal_separator = ','
                }
                
                var decimals = value.substring(value.indexOf(decimal_separator) + 1)               
                var new_precision = decimals.length
                
                // Force precision
                if (!opts.precision) {
                    opts.precision = new_precision;
                }

                // Fix value with new precision
                if (opts.precision < new_precision) {
                    var new_value = value.substring(0, value.indexOf(decimal_separator)) + decimal_separator + decimals.substring(0, opts.precision)
                    input.val(new_value);
                }
            }

            // Brazil
            var lang = navigator.language || navigator.userLanguage;
            if (lang == "pt-BR") {
                if (!opts.thousands) {
                    opts.thousands = "."
                }

                if (!opts.decimal) {
                    opts.decimal = ","
                }
            }
            // Brazil - End
            
            input.maskMoney(opts);

            if (opts.allowZero || input.val() != '') {
                input.maskMoney('mask');
            }
        }
    });

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            new Plugin(this, options);
        });
    };

})(jQuery, window, document);


$(function() {
    $('body').djangoInputMask();
});