/*
 *  Sliding Menu Plugin
 *  Mobile app list-style navigation in the browser
 *
 *  Written by Daniel Cardoso
 *  http://github.danielcardoso.net/sliding-menu
 *
 */
(function ($) {
    "use strict";
    var slidingMenuUsedIds = [];

    $.fn.slidingMenu = function (options) {
        var settings = $.extend({
            dataJSON: false,
            initHref: false,
            backLabel: "Back"
        }, options);

        return this.each(function () {
            var self = this,
                menu = $(self),
                data,
                selectedElement;

            if (menu.hasClass("sliding-menu")) {
                return;
            }

            if (settings.dataJSON) {
                data = processJSON(settings.dataJSON);
            } else {
                data = process(menu);
            }

            menu.empty().addClass("sliding-menu");

            var rootPanel;

            if (settings.dataJSON) {
                $(data).each(function (index, item) {
                    var panel = $("<ul></ul>");

                    if (item.root) {
                        rootPanel = "#" + item.id;
                    }

                    panel.attr("id", item.id);
                    panel.addClass("menu-panel");

                    $(item.children).each(function (index, item) {
                        var link = $("<a></a>");

                        link.attr("class", item.styleClass);
                        link.attr("href", item.href);
                        link.text(item.label);

                        var li = $("<li></li>");

                        li.append(link);
                        panel.append(li);
                    });

                    menu.append(panel);

                });
            } else {
                $(data).each(function (index, item) {
                    var panel = $(item);

                    if (panel.hasClass("menu-panel-root")) {
                        rootPanel = "#" + panel.attr("id");
                    }

                    menu.append(item);
                });
            }

            rootPanel = $(rootPanel);
            rootPanel.addClass("menu-panel-root");

            var currentPanel = rootPanel;

            menu.height(rootPanel.height());

            $("a", menu).on("click", function (e) {
                var href = $(this).attr("href"),
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
                        }, "fast");

                        target.stop(true, true).css("left", isBack ? "-100%" : "100%").animate({
                            left: 0
                        }, "fast");

                        menu.stop(true, true).animate({
                            height: target.height()
                        }, "fast");
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
                    menu.find("a[href=\"" + getPanelLinker(menu, settings.initHref) + "\"]")
                        .trigger("click");
                } else {
                    settings.initHref = false;
                    currentPanel.css("left", 0);
                }

            } else {
                currentPanel.css("left", 0);
            }

            return this;
        });

        function getPanelLinker (menu, href) {
            var linkerHref;
            linkerHref = "#" + $(menu).find("a[href=\"" + href + "\"]").closest("ul").attr("id");
            return linkerHref;
        }

        function process(menu) {
            var ul = $("ul", menu),
                panels = [];

            $(ul).each(function (index, item) {
                var panel = $(item),
                    handler = panel.prev(),
                    id = getNewId();

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
                            "href": getPanelLinker(menu, "#menu-panel-" + id)
                        });
                        li.append(back);
                    panel.prepend(li);
                }

                panels.push(item);

            });

            return panels;
        }

        function processJSON(data, parent) {
            var root = {
                    id: "menu-panel-" + getNewId(),
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
                    var panel = processJSON(item.children, root);

                    item.href = "#" + panel[0].id;
                    item.styleClass = "nav";

                    panels = panels.concat(panel);
                }
            });

            return [root].concat(panels);
        }

        function getNewId() {
            var id;

            do {
                id = Math.random().toString(36).substring(3, 8);
            } while (slidingMenuUsedIds.indexOf(id) >= 0);
            slidingMenuUsedIds.push(id);

            return id;
        }
    };
}(jQuery));