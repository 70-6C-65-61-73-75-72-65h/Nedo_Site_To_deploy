import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import geoClasses from './Geolocation.module.scss';
import { getMyLocation, setMapMaxScale, geoStatuses, getLocationRequests } from '../../redux/geo-reducer';
import { useRangeInput } from '../common/hotEditingHook';
import GeoMap from './LeafletMap/GeoMap';

 
// const getOsmHref = (osmBaseLink, mapLinkScale, latitude, longitude) => {
//     return `${osmBaseLink}/#map=${mapLinkScale}/${latitude}/${longitude}`
// }



const getOsmText = (latitude, longitude) => {
    return ` Широота: ${latitude} °, Долгота: ${longitude} °`
} 


const GeolocationSnippet = ({locationStatus, osmBaseLink, latitude, longitude, 
                            mapMaxScale, isFetchingLocation,
                            getMyLocation, setMapMaxScale,
                            locations, getLocationRequests}) => {

    const [ onScaleChange, scale ] = useRangeInput(mapMaxScale, setMapMaxScale)
    // we use only onScaleChange // scale // editMode( make it in  scss)
    return (
        <div className={geoClasses.geolocation}>
            { locationStatus && <p> {locationStatus} </p> }
            <button className={geoClasses.find_me} onClick={getMyLocation} disabled={isFetchingLocation} >
                И где я нахожуся?
            </button>
            { locationStatus === geoStatuses.fullfilled && <>
                {/* <p>Watch my location on site:  
                <a href={getOsmHref(osmBaseLink, mapLinkScale, latitude, longitude)}> 
                    {getOsmText(latitude, longitude)} 
                </a>
                </p>  */} 
                <p>Мои координаты: {getOsmText(latitude, longitude)} </p>
                <p>Уровень масштаба: приближение в {mapMaxScale} раз </p> 
                {/* раз (относительно размера земли) */}
                <div className="slidecontainer">
                    <input type="range" min="1" max="19" value={scale} className={geoClasses.slider} onChange={onScaleChange} />
                </div>

                <GeoMap center={[latitude, longitude]} maxZoom={mapMaxScale} position={[latitude, longitude]} />

                <button onClick={getLocationRequests}>Мои запросы по локации</button>
                <div>{locations.map(
                    loc=>  <div>{loc}</div>
                )}</div>
               </>
            } 
        </div>
    )
}

const mapStateToProps = (state) => ({
    latitude: state.geoLocation.latitude,
    longitude: state.geoLocation.longitude,
    mapMaxScale: state.geoLocation.mapMaxScale, 
    osmBaseLink: state.geoLocation.osmBaseLink,
    locationStatus: state.geoLocation.locationStatus,
    isFetchingLocation: state.geoLocation.isFetchingLocation,

    locations: state.geoLocation.locations,
})

export default compose(
    connect(mapStateToProps, {
        setMapMaxScale,
        getMyLocation,
        getLocationRequests
    })
)(GeolocationSnippet);