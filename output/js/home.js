jQuery(function () {
  var image_template = Handlebars.compile($('#image-template').html());

  function populate_flickr(data, text_status) {
    var ul = $("#flickr ul");
    ul.empty();
    jQuery.each($('photo', data), function(i, obj) {
      var photo = $(obj);
      var image = {
        href: photo.attr('url_z'),
        src: '/images/photos.jpg',
        alt: photo.attr('title')
      };
      var li = $(image_template(image));
      $('img', li).css('left', (i * -75) + 'px');
      li.css("background-position", (i * -75) + 'px -75px');
      ul.append(li);
    });
    $("a[rel^='prettyPhoto']").prettyPhoto({theme: "facebook"});
  };

  // Populate Flickr
  jQuery.get("/photos.xml", {}, populate_flickr);
});
