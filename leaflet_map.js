$( document ).ready(function() {
  fill_warehouses_table();
  $('#prev').hide();

  var markers = [];
  var mymap = L.map('warehouses-map').setView([37.7880, -122.4075], 10);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW1hcm9qb25ham8iLCJhIjoiY2pxcjVxc2x2MDMzeDQ5bG51dTBlNHZtaSJ9._vt_5KSxx0IW7xiGZLKKiQ', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'your.mapbox.access.token'
  }).addTo(mymap);

  // reset markers
  //$.each(markers, function() {
  //	console.log(this);
  //	mymap.removeLayer(this);
  //});

  $('.warehouses-list .item').each( function() {
    // console.log($(this).find('.latitude').html(), $(this).find('.longitude').html());
    marker = L.marker([$(this).find('.latitude').html(), $(this).find('.longitude').html()]).addTo(mymap);
    marker.bindPopup("<div width='200px'>"+
    	"<img src='https://maps.googleapis.com/maps/api/streetview?size=200x100&location="+
      	$(this).find('.latitude').html()+','+
        $(this).find('.longitude').html()+
      	"&fov=110&key=AIzaSyB79RE1ATsM0e9C5HMd7VMtlPBqgydY0-U' height='100' width='200'><br>"+
    	$(this).find('.warehouse-city').html()+
    	"<br><a href='"+$(this).find('a').attr('href')+"'>"+
      "<b >"+$(this).find('.warehouse-location').html()+"</b></a></div>",
      {minWidth: 200 });
    marker.on('mouseover', function (e) {
      this.openPopup();
    });
    markers.push(marker);
  });

  $('.column-19').click(function(e) {
    var index = $(this).index();
    var sort_type = index == 0? '.warehouse-location':
          (index == 1? '.warehouse-city':
          (index == 2? '.warehouse-price': '.warehouse-size'));
    // console.log(sort_type);
    $('.column-19').removeClass('active');
    $(this).addClass('active');
    $('.warehouses-list .item').sort(function (a, b) {
      if ($(a).find(sort_type).html().toUpperCase() < $(b).find(sort_type).html().toUpperCase()) {
        return -1;
      } else {
        return 1;
      }
    }).appendTo('.warehouses-list');
  });
});

window.location = window.location.href+'#warehouses-map';
var page = 1;
var total_pages = 1;

function fill_warehouses_table() {
  $.ajax({
    type: 'POST',
    url: "https://app.demandrack.com/search",
    dataType: 'json',
    data: {'query': $('#search').val() },
    success: function(data) {
      console.log(data);
      total_pages = data.total_pages;
      $('.warehouses-list .item').remove();
      $.each(data.items, function() {
        $('.warehouses-list').append(''+
        '<div class="item w-dyn-item">'+
          '<a href="/warehouses/'+this.warehouse_slug+'" class="link-block-8 w-inline-block">'+
            '<div class="warehouse-row w-row">'+
              '<div class="w-col w-col-4">'+
                '<div class="longitude">'+this.warehouse_long+'</div>'+
                '<div class="latitude">'+this.warehouse_lat+'</div>'+
                '<div class="warehouse-location">'+this.warehouse_address+'</div>'+
              '</div>'+
              '<div class="w-col w-col-3">'+
                '<div class="warehouse-city">'+this.warehouse_city+'</div>'+
              '</div>'+
              '<div class="w-col w-col-3">'+
                '<div class="div-block-53">'+
                  '<div class="text-block-282 symbol">$</div>'+
                  '<div class="warehouse-price">'+this.warehouse_price+'</div>'+
                  '<div class="text-block-282 side">/ day</div>'+
                '</div>'+
              '</div>'+
              '<div class="column-18 w-col w-col-2">'+
                '<div class="warehouse-size">'+this.warehouse_size+'</div>'+
                '<div class="text-block-281">sq feet</div>'+
              '</div>'+
            '</div>'+
          '</a>'+
        '</div>');
      });
      if (page == 1) {
        $('#prev').hide();
      }
      if (total_pages == data.total) {
        $('#prev').hide();
      }
    },
    error: function(data) {
      console.log(data);
    },
  });
}