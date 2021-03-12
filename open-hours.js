var openHours = [];
$('.open-hour').each(function() {
  var openHour = {
    day: $(this).children('.open-hour-day').first().text(),
    open: $(this).children('.open-hour-open').first().text(),
    close: $(this).children('.open-hour-close').first().text(),
    closed: $(this).children('.open-hour-closed.w-condition-invisible').length == 0
  };
  openHours.push(openHour);
});

var DateTime = luxon.DateTime;
var message = '';
var currentHours = null;

if (DateTime) {
  const weekday = DateTime.now().setZone('Australia/Melbourne').weekdayLong;
  for (var i = 0; i < openHours.length; i++) {
    var hour = openHours[i];
    if (weekday === hour['day']) {
      currentHours = hour;
    }
  }

  if (currentHours) {
    if (currentHours['closed']) {
      message = 'Closed Today';
    } else {
      try {
        var open = DateTime.fromJSDate(new Date(currentHours['open']));
        var openHour = open.toLocaleString({ hour: 'numeric', minute: '2-digit', hour12: true }).replace(':00', '').replaceAll(' ', '');

        var close = DateTime.fromJSDate(new Date(currentHours['close']));
        var closeHour = close.toLocaleString({ hour: 'numeric', minute: '2-digit', hour12: true }).replace(':00', '').replaceAll(' ', '');

        message = `${openHour}–${closeHour} Today`;
      } catch (err) {
        console.log('Error parsing date', err);
      }
    }
  }
}

$('.open-hour-status').text(message);
