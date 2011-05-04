(function() {
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

    if (typeof date.toISOString == 'function') {
      return date.toISOString();
    }

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
      ].join(':'),
      'Z'
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
      padNumber(date.getHours()),
      padNumber(date.getMinutes())
    ].join(':')
  }

  function dateWindowToday() {
    var now = new Date();
    var start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var end = new Date(start.getTime() + (1000 * 60 * 60 * 24) - 1) // 1 day minus a millisecond

    return [start, end];
  }

  // Register Handlebars date helpers
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  Handlebars.registerHelper('day', function(date) {
    return days[date.getDay()];
  });

  Handlebars.registerHelper('time', function(date) {
    return timeString(date);
  });

  Handlebars.registerHelper('isoDate', function(date) {
    return isoString(date);
  });

  jQuery(function() {
    // Compile templates
    var currentTemplate = Handlebars.compile($('#current-template').html());
    var extremesTemplate = Handlebars.compile($('#extremes-template').html());

    var now = new Date();
    jQuery.getJSON("/weather.json", function(data, status) {
      // Populate the current conditions
      var current = {
        temperature: data.current.temperature_out,
        timestamp: function() {
          var d = new Date(data.current.timestamp);
          return datetimeString(d);
        },
        // min_temp: data.current.min.temperature,
        //       min_date: new Date(data.current.min.timestamp),
        //       min_datetime: function() {
        //         return isoString(this.min_date)
        //       },
        //       minDateString: function() {
        //         return timeString(current.min_date)
        //       },
        //       max_temp: data.current.max.temperature,
        //       max_date: new Date(data.current.max.timestamp),
        //       max_datetime: function() {
        //         return isoString(this.max_date)
        //       },
        //       maxDateString: function() {
        //         return timeString(current.max_date)
        //       },
        forecast: data.current.forecast
      };

      var current_div = currentTemplate(current);
      $('.loading').replaceWith(current_div)

      // Populate the extremes
      var extremes = [];
      var len = data.extremes.length;
      for(var i = 0; i < len; i++) {
        var e = data.extremes[i];
        var extreme = {
          date: new Date(e.date),
          min: {
            temperature: e.min.temperature,
            time: new Date(e.min.timestamp)
          },
          max: {
            temperature: e.max.temperature,
            time: new Date(e.max.timestamp)
          }
        };
        extremes.push(extreme);
      }

      var extremes_div = extremesTemplate({extremes: extremes});
      $('section.extremes').replaceWith(extremes_div);

      // Populate the charts
      // Temperature history
      var count = data.history.length;
      for(var i = 0; i < count; i++) {
        // Convert timestamps to Date objects
        data.history[i][0] = new Date(data.history[i][0]);
      }
      var chart = $('.temperature .chart');
      chart.css('width', chart.width()); // TODO: bind to resize event and redraw
      var temperatureGraph = new Dygraph(chart[0], data.history, {
        rollPeriod: 5,
        showRoller: true,
        labels: ['Date', 'Inside Temperature', 'Outside Temperature']
      });
      $('#today').click(function() {
        temperatureGraph.updateOptions({
          dateWindow: dateWindowToday()
        });
      });

      // Rain
      var total_rain_today = 0;
      jQuery.each(data.rain.today, function(idx, reading) {
        total_rain_today += reading[1];

        // Convert the hour value into a date
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
})();
