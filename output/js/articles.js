var articles;

function articles_loaded(data) {
  articles = data;
  console.log(data);
  $('.pagination').slideDown('fast');
};

jQuery(function() {
  $('.newer, .older').click(function() {
    var elem = $(this);
    
    var page;
    var matches;
    if(matches = elem.attr('href').match(/(\d+)$/)) {
      page = new Number(matches[1]);
    }
    else {
      return false;
    }

    var per_page = 10;

    var i = (page - 1) * per_page;
    for(; i < page * per_page; i++) {
      console.log(articles[i].title);
    }

    return false;
  });

  jQuery.get('json/articles.json', {}, articles_loaded, 'json');
});
