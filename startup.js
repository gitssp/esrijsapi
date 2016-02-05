/* global $ */
(function(){

    require([
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/SceneLayer",
      "esri/views/MapView",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Locate",
      "esri/widgets/Locate/LocateViewModel",
      "esri/widgets/BasemapToggle",
      "esri/widgets/BasemapToggle/BasemapToggleViewModel",
      "esri/widgets/Home",
      "esri/widgets/Home/HomeViewModel",
      "esri/layers/ArcGISTiledLayer",
      "esri/PopupTemplate",
      "esri/layers/FeatureLayer",
      "esri/geometry/Point",
      "esri/Graphic",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/SimpleFillSymbol",
      "esri/widgets/Search",
      "esri/widgets/Search/SearchViewModel",
      "esri/tasks/Locator",
      "esri/Camera",
      "esri/tasks/Geoprocessor",
      "esri/tasks/support/LinearUnit",
      "esri/tasks/support/FeatureSet",
      "dojo/dom",
      "dojo/on",
      "dojo/domReady!"
    ], function(
      Map, SceneView, SceneLayer, MapView, GraphicsLayer, Locate, LocateVM,
      Toggle, ToggleVM, Home, HomeVM, ArcGISTiledLayer, 
      PopupTemplate, FeatureLayer, Point, Graphic, 
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      Search, SearchVM, Locator, Camera, 
      Geoprocessor, LinearUnit, FeatureSet, dom, on
    ) {
        Site.esriMap = Map;
        Site.graphicsLayer = GraphicsLayer;
        Site.dom = dom;
        Site.on = on;
        MapHelper.initalizeMap();
        
        Site.esriMapView = MapView;
        Site.esriSceneView = SceneView;
        Site.sceneLayer = SceneLayer;
        
        Site.locate = Locate;
        Site.locateVM = LocateVM;
        
        Site.toggle = Toggle;
        Site.toggleVM = ToggleVM;
        
        Site.home = Home;
        Site.homeVM = HomeVM;
        
        Site.tiledLayer = ArcGISTiledLayer;
        Site.featureLayer = FeatureLayer;
        Site.popupTemplate = PopupTemplate;
        
        Site.point = Point;
        Site.simpleMarkerSymbol = SimpleMarkerSymbol;
        Site.simpleLineSymbol = SimpleLineSymbol;
        Site.simpleFillSymbol = SimpleFillSymbol;
        Site.graphic = Graphic;
        
        Site.search = Search;
        Site.searchVM = SearchVM;
        
        Site.locator = Locator;
        Site.camera = Camera;
        Site.geoprocessor = Geoprocessor;
        Site.linearUnit = LinearUnit;
        Site.featureSet = FeatureSet;
        
        MapHelper.loadMapView();
    })   
    
    //Hookup UI Events
    $('#mapType').change(function() {         
        MapHelper.initalizeMap();
        $('#rotationButtons').hide();
        $('#environmentDiv').hide();
        
        switch ($(this).val()) {
            case '1':
                MapHelper.loadMapView();
                break;
            case '2':
                MapHelper.loadSceneView();
                break;     
            case '3':
                MapHelper.loadSceneElevationView();
                break; 
            case '4':
                var options = {transportationLayer: true};
                MapHelper.loadSceneView(options);
                break;   
            case '5':
                MapHelper.loadSceneCameraView();
                $('#rotationButtons').show();
                break;  
           case '6':
                MapHelper.loadViewshed();
                break;     
           case '7':
                $('#environmentDiv').show();
                MapHelper.loadShadowScene();
                break;      
           case '8':
                var options = {popupExample: true};
                MapHelper.loadMapView(options);
                break;          
        }
    });
    
    $('#basemaps').change(function() {
       Site.map.basemap = $(this).val();
    });

    $('#trackCP').change(function() {
        MapHelper.trackCenterPoint =  $(this).is(':checked');
    });

})()