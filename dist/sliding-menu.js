/*!
 * Sliding Menu Plugin 0.1.0
 * http://github.danielcardoso.net/sliding-menu/
 *
 * Authored by Daniel Cardoso
 * https://github.com/DanielCardoso
 *
 * Copyright 2014, Daniel Cardoso
 * @license : The MIT License (MIT)
 * http://opensource.org/licenses/MIT
 */
if (typeof jQuery === "undefined") {
    throw new Error("Sliding Menu requires jQuery");
}

(function (factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }

}(function ($) {
    "use strict";
    var SlidingMenu, slidingMenuUsedIds;

    SlidingMenu = window.SlidingMenu || {};
    slidingMenuUsedIds = window.slidingMenuUsedIds || [];

    SlidingMenu.VERSION = "0.1.0";
    SlidingMenu.TRANSITION_DURATION = 200;
    SlidingMenu.CLASS = "sliding-menu";
    SlidingMenu.DEFAULTS = {
        // A JSON object to build the menu from. Check our JSON example.
        dataJSON: false,
        // The link to the selected panel. Set to false to use the root panel
        initHref: false,
        // Label for the back button. Set to true to use the link's own label
        backLabel: "Back"
    };

    SlidingMenu.init = function (self, settings) {
        var menu, data, selectedElement, rootPanel, currentPanel;
        menu = $(self);

        if (menu.hasClass(SlidingMenu.CLASS)) {
            return;
        }

        if (settings.dataJSON) {
            data = SlidingMenu.processJSON(settings.dataJSON);
        } else {
            data = SlidingMenu.process(menu);
        }

        menu.empty().addClass(SlidingMenu.CLASS);

        if (settings.dataJSON) {
            $(data).each(function (index, item) {
                var panel;
                panel = $("<ul></ul>");

                if (item.root) {
                    rootPanel = "#" + item.id;
                }

                panel.attr("id", item.id);
                panel.addClass("menu-panel");

                $(item.children).each(function (index, item) {
                    var link, li;
                    link = $("<a></a>");

                    link.attr("class", item.styleClass);
                    link.attr("href", item.href);
                    link.text(item.label);

                    li = $("<li></li>");
                    li.append(link);
                    panel.append(li);
                });

                menu.append(panel);
            });
        } else {
            $(data).each(function (index, item) {
                var panel;
                panel = $(item);

                if (panel.hasClass("menu-panel-root")) {
                    rootPanel = "#" + panel.attr("id");
                }

                menu.append(item);
            });
        }

        rootPanel = $(rootPanel);
        rootPanel.addClass("menu-panel-root");
        currentPanel = rootPanel;
        menu.height(rootPanel.height());

        $("a", menu).on("click", function (e) {
            var href, label;
            href = $(this).attr("href");
            label = $(this).text();

            if (settings.initHref !== false) {
                currentPanel = $("#" + $(href).closest("ul").attr("id"));
                settings.initHref = false;
            }

            if (href.indexOf("#menu-panel") === 0) {
                var target, isBack;
                e.preventDefault();

                target = $(href);
                isBack = $(this).hasClass("back");

                $(".back", target).text(settings.backLabel === true ? label : settings.backLabel);

                if (currentPanel.attr("id") !== target.attr("id")) {
                    currentPanel.stop(true, true).animate({
                        left: isBack ? "100%" : "-100%"
                    }, SlidingMenu.TRANSITION_DURATION);

                    target.stop(true, true).css("left", isBack ? "-100%" : "100%").animate({
                        left: 0
                    }, SlidingMenu.TRANSITION_DURATION);

                    menu.stop(true, true).animate({
                        height: target.height()
                    }, SlidingMenu.TRANSITION_DURATION);
                } else {
                    target.css({
                        "left": 0
                    });
                    menu.height(target.height());
                }

                currentPanel = target;
            } else {
                menu.find("li.active").removeClass("active");
                $(this).closest("li").addClass("active");
            }
        });

        if (settings.initHref !== false) {
            selectedElement = menu.find("a[href=\"" + settings.initHref + "\"]");

            if (selectedElement.length !== 0) {
                selectedElement.closest("li").addClass("active");
                menu.find("a[href=\"" + SlidingMenu.getPanelLinker(menu, settings.initHref) + "\"]")
                    .trigger("click");
            } else {
                settings.initHref = false;
                currentPanel.css("left", 0);
            }

        } else {
            currentPanel.css("left", 0);
        }

        return this;
    };

    SlidingMenu.getPanelLinker = function (menu, href) {
        var linkerHref;
        linkerHref = "#" + $(menu).find("a[href=\"" + href + "\"]").closest("ul").attr("id");
        return linkerHref;
    };

    SlidingMenu.process = function (menu) {
        var ul, panels;
        ul = $("ul", menu);
        panels = [];

        $(ul).each(function (index, item) {
            var panel, handler, id;

            panel = $(item);
            handler = panel.prev();
            id = SlidingMenu.getNewId();

            if (handler.length === 1) {
                handler.addClass("nav").attr("href", "#menu-panel-" + id);
            }

            panel.attr("id", "menu-panel-" + id);

            if (index === 0) {
                panel.addClass("menu-panel-root");
            } else {
                panel.addClass("menu-panel");

                var li = $("<li></li>"),
                    back = $("<a></a>").addClass("back").attr({
                        "href": SlidingMenu.getPanelLinker(menu, "#menu-panel-" + id)
                    });
                li.append(back);
                panel.prepend(li);
            }

            panels.push(item);
        });

        return panels;
    };

    SlidingMenu.processJSON = function (data, parent) {
        var root = {
                id: "menu-panel-" + SlidingMenu.getNewId(),
                children: [],
                root: (parent ? false : true)
            },
            panels = [];

        if (parent) {
            root.children.push({
                styleClass: "back",
                href: "#" + parent.id
            });
        }

        $(data).each(function (index, item) {
            root.children.push(item);

            if (item.children) {
                var panel;

                panel = SlidingMenu.processJSON(item.children, root);
                item.href = "#" + panel[0].id;
                item.styleClass = "nav";
                panels = panels.concat(panel);
            }
        });

        return [root].concat(panels);
    };

    SlidingMenu.getNewId = function () {
        var id;

        do {
            id = Math.random().toString(36).substring(3, 8);
        } while (slidingMenuUsedIds.indexOf(id) >= 0);

        slidingMenuUsedIds.push(id);

        return id;
    };

    $.fn.slidingMenu = function (options) {
        this.each(function () {
            var settings;
            settings = $.extend({}, SlidingMenu.DEFAULTS, options);
            SlidingMenu.init(this, settings);
        });
    };
}));