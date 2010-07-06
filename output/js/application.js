jQuery(function() {
  $('body > header span').click(function() {
    $('#menu').slideToggle('normal');
  })

  /*** Article Search ***/
  function reset_search() {
    console.log("restoring items");
    $('#articles li').css({height: 'auto', opacity: 1.0});
  }

  function refresh_search(elem) {
    var input = elem || $(this); // Pass a jQuery object or use this
    var value = input.val() || "";

    var q = value.toLowerCase();
    $('#articles li').each(function(i) {
      var article = $(this);
      var style;
      if(article.text().toLowerCase().indexOf(q) >= 0) {
        style = {height: 'show', opacity: 1.0}
      }
      else {
        style = {height: 'hide', opacity: 0}
      }
      if(article.css('opacity') != style.opacity) article.animate(style, {queue: false, duration: 500});
    });
  }
  $('#search').show();

  var input = $('#search input');
  if(input.length > 0) {
    // Setup incremental search on Articles pages
    if(!(input.attr("onsearch") === undefined)) {
      console.log("Using search event for search");
      input.bind("search", refresh_search);
    }
    else {
      // Poll the field for its value while it has focus
      console.log("Using poll mode for search");

      var last_value;
      input.focus(function() {
        last_value = input.val();
        input.everyTime('500ms', function() {
          if(input.val() != last_value) {
            refresh_search(input);
            last_value = input.val();
          }
        });
      }).blur(function() {
        input.stopTime();
      });
    }
  }
});

