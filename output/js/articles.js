jQuery(function(){
  
  // Keep a mapping of url-to-container for caching purposes.
  var articles = null;

  function articles_loaded(data) {
    articles = data;
    $('.pagination').slideDown('fast');
  };

  function show_page() {
    
  };
  
  // Bind an event to window.onhashchange that, when the history state changes,
  // gets the url from the hash and displays either our cached content or fetches
  // new content to be displayed.
  $(window).bind('hashchange', function(e) {
    
    // Get the hash (fragment) as a string, with any leading # removed. Note that
    // in jQuery 1.4, you should use e.fragment instead of $.param.fragment().
    var url = e.fragment;
    
    if ( articles ) {
      // Since the element is already in the cache, it doesn't need to be
      // created, so instead of creating it again, let's just show it!
      
      
    } else {
      // // Show "loading" content while AJAX content loads.
      // $( '.bbq-loading' ).show();
      // 
      // // Create container for this url's content and store a reference to it in
      // // the cache.
      // cache[ url ] = $( '<div class="bbq-item"/>' )
      //   
      //   // Append the content container to the parent container.
      //   .appendTo( '.bbq-content' )
      //   
      //   // Load external content via AJAX. Note that in order to keep this
      //   // example streamlined, only the content in .infobox is shown. You'll
      //   // want to change this based on your needs.
      //   .load( url, function(){
      //     // Content loaded, hide "loading" content.
      //     $( '.bbq-loading' ).hide();
      //   });
      var d = new Date(Date.parse());
      jQuery.get('json/articles.json', {}, articles_loaded, 'json');
    }
  })

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


  // Since the event is only triggered when the hash changes, we need to trigger
  // the event now, to handle the hash the page may have loaded with.
  $(window).trigger( 'hashchange' );
  
});



// var articles;
// 

// jQuery(function() {
//   $('.newer, .older').click(function() {
//     var elem = $(this);
//     
//     var page;
//     var matches;
//     if(matches = elem.attr('href').match(/(\d+)$/)) {
//       page = new Number(matches[1]);
//     }
//     else {
//       return false;
//     }
// 
//     var per_page = 10;
// 
//     var i = (page - 1) * per_page;
//     for(; i < page * per_page; i++) {
//       console.log(articles[i].title);
//     }
// 
//     return false;
//   });
// 
//   jQuery.get('json/articles.json', {}, articles_loaded, 'json');
// });
