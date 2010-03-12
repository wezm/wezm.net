var WezM = {
  articles: undefined,
  _months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  per_page: 10,
  showJavascriptWidgets: function() {
    $('.pagination').show();
    $('#search').show();
    $('#search input').jsonSuggest(this.articles, {
      onSelect: this._searchItemSelected,
      width: 400
    });
    if(navigator.userAgent.toLowerCase().indexOf('webkit') >= 0) {
      $('#search input').css('paddingTop', 0);
    }
    // The following should be triggered onchange for the input as well
    // (to handle things like Cut with the mouse)
    $('#search input').keyup(function(e) {
      var input = $(this);
      var clear_search = $('#search .clear');
      var value = input.attr('value');
      if(value && (value != '')) {
        clear_search.addClass('active');
      }
      else {
        clear_search.removeClass('active');
      }
    });
    $('#search .clear.active').live('click', function() {
      $('#search input').attr('value', '').keyup(); // Simulate keypress to clear results

    });
  },
  _searchItemSelected: function(article) {
    document.location.href = article.path;
  },
  _renderArticle: function(o) {
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
  },
  _updatePaginationControls: function(page) {
    var older = $('.pagination .older').attr('href', '#' + (page + 1));
    var newer = $('.pagination .newer').attr('href', '#' + (page - 1));

    // Hide if out of range
    older.css('visibility', page * this.per_page >= this.articles.length ? 'hidden' : 'visible');
    newer.css('visibility', page <= 1 ? 'hidden' : 'visible');
  },
  loadArticles: function(callback) {
    if(!this.articles) {
      var path = 'articles.json';
      if(document.location.pathname.match(/page\/$/)) {
        path = '../articles.json';
      }
      jQuery.getJSON(path, {}, function(data) {
        WezM.articles = data;
        if(callback) callback();
      });
    }
    else if(callback) {
      callback();
    }
  },
  hashChanged: function(e) {
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
    var i = (page - 1) * this.per_page;
    for(; i < page * this.per_page && i < this.articles.length; i++) {
      var article = this.articles[i];
      var date = new Date(Date.parse(article.date));
      var article_view = {
        date: article.date,
        day: date.getDate(),
        month: this._months[date.getMonth()],
        year: date.getYear() + 1900,
        path: article.path,
        title: article.title,
        summary: article.extra
      };
      var li = this._renderArticle(article_view);
      container.append(li);
    }

    this._updatePaginationControls(page);
    window.document.title = "All Articles - Page " + page; // TODO: Make this title better
    // Scroll to top of page
    if(window.scrollTo) {
      window.scrollTo(0,0);
    }
  }
}

