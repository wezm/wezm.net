(function() {
  var articles = null;
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var per_page = 10;

  function search_item_selected(item) {
  };

  function show_javascript_widgets() {
    $('.pagination').show();
    $('#search').show();
    $('#search input').jsonSuggest(articles, {
      onSelect: search_item_selected,
      width: 400
    });
  };

  function webkit_search_tweak() {
    if(navigator.userAgent.toLowerCase().indexOf('webkit') >= 0) {
      $('#search input').css('paddingTop', 0);
    }
  };
    

  function render_article(o) {
    return '<li>\n\
      <abbr class="calender date" title="' + (Mojo.escape(Mojo.normalize(o.date))) + '">\n\
        <span class="day">' + (Mojo.escape(Mojo.normalize(o.day))) + '</span>\n\
        <span class="month">' + (Mojo.escape(Mojo.normalize(o.month))) + '</span>\n\
        <span class="year">' + (Mojo.escape(Mojo.normalize(o.year))) + '</span>\n\
      </abbr>\n\
      <p>\n\
        <strong><a href="' + (Mojo.escape(Mojo.normalize(o.path))) + '">' + (Mojo.escape(Mojo.normalize(o.title))) + '</a></strong>\n\
        ' + (Mojo.escape(Mojo.normalize(o.summary))) + '\n\
      </p>\n\
    </li>';
  };

  function update_pagination_controls(page) {
    var older = $('.pagination .older').attr('href', '#' + (page + 1));
    var newer = $('.pagination .newer').attr('href', '#' + (page - 1));

    // Hide if out of range
    older.css('visibility', page * per_page >= articles.length ? 'hidden' : 'visible');
    newer.css('visibility', page <= 1 ? 'hidden' : 'visible');
  };

  function articles_loaded(data) {
    articles = data;
    jQuery(function() {
      $(window).bind('hashchange', function(e) {
        // Get the hash (fragment) as a string, with any leading # removed. Note that
        // in jQuery 1.4, you should use e.fragment instead of $.param.fragment().
        var page;
        var matches;
        var page_fragment = e.fragment;
        if(!page_fragment) {
          page_fragment = $.param.fragment();
        }
        if(matches = page_fragment.match(/(\d+)$/)) {
          page = new Number(matches[1]);
        }
        else {
          page = 1;
        }

        var container = $('ul.articles');
        container.empty();

        // Generate the items
        var i = (page - 1) * per_page;
        for(; i < page * per_page && i < articles.length; i++) {
          var article = articles[i];
          var date = new Date(Date.parse(article.date));
          var article_view = {
            date: article.date,
            day: date.getDate(),
            month: months[date.getMonth()],
            year: date.getYear() + 1900,
            path: article.path,
            title: article.title,
            summary: article.summary
          };
          var li = render_article(article_view);
          container.append(li);
        }

        update_pagination_controls(page);
        window.document.title = "All Articles - Page " + page
      });

      // Since the event is only triggered when the hash changes, we need to trigger
      // the event now, to handle the hash the page may have loaded with.
      $(window).trigger('hashchange');
      show_javascript_widgets();
      webkit_search_tweak();
    });
  };

  // Load articles JSON ASAP
  var path = 'json/articles.json';
  if(document.location.pathname.match(/page\/$/)) {
    path = '../json/articles.json';
  }
  jQuery.getJSON(path, {}, articles_loaded);
})();
