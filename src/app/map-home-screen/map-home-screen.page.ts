import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MouseEvent, GoogleMapsAPIWrapper, MarkerManager, AgmMarker} from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
    selector: 'app-map-home-screen',
    templateUrl: './map-home-screen.page.html',
    styleUrls: ['./map-home-screen.page.scss'],
    providers: [GoogleMapsAPIWrapper, Geolocation]
})
export class MapHomeScreen implements OnInit {
    public googleMapStyles: Array<any> = [
        {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#7c93a3'
                },
                {
                    lightness: '-10'
                }
            ]
        },
        {
            featureType: 'administrative.country',
            elementType: 'geometry',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#a0a4a5'
                }
            ]
        },
        {
            featureType: 'administrative.province',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#62838e'
                }
            ]
        },
        {
            featureType: 'landscape',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#dde3e3'
                }
            ]
        },
        {
            featureType: 'landscape.man_made',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#3f4a51'
                },
                {
                    weight: '0.30'
                }
            ]
        },
        {
            featureType: 'poi',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'simplified'
                }
            ]
        },
        {
            featureType: 'poi.attraction',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'poi.business',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'poi.government',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'poi.park',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'poi.place_of_worship',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'poi.school',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'poi.sports_complex',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'road',
            elementType: 'all',
            stylers: [
                {
                    saturation: '-100'
                },
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#bbcacf'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    lightness: '0'
                },
                {
                    color: '#bbcacf'
                },
                {
                    weight: '0.50'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#ffffff'
                }
            ]
        },
        {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#a9b4b8'
                }
            ]
        },
        {
            featureType: 'road.arterial',
            elementType: 'labels.icon',
            stylers: [
                {
                    invert_lightness: true
                },
                {
                    saturation: '-7'
                },
                {
                    lightness: '3'
                },
                {
                    gamma: '1.80'
                },
                {
                    weight: '0.01'
                }
            ]
        },
        {
            featureType: 'transit',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#a3c7df'
                }
            ]
        }
    ];
    public lat: number;
    public lng: number;
    public userLocation: any;
    public siteLocation: any;
    public canCheckIn: boolean;
    public zoom = 15;
    public queryText: string;
    private proxyurl = 'https://cors-anywhere.herokuapp.com/';
    private API_AUTH_KEY = 'AIzaSyB1rFlu0wU5C1mRq-gc18Qq5U-iNlPhT1k';
    private oldMarker: any

    constructor(private mapsWrapper: GoogleMapsAPIWrapper, private geolocation: Geolocation) {
        this.mapsWrapper = mapsWrapper;
    }

    async ngOnInit() {
        console.log(document.getElementById('map-container'));
        await this.mapsWrapper.createMap(document.getElementById('map-container'), {
            zoom: 15,
            styles: this.googleMapStyles,
            disableDefaultUI: true
        });
        this.updateUserLocation();
    }

    private setCurrentPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                this.mapsWrapper.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                if (!this.userLocation) {
                    this.userLocation = await this.mapsWrapper.createMarker(
                        {
                            position: { lat: position.coords.latitude, lng: position.coords.longitude },
                            clickable: false,
                        });
                } else {
                    this.userLocation.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
                }
            }, (err) => { }, { enableHighAccuracy: true });
        }
    }

    private updateUserLocation() {
        navigator.geolocation.watchPosition(async (position) => {
            this.setCurrentPosition();
        });
    }

    private async recenter(){
        const result = await this.geolocation.getCurrentPosition({ enableHighAccuracy: true}).catch((error) => {
            console.log('Error getting location', error);
        });
        if (!!result){
            this.mapsWrapper.setCenter({ lat: result.coords.latitude, lng: result.coords.longitude });
            this.mapsWrapper.setZoom(15);
        }
    }

    async search() {
        let location = '';
        try {
            location = '&locationbias=circle:2000@' + this.userLocation.getPosition().lat() + ', '
                        + this.userLocation.getPosition().lng();
        } catch (e) {
            console.error(e);
        }

        const url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='
            + this.queryText + '&inputtype=textquery&key=' + this.API_AUTH_KEY
            + location;

        fetch(this.proxyurl + url)
            .then(response => response.json())
            .then(content => {this.moveMap(content); })
            .catch(reason => {
                console.error('Error fetching Google Maps API. Check proxy? ' + reason);
            });
    }

    async moveMap(resp) {
        const places = (await resp.candidates).slice(0, 7);
        const placeId = places[0];
        const map = await this.mapsWrapper.getNativeMap();
        const url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + placeId
            + '&fields=geometry,name&key=' + this.API_AUTH_KEY;

        console.log(places);

        fetch(this.proxyurl + url)
            .then(response => response.json())
            .then(content => {
                const newLocation = content.result.geometry.location;
                this.mapsWrapper.panTo(newLocation);
                const marker = new google.maps.Marker({
                    clickable: true,
                    position: newLocation,
                    title: content.result.name,
                    map,
                    visible: true,
                });
                if (this.oldMarker != null) { this.oldMarker.setMap(null); }
                this.oldMarker = marker;

                const bound = new google.maps.LatLngBounds();
                bound.extend(content.result.geometry.viewport.northeast);
                bound.extend(content.result.geometry.viewport.southwest);
                bound.extend(newLocation);
                this.mapsWrapper.fitBounds(bound);

            })
            .catch(reason => {
                console.error('Error Moving Map: ' + reason);
            });
    }
}
