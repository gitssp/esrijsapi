/* global $ */
var NavigationHelper = {
      goToLatLong: function () {
        var lat = $('#latNav').val();
        var long = $('#longNav').val();
        
        if (isNaN(lat))
            return;
            
        if (isNaN(long))
            return;
            
        var setPoint = new Site.point({
           longitude: long,
           latitude: lat 
        });
        
        Site.mapView.center = setPoint;         
      },
      
      tiltView: function () {
        // Get the camera tilt and add a small number for numerical inaccuracies
        var tilt = Site.mapView.camera.tilt + 1e-3;

        // Switch between 3 levels of tilt
        if (tilt >= 80) {
          tilt = 0;
        } else if (tilt >= 40) {
          tilt = 80;
        } else {
          tilt = 40;
        }

        Site.mapView.animateTo({
          tilt: tilt
        });
      },
      
      rotateView: function(direction) {
        var heading = Site.mapView.camera.heading;

        // Set the heading of the view to the closest multiple of 90 degrees,
        // depending on the direction of rotation
        if (direction > 0) {
          heading = Math.floor((heading + 1e-3) / 90) * 90 + 90;
        } else {
          heading = Math.ceil((heading - 1e-3) / 90) * 90 - 90;
        }

        Site.mapView.animateTo({
          heading: heading
        });
      },
      
      geocode: function() {
          //http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text=380+New+York+Street%2C+Redlands%2C+CA+92373&f=pjson
        var find = new Site.locator({
            url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });
        
        var addressString = $('#geocodeAddress').val();
        
        var address = {"addresses" : [{"OBJECTID": 0, "Single Line Input": addressString}], 
            "countryCode": "US", categories: []};
        
        find.addressesToLocations(address)
        .then(function(response) {
            console.log(response);
        }).otherwise(function (error) {
           console.log(error); 
        });
      }
}