/*jslint browser: true, eqeq: true, nomen: true, plusplus: true, maxerr: 50, indent: 2, white: false */
/*global $ */

var $contact_card = $('[data-object="contact-card"]');

$contact_card.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="contact-card"]'),
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
$contact_card.on('contact-card.flip', function (event, opts) {
  opts.object.addClass('is-flipped');
});

$contact_card.on('contact-card.flip-revert', function (event, opts) {
  opts.object.removeClass('is-flipped');
});

