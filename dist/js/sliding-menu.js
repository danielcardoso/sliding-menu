/*! =========================================================
 * Sliding Menu v0.2.0
 * http://github.danielcardoso.net/sliding-menu/
 * ==========================================================
 * Copyright (c) 2014-2015 DanielCardoso.net.
 * Licensed under MIT.
 * ======================================================== */
if (typeof jQuery === 'undefined') {
    throw new Error('Sliding Menu requires jQuery');
}
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    'use strict';
    var slidingMenuUsedIds, SlidingMenu;

    slidingMenuUsedIds = [];

    SlidingMenu = function (element, options) {
        this.options = undefined;
        this.$el = undefined;
        this.currentPanel = undefined;

        this.init(element, options);
    };

    SlidingMenu.NAME = 'Sliding Menu';

    SlidingMenu.VERSION = '0.2.0';

    SlidingMenu.MAIN_CLASS = 'sliding-menu';

    SlidingMenu.PANEL_CLASS = SlidingMenu.MAIN_CLASS + '-panel';

    SlidingMenu.ICON_CLASS = SlidingMenu.MAIN_CLASS + '-icon';

    SlidingMenu.NAVIGATION_CLASS = SlidingMenu.MAIN_CLASS + '-nav';

    SlidingMenu.SET_ICON_CLASS = 'sm-set-icon';

    SlidingMenu.DEFAULTS = {
        // Adicional class for menu element
        className: '',
        // Default slide animation speed
        transitionDuration: 250,
        // A JSON object to build the menu from. Check our JSON example.
        dataJSON: false,
        // The link to the selected panel. Set to false to use the root panel
        initHref: false,
        // Label for the back button. Set to true to use the link's own label
        backLabel: 'Back'
    };

    SlidingMenu.prototype.init = function (element, options) {
        this.$el = $(element);

        if (this.$el.hasClass(SlidingMenu.MAIN_CLASS)) {
            return;
        }

        this.options = this.getOptions(options);
        this.events();
        this.process();
    };

    SlidingMenu.prototype.$ = function (selector) {
        return this.$el.find(selector);
    };

    SlidingMenu.prototype.events = function () {
        this.$el.on('click', 'a', $.proxy(this._onClickItem, this));
    };

    SlidingMenu.prototype._onClickItem = function (event) {
        var linker, targetPanel, movePanelTo;

        linker = $(event.currentTarget);

        if (linker.attr('data-id') !== undefined) {
            event.preventDefault();

            movePanelTo = linker.hasClass(SlidingMenu.MAIN_CLASS + '-back');
            targetPanel = this.$('.' + SlidingMenu.PANEL_CLASS + '[data-id="' + linker.attr('data-id') + '"]');

            if (this.currentPanel.attr('data-id') !== targetPanel.attr('data-id')) {
                this.currentPanel.stop(true, true).animate({
                    left: movePanelTo ? '100%' : '-100%'
                }, this.options.transitionDuration);

                targetPanel.stop(true, true).css('left', movePanelTo ? '-100%' : '100%').animate({
                    left: 0
                }, this.options.transitionDuration);

                this.$el.stop(true, true).animate({
                    height: targetPanel.height()
                }, this.options.transitionDuration);
            } else {
                targetPanel.css({
                    'left': 0
                });
                this.$el.height(targetPanel.height());
            }

            this.currentPanel = targetPanel;
        }

        if (!linker.hasClass(SlidingMenu.NAVIGATION_CLASS)) {
            this.$('li.active').removeClass('active');
            linker.closest('li').addClass('active');
        }
    };

    SlidingMenu.prototype.process = function () {
        var data;

        if (this.options.dataJSON) {
            data = this.processJSON(this.options.dataJSON);
        } else {
            data = this.processHTML();
        }

        this.setMenuContent(data);
    };

    SlidingMenu.prototype.setMenuContent = function (json) {
        var rootPanel;

        this.$el
            .empty()
            .addClass(SlidingMenu.MAIN_CLASS + ' ' + this.options.className);

        $(json).each($.proxy(function (index, item) {
            var panel;
            panel = $('<ul/>');

            if (item.root) {
                rootPanel = '.' + SlidingMenu.PANEL_CLASS + '[data-id="' + item.id + '"]';
            }

            // panel.attr('id', item.id);
            panel.attr('data-id', item.id);
            panel.addClass(SlidingMenu.PANEL_CLASS);

            $(item.children).each(function (index, item) {
                var li, link, icon;

                li = $('<li/>');

                if (item.separator !== true) {
                    link = $('<a/>');

                    link.attr({
                        'class': item.styleClass,
                        'href': item.href
                    });

                    if (item.panelId) {
                        link.attr('data-id', item.panelId);
                    }

                    link.text(item.label);

                    if (item.icon) {
                        icon = $('<i/>');
                        icon.addClass(SlidingMenu.ICON_CLASS + ' ' + item.icon);

                        link.prepend(icon);
                    }
                    li.append(link);
                } else {
                    li.addClass(SlidingMenu.MAIN_CLASS + '-separator');
                }

                panel.append(li);
            });

            this.$el.append(panel);
        }, this));

        rootPanel = this.$(rootPanel);

        rootPanel.addClass(SlidingMenu.PANEL_CLASS + '-root');
        this.currentPanel = rootPanel;

        if (this.options.initHref !== false) {
            this.changeVisiblePanel();
        } else {
            this.currentPanel.css('left', 0);
        }

        this.$el.height(this.currentPanel.height());
    };

    SlidingMenu.prototype.changeVisiblePanel = function () {
        var selectedLink, selectedPanel;

        selectedLink = this.getHyperlinkByHref(this.options.initHref)

        if (selectedLink.length !== 0) {
            selectedLink.closest('li').addClass('active');
            selectedPanel = this.getPanelByHref(this.options.initHref);
            this.currentPanel = selectedPanel;
        } else {
            console.warn(SlidingMenu.NAME + ': the link "' + this.options.initHref + '" does not exists. Please ' +
                'check the ' + (this.options.dataJSON !== false ? 'JSON object' : 'HTML structure') + '.');
        }

        this.options.initHref = false;
        this.currentPanel.css('left', 0);
    };

    SlidingMenu.prototype.processHTML = function (parentElem, parentObj, backLabel) {
        var root, panels;

        root = {
            id: SlidingMenu.PANEL_CLASS + '-' + this.getNewId(),
            root: parentElem ? false : true,
            children: []
        };
        panels = [];

        if (parentElem !== undefined) {
            root.children.push({
                panelId: parentObj.id,
                href: parentObj.id,
                label: this.options.backLabel === true ? backLabel : this.options.backLabel,
                styleClass: SlidingMenu.MAIN_CLASS + '-back ' + SlidingMenu.NAVIGATION_CLASS
            });
        } else {
            parentElem = this.$el.children('ul');
        }

        parentElem.children('li').each($.proxy(function (key, item) {
            var itemObj, itemLabel, panel, subPanel;

            item = $(item);

            if (!item.hasClass('separator')) {
                itemLabel = item.children('a');
                itemObj = {
                    icon: itemLabel.find('.' + SlidingMenu.SET_ICON_CLASS).attr('class') || undefined,
                    href: itemLabel.attr('href'),
                    label: this.trimWhiteSpaces(itemLabel.text())
                };

                if (itemObj.icon !== undefined) {
                    itemObj.icon = (itemObj.icon).replace(SlidingMenu.SET_ICON_CLASS, '');
                }

                subPanel = item.children('ul');
                if (subPanel.length !== 0) {
                    panel = this.processHTML(subPanel, root, itemObj.label);

                    itemObj.panelId = panel[0].id;
                    itemObj.styleClass = SlidingMenu.NAVIGATION_CLASS;
                    panels = panels.concat(panel);
                }
            } else {
                itemObj = {
                    separator: true
                };
            }

            root.children.push(itemObj);
        }, this));

        return [root].concat(panels);
    };

    SlidingMenu.prototype.processJSON = function (data, parent, backLabel) {
        var root, panels;

        root = {
            id: SlidingMenu.PANEL_CLASS + '-' + this.getNewId(),
            root: parent ? false : true,
            children: []
        };
        panels = [];

        if (parent) {
            root.children.push({
                panelId: parent.id,
                href: parent.id,
                label: this.options.backLabel === true ? backLabel : this.options.backLabel,
                styleClass: SlidingMenu.MAIN_CLASS + '-back ' + SlidingMenu.NAVIGATION_CLASS
            });
        }

        $(data).each($.proxy(function (index, item) {
            var panel;

            root.children.push(item);

            if (item.children) {
                panel = this.processJSON(item.children, root, item.label);
                item.panelId = panel[0].id;
                item.styleClass = SlidingMenu.NAVIGATION_CLASS;
                panels = panels.concat(panel);

                // Delete all childrens
                delete item.children;
            }
        }, this));

        return [root].concat(panels);
    };

    SlidingMenu.prototype.trimWhiteSpaces = function (text) {
        return text.trim();
    };

    SlidingMenu.prototype.getDefaults = function () {
        return SlidingMenu.DEFAULTS;
    };

    SlidingMenu.prototype.getOptions = function (options) {
        return $.extend({}, this.getDefaults(), this.$el.data(), options);
    };

    SlidingMenu.prototype.getHyperlinkByHref = function (href) {
        return this.$('a[href="' + href + '"]') || undefined;
    };

    SlidingMenu.prototype.getPanelByHref = function (href) {
        var linkElement = this.getHyperlinkByHref(href);
        return linkElement !== undefined ? linkElement.closest('ul') : undefined;
    };

    /**
     * Create a new ID
     * @return {Number} New id generated
     */
    SlidingMenu.prototype.getNewId = function () {
        var id;

        do {
            id = Math.random().toString(36).substring(2, 9);
        } while (slidingMenuUsedIds.indexOf(id) >= 0);

        slidingMenuUsedIds.push(id);

        return id;
    };

    // PLUGIN DEFINITION
    // =======================
    //
    function Plugin(option) {
        return this.each(function () {
            var $this, data, options;

            $this = $(this);
            data = $this.data('dc.slidingMenu');
            options = typeof option === 'object' && option;

            if (!data && /destroy|hide/.test(option)) {
                return;
            }
            if (!data) {
                $this.data('dc.slidingMenu', (data = new SlidingMenu(this, options)));
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    }

    var old = $.fn.slidingMenu;
    $.fn.slidingMenu = Plugin;
    $.fn.slidingMenu.Constructor = SlidingMenu;

    // SLIDINGMENU NO CONFLICT
    // =================

    $.fn.slidingMenu.noConflict = function () {
        $.fn.slidingMenu = old;
        return this;
    };
}));
