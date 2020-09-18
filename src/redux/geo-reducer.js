const SET_MY_LOCATION = 'SET_MY_LOCATION'; // set latitude and longitude // set mapLink href textContent
const SET_LOCATION_STATUS = 'SET_LOCATION_STATUS'; // locationStatus

// // set mapLink href textContent
const SET_MAP_LINK_SCALE = 'SET_MAP_LINK_SCALE'; // set mapLink scale #map query
const SET_FETCHING_LOCATION = 'SET_FETCHING_LOCATION'

const OSM_BASE_LINK = `https://www.openstreetmap.org/`;

let initialState = {
    locationStatus: null,

    latitude: null,
    longitude: null,

    mapLinkScale: 14,

    isFetchingLocation: false,

    osmBaseLink: OSM_BASE_LINK,
    
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

        case SET_MAP_LINK_SCALE: {
            return { ...state, mapLinkScale: action.mapLinkScale }
        }
        default:
            return state;
    }
}

const setFetchingLocation = (isFetchingLocation) => ({ type: SET_FETCHING_LOCATION, isFetchingLocation }) //  make button disabled
const setMyLocation = (latitude, longitude) => ({ type: SET_MY_LOCATION, latitude, longitude })
const setLocationStatus = (locationStatus) => ({ type: SET_LOCATION_STATUS, locationStatus })

export const setMapLinkScale = (mapLinkScale) => ({ type: SET_MAP_LINK_SCALE, mapLinkScale })


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

export const getMyLocation = () => async (dispatch) => {
    dispatch(setFetchingLocation(true))

    dispatch(setLocationStatus(geoStatuses.pending))

    if(!navigator.geolocation){
        dispatch(setLocationStatus(geoStatuses.unsupported))
        return null
    } 

    try {
        const position = await new Promise(function (resolve, reject) {
            let positionOption = { timeout: 500, enableHighAccuracy: true };
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

    } catch (error) {
        dispatch(setLocationStatus(error.message))
    } 

    dispatch(setFetchingLocation(false))
}


export default geoReducer;