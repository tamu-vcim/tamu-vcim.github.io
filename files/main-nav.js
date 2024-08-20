(function () {
    var lastSize, megamenuSearchFocus, prepNiceVideo, resizeHandler, thisSize, toggleGlobalMobileNav, toggleMediaContact, toggleMegamenu;
    toggleGlobalMobileNav = function () {
        return $('.main-nav__mobile-toggle button').on('click', function (e) {
            $('.megamenu-top-nav-univ').slideUp();
            $(this).toggleClass('active');
            return $('.mobile-nav').slideToggle();
        });
    };
    prepNiceVideo = function () {
        $('.nice-video button').on('click', function () {
            var $iframe, $wrapper, closure;
            $wrapper = $(this).parents('.nice-video');
            $wrapper.toggleClass('nice-video--playing');
            $iframe = $wrapper.find('iframe');
            closure = function () {
                return $iframe.attr({
                    'src': $iframe.attr('src').replace("autoplay=0", "autoplay=1")
                });
            };
            setTimeout(closure, 300);
        });
        return $('.nice-video').addClass('nice-video--ready');
    };
    toggleMediaContact = function () {
        return $('.media-contact button').on('click', function (e) {
            var mediaContact;
            mediaContact = $(this).parents('.media-contact');
            mediaContact.toggleClass('active');
            return mediaContact.find('.media-contact__drawer').slideToggle();
        });
    };

    toggleMegamenu = function () {
        var $megamenu, $megamenuItems;
        $megamenu = $('.megamenu');
        $megamenuItems = $('.main-header button[data-megamenu]');
        if ($megamenuItems.length < 1) {
            return;
        }
        $megamenuItems.attr({
            'aria-pressed': false
            , 'aria-expanded': false
        });
        $megamenuItems.map(function (i, el) {
            var $el;
            $el = $(el);
            return $el.attr({
                'aria-controls': $el.data('megamenu')
            });
        });
        return $('.main-header').on('click', 'button[data-megamenu]', function (e) {
            var $ctrl, $menuPane, $visiblePanes, targetMenu;
            $ctrl = $(this);
            targetMenu = $(this).data('megamenu');
            $menuPane = $('#' + targetMenu);
            $visiblePanes = $('.main-header .megamenu:visible');

            if ($ctrl.attr('aria-expanded') === 'false') {
                $('button[data-megamenu]').not($ctrl).attr({
                    'aria-pressed': false
                    , 'aria-expanded': false
                }).removeClass('active');

                $('[aria-controls=' + $ctrl.attr('aria-controls') + ']').attr({
                    'aria-pressed': true
                    , 'aria-expanded': true
                }).addClass('active');

                if ($visiblePanes.length > 0) {
                    $visiblePanes.slideUp(function () {
                        if ($ctrl.parents('.mobile-nav').length > 0) {
                            $('.main-header__megamenus').detach().insertAfter($ctrl);
                        }
                        return $menuPane.slideDown();
                    });
                } else {
                    if ($ctrl.parents('.mobile-nav').length > 0) {
                        $('.main-header__megamenus').detach().insertAfter($ctrl);
                    }
                    $menuPane.slideDown();
                }

                $('button.toggleSearch').blur(function (e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    if (e.currentTarget.getAttribute('aria-controls') === true) {
                        return $('input').find('#searchField').focus();
                    }
                });

                $ctrl.blur(function (e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    megamenuDropDown(targetMenu, $megamenuItems, $menuPane);
                });

                if (megamenuSearchFocus(targetMenu, e) === false)
                    return megamenuDropDown(targetMenu, $megamenuItems, $menuPane);
                else
                    return megamenuSearchFocus(targetMenu, e);

            } else {
                $megamenuItems.attr({
                    'aria-pressed': false
                    , 'aria-expanded': false
                }).removeClass('active');
                return $menuPane.slideUp();
            }
        });

    };

    megamenuSearchFocus = function (megamenu, h) {
        var returnState = false;
        if (megamenu.indexOf("search") > -1) {
            $('button[data-megamenu="search"]').on('keydown', function (j) {
                $('input').find('#searchField').focus();

                return $('div.megamenu__content').find("button[type='submit']").first().blur(function (g) {
                    $('header.main-header a.logo').first().focus();
                    $('.main-header button[data-megamenu="search"]').attr({
                        'aria-pressed': false
                        , 'aria-expanded': false
                    }).removeClass('active');
                    return $("#search").slideUp();
                });
            });
            returnState = true;
        }

        if (returnState === undefined) {
            returnState = false;
        }

        return returnState;
    };

    /*Start Function created for when a dropdown menu is open */
    megamenuDropDown = function (menuItem, menuItems, menuDropDown) {
        var nextmega;
        $('#' + menuItem).find('a').first().focus();
        nextmega = $('#' + menuItem).next('.megamenu').attr('id');

        if (nextmega) {
            return $('#' + menuItem).find('a').last().blur(function (f) {
                if (nextmega === 'search') {
                    $("nav.global-utility-nav a").first().focus();
                } else {
                    f.stopImmediatePropagation();
                    f.preventDefault();
                    $("button[data-megamenu='" + nextmega + "']").focus();
                }
                menuItems.attr({
                    'aria-pressed': false
                    , 'aria-expanded': false
                }).removeClass('active');
                return menuDropDown.slideUp();
            });
        } else {
            if ($('.mobile-nav').css("display") === "block") {
                return $('#' + menuItem).find('a').last().blur(function (f) {
                    $('.mobile-nav').find('a.mobile-nav--utility-link').first().focus();
                    menuItems.attr({
                        'aria-pressed': false
                        , 'aria-expanded': false
                    }).removeClass('active');
                    return menuDropDown.slideUp();
                });
            } else {
                return $('#' + menuItem).find('a').last().blur(function (f) {
                    if ($('main').find('button').first().get(0) !== undefined) {
                        $('main').find('button').first().focus();
                    }

                    if ($('div.alert__message').find('a').first().get(0) !== undefined) {
                        $('div.alert__message').find('a').first().focus();
                    } else {
                        if ($('main').find('a').first().get(0) !== undefined) {
                            $('main').find('a').first().focus();
                        }
                    }

                    menuItems.attr({
                        'aria-pressed': false
                        , 'aria-expanded': false
                    }).removeClass('active');

                    return menuDropDown.slideUp();
                });
            }
        }
    }
    /*end of Mega Menu Drop Down Function*/

    lastSize = 0;
    thisSize = 0;
    resizeHandler = function () {
        var $selectedMenus;
        lastSize = thisSize;
        thisSize = $(window).width();

        if (thisSize > 1024 && lastSize < 1024) {
            $('.mobile-nav').hide();
            $('.main-nav__mobile-toggle button').removeClass('active');
            return $('.main-header__megamenus').detach().insertAfter('.mobile-nav');
        } else if (thisSize < 1024 && lastSize > 1024) {
            $selectedMenus = $('.mobile-nav [aria-pressed=true]');
            if ($selectedMenus.length > 0) {
                $('.mobile-nav').show();
                return $('.main-header__megamenus').detach().insertAfter($selectedMenus);
            }
        }
    };

    $(document).ready(function () {
        var resizeDebounce;
        prepNiceVideo();
        toggleMegamenu();
        toggleMediaContact();
        toggleGlobalMobileNav();
        svg4everybody();
        resizeDebounce = 0;
        lastSize = thisSize = $(window).width();
        return $(window).on('resize', function (e) {
            clearTimeout(resizeDebounce);
            return resizeDebounce = setTimeout(resizeHandler, 300);
        });
    });
}).call(this);