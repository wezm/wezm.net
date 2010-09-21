function render_current(o) {
  return '<div class="current">\n\
    <img src="/images/' + (Mojo.escape(Mojo.normalize(o.forecast))) + '.png" width="48" height="48" alt="' + (Mojo.escape(Mojo.normalize(o.forecast))) + '" />\n\
    <span class="temperature">' + (Mojo.escape(Mojo.normalize(o.temperature_out))) + '&deg;C</span>\n\
  </div>';
};

// {"wind_angle":270,"rel_humidity_in":51,"rain_1h":0,"temperature_out":9.9,"forecast":"Sunny","rain_24h":0,"dewpoint":7.11,"wind_chill":9.9,"temperature_in":20.8,"rel_humidity_out":83,"tendency":"Rising","wind_speed":0,"rel_pressure":970.7,"rain_total":1.55,"datetime":"2010-09-20 11:30:13","wind_direction":"W"}

jQuery(function() {
  jQuery.getJSON("/weather.json", function(data, status) {
    var count = data.history.length;
    for(var i = 0; i < count; i++) {
      data.history[i][0] = new Date(data.history[i][0]);
    }

    // Populate the current conditions
    var current_div = render_current(data.current);
    $('.loading').replaceWith(current_div)

    // Populate the charts
    $('.temperature.chart').each(function() {
      var self = this;
      jQuery.plot(self, data.history, {});
    });
  });
});
