/**!
 * jQuery Tagging 1.0.0
 * @version: 1.0.0
 * @author: VINAY Kr. SHARMA http://www.vinay-sharma.com/
 * @date: 2013-04-03
 * @copyright: Copyright (c) 2013 VINAY Kr. SHARMA. All rights reserved.
 * @license: Licensed under Apache License v2.0. See http://www.apache.org/licenses/LICENSE-2.0
 * @website: http://www.vinay-sharma.com/
 */
;
(function($) {
    $.fn.tagging = function(o) {
        o = o || {};
        return this.each(function() {
            o = $.extend({
                className: 'tagging',
                nodeClass: 'tagging-node',
                target: null,
                name: 'tagged',
                beforeAdd: function(i) {
                    return true;
                },
                afterAdd: function(i) {
                    return true;
                },
                beforeRemove: function(i) {
                    return true;
                },
                afterRemove: function(i) {
                    return true;
                }
            }, o);
            var _t = $('<ul></ul>');
            var _i = $(this), __tags = [];

            // Copying property of source element to hidden field
            if (_i.attr('name')) {
                o.name = _i.attr('name');
                _i.attr('name', o.name + '_tagger');
            }
            _i.before(_t);
            _t.addClass(o.className);
            _t.append($('<li></li>').append(_i));


            /*
             * Binding keypress event to .tagging element's input which will
             * add current value as tag when 'Enter' key has pressed
             */
            _i.on('keypress', function(e) {
                var t = $(this);
                var code = (e.keyCode ? e.keyCode : e.which), v = t.val();
                if (v === '' && code === 8 && _t.find('li').length > 1) {
                    _t.find('li:last').prev().find('a').trigger('click');
                } else if (v === '' && code === 44) {
                    return false;
                } else if ((code === 13 || code === 44) && v !== '' && o.beforeAdd()) { //Enter keycode
                    _t.find('li:last').before('<li class="' + o.nodeClass + '">#' + v + '<a href="#" class="close" data-index="' + (_t.find('li').length - 1) + '">&times;</a></li>');
                    __tags.push(v);
                    var tv = o.target.val(), s = '';
                    if (tv) {
                        s = ',';
                    }
                    o.target.val(o.target.val() + s + v);
                    t.val('');
                    o.afterAdd();
                    return false;
                }
            });

            /*
             * Creating Hidden field which will keep all tags with comma
             * seperated or map to target field if found in configuration
             */
            if (o.target !== null) {
                if (typeof(o.target) === 'string' && o.target[0] === '#' && $(o.target).length !== 0) {
                    o.target = $(o.target);
                } // else [ leave as it is]
            } else {
                o.target = $('<input type="hidden" name="' + o.name + '">');
                _t.after(o.target);
            }

            /*
             * Binding event on document to remove taggig li node if clicked
             * to x
             */
            $(document).on('click', 'li.' + o.nodeClass + ' a', function() {
                var th = $(this), i = th.data('index'), ri = __tags[i];
                if (o.beforeRemove(ri)) {
                    th.parent().remove();
                    __tags.splice(i, 1);
                    o.target.val(__tags.join(','));
                    o.afterRemove(ri);
                }
                return false;
            });
            _t.on('click', function() {
                _i.focus();
            });
        });
    };
})(jQuery);
