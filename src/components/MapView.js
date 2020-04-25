import React, { Component } from 'react';

import 'ol/ol.css';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

import { fromLonLat } from 'ol/proj';

//import css

import '.././css/MapView.css';

export default class MapView extends Component {


    componentDidUpdate() {

        this.letsGo();

    }



    letsGo() {

        var view = new View({
            center: fromLonLat([78.9629, 20.5937]),
            zoom: 2
        });

        var map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            target: 'map',
            view: view
        });

        var geolocation = new Geolocation({

            trackingOptions: {
                enableHighAccuracy: true
            },
            projection: view.getProjection()
        });


        geolocation.setTracking(true);


        geolocation.on('error', function (error) {
            //handle errors...
        });


        var accuracyFeature = new Feature();
        geolocation.on('change:accuracyGeometry', function () {
            accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
        });



        var positionFeature = new Feature();
        positionFeature.setStyle(new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: '#3399CC'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        }));

        geolocation.on('change:position', () => {
            let coordinates = geolocation.getPosition();

            localStorage.setItem('cloc', coordinates);

            positionFeature.setGeometry(coordinates ?
                new Point(coordinates) : null);
        });


        //     var marker = new Feature();

        //     marker.setStyle(new Style({
        //         image: new CircleStyle({
        //             radius: 6,
        //             fill: new Fill({
        //                 color: '#3399CC'
        //             }),
        //             stroke: new Stroke({
        //                 color: '#fff',
        //                 width: 2
        //             })
        //         })
        //     }));




        //     marker.setGeometry(
        //         new Point(
        //             transform([75.929, 14.442], 'EPSG:4326', 'EPSG:3857')
        //         )
        //     );

        //     var ok=[];

        //    ok.push(marker);


        //    console.log(...ok);


        var c_data = [{

            geolocation_cordinates: [14.442, 75.929]

        }];

        // var other_user_locations = [];

        new VectorLayer({
            map: map,
            source: new VectorSource({
                features: [accuracyFeature, positionFeature]
            })
        });

        // this.props.otherUserLocations

        for (let i of c_data) {

            let location_cordinates = i.geolocation_cordinates;

            console.log(location_cordinates);

            var marker = new Feature();

            marker.setStyle(new Style({
                image: new CircleStyle({
                    radius: 6,
                    fill: new Fill({
                        color: 'green'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 2
                    })
                })
            }));


            marker.setGeometry(
                new Point(
                    transform([location_cordinates[1], location_cordinates[0]], 'EPSG:4326', 'EPSG:3857')
                )
            );

            new VectorLayer({
                source: new VectorSource({
                    features: [marker]
                })
            });


        }


        map.on("pointermove", function (evt) {
            let hit = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {

                let coordinates = feature.getGeometry().getCoordinates().toString();

                let cloc = localStorage.getItem('cloc').toString();

                if (cloc === coordinates) {
                    return 'no';
                } else {
                    return 'ok';

                }

                //return true;


            });
            if (hit === 'ok') {
                this.getTargetElement().style.cursor = 'pointer';
            } else {
                this.getTargetElement().style.cursor = '';
            }
        });


        map.on("click", e => {

            map.forEachFeatureAtPixel(e.pixel, feature => {


                let coordinates = feature.getGeometry().getCoordinates();

                if (coordinates.length === 2 && typeof (coordinates[0] !== 'Array')) {

                    alert(coordinates);

                }



            });


        });


    }

    render() {

        return (

            <div id="map" style={{ display: this.props.needToDisplay ? 'block' : 'none' }} className="map"></div>

        );


    }




}

