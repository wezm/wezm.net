jQuery(function () {
  function render_image(o) {
    return '<li>\n\
  <a href="' + (Mojo.escape(Mojo.normalize(o.href))) + '" rel="prettyPhoto[flickr]"><img src="' + (Mojo.escape(Mojo.normalize(o.src))) + '" alt="' + (Mojo.escape(Mojo.normalize(o.alt))) + '" /></a>\n\
</li>';
  };

  function populate_flickr(data, text_status) {
    var ul = $("#flickr ul");
    ul.empty();
    jQuery.each($('photo', data), function(i, obj) {
      var photo = $(obj);
      var image = {
        href: photo.attr('url_m'),
        src: '/images/photos.jpg',
        alt: photo.attr('title')
      };
      var li = $(render_image(image));
      $('img', li).css('left', (i * -75) + 'px');
      li.css("background-position", (i * -75) + 'px -75px');
      ul.append(li);
    });
  };

  // Populate Flickr
  jQuery.get("/photos.xml", {}, populate_flickr);
});
