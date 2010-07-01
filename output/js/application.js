jQuery(function() {
  $('body > header span').click(function() {
    $('#menu').slideToggle('normal');
  })

  /*** Article Search ***/
  function reset_search() {
    console.log("restoring items");
    $('#articles li').css({height: 'auto', opacity: 1.0});
  }

  function refresh_search(e) {
    var input = $(this);
    var value = input.val() || "";

    var q = value.toLowerCase();
    //if (e.which == 32 || (65 <= e.which && e.which <= 65 + 25) || (97 <= e.which && e.which <= 97 + 25))
    // if(e.which >= 32) {
    //   q += String.fromCharCode(e.which).toLowerCase();
    // }

    console.log('q: ' + q);

    if(q == "") {
      reset_search();
      return;
    }

    $('#articles li').filter(function(i) {
      var article = $(this);
      return article.text().toLowerCase().indexOf(q) < 0;
    }).animate({height: 0, opacity: 0}, {queue: false, duration: 500});
  }
  $('#search').show();
    //.keypress(refresh_search)
  $('#search input')
    .bind("search", refresh_search);
    // .bind("click", refresh_search)
    // .bind("cut", refresh_search)
    // .bind("paste", refresh_search);
});

/* Setup search

If onsearch is supported use that
else if oninput is used then use that
else setup a poller to poll the value of the search box while it has focus. Stop polling when the field loses focus

*/