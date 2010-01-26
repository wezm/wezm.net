
jQuery(function () {
  function populate_flickr(data, text_status) {
    var ul = $("ul", "#flickr");
    ul.empty();
    debugger;
    jQuery.each(data.photos.photo, function(i, photo) {
      var li = $("<li></li>");
      var a = $("<a></a>");
      a.attr("href", "http://www.flickr.com/photos/" + escape(photo.owner) + "/" + photo.id);
      var img = $("<img />");
      img.attr('src', photo.url_sq);
      img.attr('alt', photo.title);
      a.append(img)
      li.append(a);
      ul.append(li);
    });
  };

  // Populate Flickr
  jQuery.getJSON("http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=aa003631cc50bd47f27f242d30bcd22f&user_id=40215689%40N00&format=json&per_page=20&extras=url_sq&jsoncallback=?", populate_flickr);
});
