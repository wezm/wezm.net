jQuery(function () {
  function populate_flickr(data, text_status) {
    var ul = $("ul", "#flickr");
    // ul.empty();
    jQuery.each(data.photos.photo, function(i, photo) {
      var li = $("<li></li>");
      var a = $("<a></a>");
      a.attr("href", photo.url_m);
      a.attr("rel", "prettyPhoto[flickr]");
      var img = $("<img />");
      img.attr('src', photo.url_sq);
      img.attr('alt', photo.title);
      a.append(img)
      li.append(a);
      ul.append(li);
    });
    $("a[rel^='prettyPhoto']").prettyPhoto({theme: "facebook"});
  };

  // Populate Flickr
  jQuery.getJSON("http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=aa003631cc50bd47f27f242d30bcd22f&user_id=40215689%40N00&format=json&per_page=20&extras=url_sq,url_m&jsoncallback=?", populate_flickr);
});
