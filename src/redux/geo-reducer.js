import { idbKeyval } from "../components/common/indexedDB";

const SET_MY_LOCATION = 'SET_MY_LOCATION'; // set latitude and longitude // set mapLink href textContent
const SET_LOCATION_STATUS = 'SET_LOCATION_STATUS'; // locationStatus

// // set mapLink href textContent
const SET_MAP_MAX_SCALE = 'SET_MAP_LINK_SCALE'; // set mapLink scale #map query
const SET_FETCHING_LOCATION = 'SET_FETCHING_LOCATION'

const OSM_BASE_LINK = `https://www.openstreetmap.org/`;

const SET_LOCATION_REQUESTS = 'SET_LOCATION_REQUESTS';

let initialState = {
    locationStatus: null,

    latitude: null,
    longitude: null,

    mapMaxScale: 14,

    isFetchingLocation: false,

    osmBaseLink: OSM_BASE_LINK,
    
    locations: [],
    // mapLink: {
    //     href: '',
    //     textContent: '',
    //     scale: ''
    // }

}
 
const geoReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FETCHING_LOCATION: {
            return { ...state, isFetchingLocation: action.isFetchingLocation }
        }
        case SET_LOCATION_STATUS: {
            return { ...state, locationStatus: action.locationStatus }
        }
        case SET_MY_LOCATION: {
            return { ...state, latitude: action.latitude, longitude: action.longitude }
        }

        case SET_MAP_MAX_SCALE: {
            return { ...state, mapMaxScale: action.mapMaxScale }
        }

        case SET_LOCATION_REQUESTS: {
            return { ...state, locations: action.locations.map(location=>location) }
        }
        default:
            return state;
    }
}

const setFetchingLocation = (isFetchingLocation) => ({ type: SET_FETCHING_LOCATION, isFetchingLocation }) //  make button disabled
const setMyLocation = (latitude, longitude) => ({ type: SET_MY_LOCATION, latitude, longitude })
const setLocationStatus = (locationStatus) => ({ type: SET_LOCATION_STATUS, locationStatus })

const setLocationsRequests = (locations) => ({ type: SET_LOCATION_REQUESTS, locations })

export const setMapMaxScale = (mapMaxScale) => ({ type: SET_MAP_MAX_SCALE, mapMaxScale })


export const geoStatuses = {
    // rejected: 'Geolocation is not supported by your browser', // if error frmo promise
    unsupported: 'Unable to retrieve your location', // !navigator.geolocation
    pending: 'Locating…',// wait to response from api
    fullfilled: 'Successfully located'
} // success

// const getCoordinates = () =>  {
//     return new Promise(function(resolve, reject) {
//       navigator.geolocation.getCurrentPosition(resolve, reject);
//     });
//   }

const createKeyForLocationRequest = () => {
    let timestamp = + new Date()
    return `location-${timestamp}`
}


export const getMyLocation = () => async (dispatch) => {
    dispatch(setFetchingLocation(true))

    dispatch(setLocationStatus(geoStatuses.pending))

    if(!navigator.geolocation){
        dispatch(setLocationStatus(geoStatuses.unsupported))
        return null
    } 

    try {
        const position = await new Promise(function (resolve, reject) {
            let positionOption = { timeout: 20000, enableHighAccuracy: true };
            navigator.geolocation.getCurrentPosition(
                position => { 
                    resolve(position)
                }, error => {
                    // console.log(error) // or if user denied geo
                    reject(error)
                }, positionOption);
        });

        dispatch(setMyLocation(position.coords.latitude, position.coords.longitude))
        dispatch(setLocationStatus(geoStatuses.fullfilled))
 
        await idbKeyval.set(createKeyForLocationRequest(), {latitude: position.coords.latitude, longitude: position.coords.longitude });


    } catch (error) {
        dispatch(setLocationStatus(error.message))
    } 

    dispatch(setFetchingLocation(false))
}


export const getLocationRequests = () => async(dispatch) => {
    debugger

    dispatch(setFetchingLocation(true)) // we cant ask for a location while we ask for its story

    let allKeys = await idbKeyval.keys();
    let location_keys = allKeys.filter(key => key.indexOf('location-') === 0)
 

    let locations = await Promise.all(location_keys.map(async(key) => 
        await idbKeyval.get(key)
    ))
    let str_locations = locations.map(loc=> `latitude:${loc.latitude}, longitude:${loc.longitude} `)
    dispatch(setLocationsRequests(str_locations))

    dispatch(setFetchingLocation(false))
}

export default geoReducer;