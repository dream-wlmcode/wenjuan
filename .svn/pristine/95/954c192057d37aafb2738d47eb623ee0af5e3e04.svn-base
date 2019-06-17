/**
 * Select2 Chinese translation
 */
(function ($) {
    "use strict";
    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "???????"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "????" + n + "???";},
        formatInputTooLong: function (input, max) { var n = input.length - max; return "???" + n + "???";},
        formatSelectionTooBig: function (limit) { return "???????" + limit + "?"; },
        formatLoadMore: function (pageNumber) { return "?????..."; },
        formatSearching: function () { return "???..."; }
    });
})(jQuery);