function render_current(o) {
  return '<div id="current">\n\
    <figure class="forecast">\n\
      <img src="/images/weather/' + (Mojo.escape(Mojo.normalize(o, "forecast"))) + '.png" width="48" height="48" alt="' + (Mojo.escape(Mojo.normalize(o, "forecast"))) + '" />\n\
      <figcaption>Forecast</figcaption>\n\
    </figure>\n\
  \n\
    <div class="temperature">\n\
      <div class="current temperature">' + (Mojo.escape(Mojo.normalize(o, "temperature"))) + '&deg;C</div>\n\
      <div class="minmax">\n\
        Minimum <span class="min temperature">' + (Mojo.escape(Mojo.normalize(o, "min_temp"))) + '&deg;C</span> at\n\
        <time datetime="' + (Mojo.escape(Mojo.normalize(o, "min_datetime"))) + '">' + (Mojo.escape(Mojo.normalize(o, "minDateString"))) + '</time>\n\
        Maximum <span class="max temperature">' + (Mojo.escape(Mojo.normalize(o, "max_temp"))) + '&deg;C</span> at\n\
        <time datetime="' + (Mojo.escape(Mojo.normalize(o, "max_datetime"))) + '">' + (Mojo.escape(Mojo.normalize(o, "maxDateString"))) + '</time>\n\
      </div>\n\
    </div>\n\
  </div>';
};

// {"wind_angle":270,"rel_humidity_in":51,"rain_1h":0,"temperature_out":9.9,"forecast":"Sunny","rain_24h":0,"dewpoint":7.11,"wind_chill":9.9,"temperature_in":20.8,"rel_humidity_out":83,"tendency":"Rising","wind_speed":0,"rel_pressure":970.7,"rain_total":1.55,"datetime":"2010-09-20 11:30:13","wind_direction":"W"}

// forecaset is Rainy, Cloudy or Sunny

// Return a string of a number padded with leading zeros
function padNumber(n, count) {
  if(count === undefined) count = 2;

  var string = n.toString();
  var padding = [];
  for(var i = count - string.length; i > 0; i--) {
    padding.push('0');
  }
  return padding.join('') + string;
}

function isoString(date) {
  // YYYY-MM-DDTHH:MM:SS
  if(!date) return '';

  return [
    [
      date.getUTCFullYear(),
      padNumber(date.getUTCMonth() + 1),
      padNumber(date.getUTCDate())
    ].join('-'),
    'T',
    [
      padNumber(date.getUTCHours()),
      padNumber(date.getUTCMinutes()),
      padNumber(date.getUTCSeconds())
    ].join(':')
  ].join('')
}

function datetimeString(date) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return [
    date.getUTCDate(),
    months[date.getUTCMonth()],
    timeString(date)
  ].join(' ')
}

function timeString(date) {
  return [
    padNumber(date.getUTCHours()),
    padNumber(date.getUTCMinutes())
  ].join(':')
}

//function newUTCDate()

jQuery(function() {
  var now = new Date();
  jQuery.getJSON("/weather.json", function(data, status) {
    // Populate the current conditions
    var current = {
      temperature: data.current.temperature_out,
      timestamp: function() {
        var d = new Date(data.current.timestamp);
        return datetimeString(d);
      },
      min_temp: data.current.min.temperature,
      min_date: new Date(data.current.min.timestamp),
      min_datetime: function() {
        return isoString(this.min_date)
      },
      minDateString: function() {
        return timeString(current.min_date)
      },
      max_temp: data.current.max.temperature,
      max_date: new Date(data.current.max.timestamp),
      max_datetime: function() {
        return isoString(this.max_date)
      },
      maxDateString: function() {
        return timeString(current.max_date)
      },
      forecast: data.current.forecast
    };

    var current_div = render_current(current);
    $('.loading').replaceWith(current_div)

    // Populate the charts
    var count = data.history.length;
    for(var i = 0; i < count; i++) {
      data.history[i][0] = new Date(data.history[i][0] - (now.getTimezoneOffset() * 60 * 1000));
    }
    jQuery.plot('.temperature.chart', data.history, {
      xaxis: {
        mode: "time"
      }
    });

    // Rain
    var total_rain_today = 0;
    jQuery.each(data.rain.today, function(idx, reading) {
      total_rain_today += reading[1];
      reading[0] = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), reading[0]));
    });
    $("section.rain .total").html(Math.round(total_rain_today * 10) / 10)

    jQuery.each(data.rain.history, function(idx, reading) {
      var date = reading[0].split("-")
      reading[0] = new Date(Date.UTC(date[0], date[1] - 1, date[2]));
    });

    jQuery.plot(".rainfall.today.chart", [data.rain.today], {
      series: {
        bars: {
          show: true,
          barWidth: 1000 * 60 * 60 // 1 hour
        }
      },
      xaxis: {
        mode: "time",
        min: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())),
        max: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59)),
      }
    });

    jQuery.plot(".rainfall.week.chart", [data.rain.history], {
      series: {
        bars: {
          show: true,
          barWidth: 1000 * 60 * 60 * 24 // 1 day
        }
      },
      xaxis: {
        // min: 0,
        // max: 24
        mode: "time",
        minTickSize: [1, "day"]
      }
    });
  });
});
