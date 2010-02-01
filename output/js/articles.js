(function() {
  // Load articles JSON ASAP
  var articles = null;

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

  function articles_loaded(data) {
    articles = data;
    jQuery(function() {
      $(window).bind('hashchange', function(e) {
        // Get the hash (fragment) as a string, with any leading # removed. Note that
        // in jQuery 1.4, you should use e.fragment instead of $.param.fragment().
        var page;
        var matches;
        var page_fragment = e.fragment;
        if(matches = page_fragment.match(/page-(\d+)$/)) {
          page = new Number(matches[1]);
        }
        else {
          return false;
        }

        // Generate the items
        var per_page = 10;
        var container = $('ul.articles');
        container.empty();
        var i = (page - 1) * per_page;
        for(; i < page * per_page; i++) {
          var article = articles[i];
          var date = new Date(Date.parse(article.date));
          var article_view = {
            date: article.date,
            day: date.getDay(),
            month: date.getMonth(),
            year: date.getYear(),
            path: article.path,
            title: article.title,
            summary: article.summary
          };
          var li = render_article(article_view);
          container.append(li);
        }
        
      });

      $('.pagination').slideDown('fast');

      // Since the event is only triggered when the hash changes, we need to trigger
      // the event now, to handle the hash the page may have loaded with.
      $(window).trigger( 'hashchange' );
    });
  };
  jQuery.getJSON('json/articles.json', {}, articles_loaded);
})();
