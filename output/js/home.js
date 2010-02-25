jQuery(function () {
  function render_image(o) {
    return '<li>\n\
    <a href="' + (Mojo.escape(Mojo.normalize(o.href))) + '" rel="' + (Mojo.escape(Mojo.normalize(o.rel))) + '"></a>\n\
    </li>';
  };

  function populate_flickr(data, text_status) {
    var ul = $("ul", "#flickr");
    // ul.empty();
    jQuery.each($('photo', data), function(i, obj) {
      var photo = $(obj);
      var image = {
        href: photo.attr('url_m'),
        rel: "prettyPhoto[flickr]",
      };
      var li = $(render_image(image));
      $('a', li).css({backgroundPosition: (i + 1) * -75 + "px -75px"});
      ul.append(li);
    });
    $("a[rel^='prettyPhoto']").prettyPhoto({theme: "facebook"});
  };

  // Populate Flickr
  jQuery.get("/photos.xml", {dataType: 'xml'}, populate_flickr);
});
