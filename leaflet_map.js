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
  marker.bindPopup("<b>"+$(this).find('.warehouse-location').html()+"</b><br>"+
  									$(this).find('.warehouse-city').html());
  marker.on('mouseover', function (e) {
    this.openPopup();
  });
  marker.on('mouseout', function (e) {
    this.closePopup();
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

window.location = window.location.href+'#warehouses-map';