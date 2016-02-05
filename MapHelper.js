/* global Site */
/* global $ */
var MapHelper = {
    loadMapView: function (options) {
        Site.mapView = new Site.esriMapView({
            container: "siteMap",
            map: Site.map,
            center: [-56.049, 38.485, 78],
            zoom: 3
        });
        
        Site.mapView.then(function() {
        // Success
        if (options != null) {
            if (options.hasOwnProperty('popupExample')) {
                if (options.popupExample) {
                    MapHelper.loadFeaturePopup();
                }
            }
        }
        
        //Add the watch
        WatchHelper.latLong();
        
      }).otherwise(function() {
        // View was rejected, show webgl unsupported message and turn off the viewDiv
        document.getElementById("siteMap").style.display = "none";
      });
    },
    
    loadFeaturePopup: function() {
        Site.map.basemap = "gray";
       Site.map.removeAll();
        
        var nyPoint = new Site.point({
           longitude: -73.950,
           latitude: 40.702 
        });
        
        Site.mapView.center = nyPoint;
        Site.mapView.zoom = 11;
        
      var template = new Site.popupTemplate({
        title: "Marriage in NY, Zip Code: {ZIP}",
        content: "<p>As of 2015, <b>{MARRIEDRATE}%</b> of the population in this zip code is married.</p>" +
          "<ul><li>{MARRIED_CY} people are married</li>" +
          "<li>{NEVMARR_CY} have never married</li>" +
          "<li>{DIVORCD_CY} are divorced</li><ul>",
        fieldInfos: [{
          fieldName: "MARRIED_CY",
          format: {
            digitSeparator: true, //Uses a comma separator in large numbers
            places: 0 //sets the number of decimal places to 0 and rounds up
          }
        }, {
          fieldName: "NEVMARR_CY",
          format: {
            digitSeparator: true,
            places: 0
          }
        }, {
          fieldName: "DIVORCD_CY",
          format: {
            digitSeparator: true,
            places: 0
          }
        }]
      });

      //Reference the popupTemplate instance in the 
      //popupTemplate property of FeatureLayer
      var featureLayer = new Site.featureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/NYCDemographics1/FeatureServer/0",
        outFields: ["*"],
        popupTemplate: template
      });
      Site.map.add([featureLayer]);
    },

    loadSceneView: function (options) {
        Site.mapView = new Site.esriSceneView({
            container: "siteMap",
            map: Site.map,
            center: [-56.049, 38.485, 78],
            zoom: 3
        });
        
     Site.mapView.then(function() {
        // Success
        if (options != null) {
            if (options.hasOwnProperty('transportationLayer')) {
                if (options.transportationLayer) {
                    MapHelper.loadTransporationLayerView();
                }
            }
        }
        
        //Add the watch
        WatchHelper.latLong();
        
      }).otherwise(function() {
        // View was rejected, show webgl unsupported message and turn off the viewDiv
        document.getElementById("siteMap").style.display = "none";
        document.getElementById("webglNotSupportedDiv").style.visibility =
          "visible";
      });
    },
    
    loadSceneCameraView: function () {
        Site.mapView = new Site.esriSceneView({
            container: "siteMap",
            map: Site.map,
            camera: {
                position: [-105.946054, 39.604630, 2000],
                tilt: 90,
                heading: 180
            }
        });
        
        Site.map.basemap = "hybrid";
        
      Site.mapView.then(function() {   
        //Add the watch
        WatchHelper.latLong();
      });
    },
    
    loadSceneElevationView: function () {
      //Add div
      $('#elevationDiv').remove();
      $('#siteMap').append('<div id="elevationDiv"></div>')
      
      //Create SceneView
      Site.mapView = new Site.esriSceneView({
        container: "siteMap",
        map: Site.map,
        camera: {
          position: [7.654, 45.919, 5184],
          tilt: 80
        }
      });

      Site.mapView.then(function() {
        // Store the default elevation layers
        var elevationLayers = Site.map.basemap.elevationLayers.getAll();

        Site.on(Site.dom.byId("elevationInput"), "change", updateElevation);

        function updateElevation(ev) {
          if (!ev.target.checked) {
            // Clear all elevation layers
            Site.map.basemap.elevationLayers.clear();
          } else {
            // Restore elevation layers to the original ones
            Site.map.basemap.elevationLayers = elevationLayers;
          }
        }
        
        //Add the watch
        WatchHelper.latLong();
      });
    },
    
    loadShadowScene: function() {
        Site.map.basemap = "streets";
        
        Site.mapView = new Site.esriSceneView({
            container: "siteMap",
            map: Site.map,
            camera: {
            position: [10, 53.52, 2820],
            tilt: 50
            }
      });

      //Set the environment in SceneView
      Site.mapView.environment = {
        lighting: {
          directShadows: true,
          date: new Date("Sun Mar 15 2015 09:00:00 GMT+0100 (CET)")
        }
      };

      //Create the SceneLayer and add to the map
      var sceneLayer = new Site.sceneLayer({
        url: "https://scene.arcgis.com/arcgis/rest/services/Hosted/Building_Hamburg/SceneServer/layers/0"
      });
      Site.map.add(sceneLayer);

      //Register the events to controls
      Site.on(Site.dom.byId("timeOfDaySelect"), "change", updateTimeOfDay);
      Site.on(Site.dom.byId("directShadowsInput"), "change", updateDirectShadows);

      //Create the event's callback functions
      function updateTimeOfDay(ev) {
        var select = ev.target;
        var date = select.options[select.selectedIndex].value;

        Site.mapView.environment.lighting.date = new Date(date);
      }

      function updateDirectShadows(ev) {
        Site.mapView.environment.lighting.directShadows = !!ev.target.checked;
      }
    },
    
    loadTransporationLayerView: function() {
        Site.map.basemap = 'dark-gray';
        Site.map.removeAll();
        
        //create layers
        var transportationLyr = new Site.tiledLayer({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
          //This property can be used to uniquely identify the layer
          id: "streets"
        });

        var popLyr = new Site.tiledLayer({
          url: "https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_by_Sex/MapServer",
          id: "male-population",
          //controls the opacity of the layer    
          opacity: 0.7
        });
        
        Site.map.add([transportationLyr, popLyr]);
        
    },
    
    loadViewshed: function() {
        var options = {autoHideDelay: 7500}
        $.notify('Click a point on the map.  Results may take a few seconds.  Viewable areas will be shaded.','info',options);
        
        var gpUrl =
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed";

        Site.map.basemap = "hybrid";

        Site.mapView = new Site.esriSceneView({
          container: "siteMap",
          map: Site.map,
          camera: new Site.camera({
            position: [7.59564, 46.06595, 5184],
            tilt: 70
          })
        });
        
      Site.mapView.then(function() {   
        //Add the watch
        WatchHelper.latLong();
      });

        var markerSymbol = new Site.simpleMarkerSymbol({
          color: [255, 0, 0],
          outline: new Site.simpleLineSymbol({
            color: [255, 255, 255],
            width: 2
          })
        });

        var fillSymbol = new Site.simpleFillSymbol({
          color: [226, 119, 40, 0.75],
          outline: new Site.simpleLineSymbol({
            color: [255, 255, 255],
            width: 1
          })
        });

        var gp = new Site.geoprocessor(gpUrl);
        gp.outSpatialReference = {
          wkid: 102100
        };
        Site.mapView.on("click", computeViewshed);
        
        function computeViewshed(evt) {
          Site.mapGraphicsLayer.clear();

          var point = new Site.point({
            longitude: evt.mapPoint.longitude,
            latitude: evt.mapPoint.latitude
          });

          var inputGraphic = new Site.graphic({
            geometry: point,
            symbol: markerSymbol
          });

          Site.mapGraphicsLayer.add(inputGraphic);

          var inputGraphicContainer = [];
          inputGraphicContainer.push(inputGraphic);
          var featureSet = new Site.featureSet();
          featureSet.features = inputGraphicContainer;

          var vsDistance = new Site.linearUnit();
          vsDistance.distance = 10;
          vsDistance.units = "esriMiles";

          var params = {
            "Input_Observation_Point": featureSet,
            "Viewshed_Distance": vsDistance
          };

          gp.execute(params).then(drawResultData);
        }
        
        function drawResultData(result) {
          var resultFeatures = result.results[0].value.features;

          //Assign each resulting graphic a symbol    
          var viewshedGraphics = resultFeatures.map(function(feature) {
            feature.symbol = fillSymbol;
            return feature;
          });

          //Add the resulting graphics to the graphics layer    
          Site.mapGraphicsLayer.add(viewshedGraphics);

          /********************************************************************    
           * Animate to the result. This is a temporary workaround
           * for animating to an array of graphics in a SceneView. In a future 
           * release, you will be able to replicate this behavior by passing
           * the graphics directly to the animateTo function, like the following:
           *    
           * view.animateTo(viewshedGraphics);
           ********************************************************************/
          Site.mapView.animateTo({
            target: viewshedGraphics,
            tilt: 0
          });
        }
    },

    initalizeMap: function() {
        $('#siteMap').empty();
        $('#siteMap').removeClass();
        var bodyHeight = window.screen.availHeight - 62;
        $('#siteMap').css('height',bodyHeight + 'px');
        
        Site.map = new Site.esriMap({
            basemap: Site.basemapName
        });
        
        var gl = new Site.graphicsLayer();
        Site.map.add(gl);
        Site.mapGraphicsLayer = gl;
    },
    
    homeWidget: function () {
      $('#homeDiv').remove();
      $('#siteMap').append('<div id="homeDiv"></div>')
      
      var homeBtn = new Site.home({
        //Setting widget properties via viewModel is subject to 
        //change for the 4.0 final release      
        viewModel: new Site.homeVM({
          view: Site.mapView
        })
      }, "homeDiv");
      homeBtn.startup();  
    },

    locationWidget: function() {
      $('#locateDiv').remove();
      $('#siteMap').append('<div id="locateDiv"></div>')
      
        var locateBtn = new Site.locate({
        //Setting widget properties via viewModel is subject to 
        //change for the 4.0 final release  
        viewModel: new Site.locateVM({
          view: Site.mapView,
          graphicsLayer: Site.mapGraphicsLayer
        })
      }, "locateDiv");

      locateBtn.startup();
    },
    
    searchWidget: function() {
      var searchWidget = new Site.search({
        //Setting widget properties via viewModel is subject to 
        //change for the 4.0 final release  
        viewModel: new Site.searchVM({
          view: Site.mapView
        })
      }, "searchDiv");

      searchWidget.startup();  
    },
    
    toggleWidget: function() {
      $('#BasemapToggleDiv').remove();
      $('#siteMap').append('<div id="BasemapToggleDiv"></div>')
      
        var toggle = new Site.toggle({
            //Setting widget properties via viewModel is subject to 
            //change for the 4.0 final release
            viewModel: new Site.toggleVM({
            view: Site.mapView,
            secondaryBasemap: "oceans"
            })
        }, "BasemapToggleDiv");

        toggle.startup();
    },
    
    centerPlotted: false,
    trackCenterPoint: false,
    
    plotCenterPoint: function() {
        
      Site.mapView.graphics.removeItems(Site.mapView.graphics.items);  
        
      var point = new Site.point({
        longitude: $('#longLabel').text(),
        latitude: $('#latLabel').text()
      });
     
      //Create a symbol for drawing the point
      var markerSymbol = new Site.simpleMarkerSymbol({
        color: [226, 119, 40],
        outline: new Site.simpleLineSymbol({
          color: [255, 255, 255],
          width: 2
        })
      });

      //Create a graphic and add the geometry and symbol to it
      var pointGraphic = new Site.graphic({
        geometry: point,
        symbol: markerSymbol
      });
      
        Site.mapView.graphics.addItems([pointGraphic]);
        
        MapHelper.centerPlotted = true;
    }
    
}
