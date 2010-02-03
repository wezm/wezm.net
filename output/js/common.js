function show_javascript_widgets() {
  $('.pagination').show();
  $('#search').show();
};

function webkit_search_tweak() {
  if(navigator.userAgent.toLowerCase().indexOf('webkit') >= 0) {
    $('#search input').css('paddingTop', 0);
  }
};
