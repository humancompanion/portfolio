/*jslint browser: true, eqeq: true, nomen: true, plusplus: true, maxerr: 50, indent: 2, white: false */
/*global $ */

var $header = $('[data-object="header"]');

$header.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="header"]'),
    behavior = $el.attr('data-behavior'),
    state = $el.attr('data-state'),
    $target = $('.l-shell').find($el.attr('data-target'));

  $el.blur(); // Removes focus
  event.preventDefault();

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, target: $target, state: state});
  });
});

// ################## ACTIONS ###################
// Toggle the primary nav
$header.on('header.toggle-nav', function (event, opts) {
  var $canvas = $('body');

  $canvas.toggleClass('is-pushed');
  opts.el.toggleClass('is-open');
});

