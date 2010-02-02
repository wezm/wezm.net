(function() {
  var articles = null;
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var per_page = 10;

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
    var newer = $('.pagination .newer').attr('href', '#page-' + (page + 1));
    var older = $('.pagination .older').attr('href', '#page-' + (page - 1));
    
    // Hide if out of range
    older.css('visibility', page <= 1 ? 'hidden' : 'visible');
    newer.css('visibility', page * per_page >= articles.length ? 'hidden' : 'visible');
  };

  function articles_loaded(data) {
    articles = data;
    jQuery(function() {
      $(window).bind('hashchange', function(e, first_time) {
        // Get the hash (fragment) as a string, with any leading # removed. Note that
        // in jQuery 1.4, you should use e.fragment instead of $.param.fragment().
        var page;
        var matches;
        var page_fragment = e.fragment;
        if(matches = page_fragment.match(/page-(\d+)$/)) {
          page = new Number(matches[1]);
        }
        else {
          update_pagination_controls(1);
          return false;
        }
        
        var container = $('ul.articles');
        if(first_time && page != 1) {
          container.block({ 
              message: '<span>Loading</span>', 
              css: { border: '3px solid #1c1c1c' } 
          }); 
        }

        // Generate the items
        container.empty();
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
        
        if(first_time && page != 1) container.unblock();
        update_pagination_controls(page);
      });

      // Since the event is only triggered when the hash changes, we need to trigger
      // the event now, to handle the hash the page may have loaded with.
      $(window).trigger('hashchange', true);
      $('.pagination').slideDown('fast');
      
      if(navigator.userAgent.toLowerCase().indexOf('webkit') >= 0) {
        // WebKit browser
        $('#search input').css('paddingTop', 0);
      }
    });
  };

  // Load articles JSON ASAP
  jQuery.getJSON('json/articles.json', {}, articles_loaded);
})();
