/**
 * JS code may run in all pages in admin.
 *
 * @version 3.x.x
 */
//import Utils from './utils';
//import Test from './test';
;(function () {
    const $ = jQuery;

    const updateItemPreview = function updateItemPreview() {
        $.ajax({
            url: '',
            data: {
                'lp-ajax': 'toggle_item_preview',
                item_id: this.value,
                previewable: this.checked ? 'yes' : 'no',
                nonce: $(this).attr('data-nonce')
            },
            dataType: 'text',
            success: function (response) {
                response = LP.parseJSON(response);
            }
        });
    };

    /**
     * Callback event for button to creating pages inside error message.
     *
     * @param {Event} e
     */
    const createPages = function createPages(e) {
        var $button = $(this).addClass('disabled');
        e.preventDefault();
        $.post({
            url: $button.attr('href'),
            data: {
                'lp-ajax': 'create-pages'
            },
            dataType: 'text',
            success: function (res) {
                var $message = $button.closest('.error').html('<p>' + res + '</p>');
                setTimeout(function () {
                    $message.fadeOut()
                }, 2000);
            }
        });
    };

    const hideUpgradeMessage = function hideUpgradeMessage(e) {
        e.preventDefault();
        var $btn = $(this);
        $btn.closest('.lp-upgrade-notice').fadeOut();
        $.post({
            url: '',
            data: {
                'lp-hide-upgrade-message': 'yes'
            },
            success: function (res) {
            }
        });
    };

    const pluginActions = function pluginActions(e) {

        // Premium addon
        if ($(e.target).hasClass('buy-now')) {
            return;
        }

        e.preventDefault();

        var $plugin = $(this).closest('.plugin-card');
        if ($(this).hasClass('updating-message')) {
            return;
        }
        $(this).addClass('updating-message button-working disabled');
        $.ajax({
            url: $(this).attr('href'),
            data: {},
            success: function (r) {
                $.ajax({
                    url: window.location.href,
                    success: function (r) {
                        var $p = $(r).find('#' + $plugin.attr('id'));
                        if ($p.length) {
                            $plugin.replaceWith($p)
                        } else {
                            $plugin.find('.plugin-action-buttons a')
                                .removeClass('updating-message button-working')
                                .html(learn_press_admin_localize.plugin_installed);
                        }
                    }
                })
            }
        });
    };

    // const sendNewsletter = function sendNewsletter(e) {
    //     e.preventDefault();
    //     var $notice = $(e.target),
    //         context = $notice.attr('data-context');
    //     $(this).addClass('updating-message button-working disabled');
    //     $.ajax({
    //         url: '',
    //         data: {
    //             'lp-ajax': 'join_newsletter',
    //             context: context
    //         },
    //         success: function (response) {
    //             response = LP.parseJSON(response);
    //             $(this).removeClass('updating-message button-working');
    //             if (response.success) {
    //                 $('#learn-press-newsletter-button').fadeOut();
    //                 //alert(response.data);
    //             } else {
    //                 //alert(response.data);
    //             }
    //         }
    //     });
    // };

    const preventDefault = function preventDefault(e) {
        e.preventDefault();
        return false;
    };

    var onReady = function onReady() {

        $('.learn-press-dropdown-pages').LP('DropdownPages');
        $('.learn-press-advertisement-slider').LP('Advertisement', 'a', 's').appendTo($('#wpbody-content'));
        $('.learn-press-toggle-item-preview').on('change', updateItemPreview);
        $('.learn-press-tip').QuickTip();

        $(document)
            .on('click', '#learn-press-create-pages', createPages)
            .on('click', '.lp-upgrade-notice .close-notice', hideUpgradeMessage)
            .on('click', '.plugin-action-buttons a', pluginActions)
            .on('click', '[data-remove-confirm]', preventDefault)
            .on('mousedown', '.lp-sortable-handle', function (e) {
                $('html, body').addClass('lp-item-moving');
                $(e.target).closest('.lp-sortable-handle').css('cursor', 'inherit');
            })
            .on('mouseup', function (e) {
                $('html, body').removeClass('lp-item-moving');
                $('.lp-sortable-handle').css('cursor', '');
            });
    };

    $(document).ready(onReady)
})();