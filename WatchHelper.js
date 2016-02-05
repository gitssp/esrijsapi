var WatchHelper = {
    latLong: function() {
        
        if (Site.mapView.center === undefined)
            return;
        
        $('#latLabel').text(Site.mapView.center.latitude);
        $('#longLabel').text(Site.mapView.center.longitude);
        
        Site.mapView.watch('center.latitude', function(newValue, oldValue, property, object) {
            $('#latLabel').text(newValue);
            WatchHelper.trackCP();
        });
    
        Site.mapView.watch('center.longitude', function(newValue, oldValue, property, object) {
            $('#longLabel').text(newValue);
            WatchHelper.trackCP();
        });
    },
    
    trackCP: function () {
        if (MapHelper.trackCenterPoint)
            MapHelper.plotCenterPoint();
    }
}