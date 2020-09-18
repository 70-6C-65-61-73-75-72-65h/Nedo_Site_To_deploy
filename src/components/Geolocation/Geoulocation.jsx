import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import geoClasses from './Geolocation.module.scss';
import { getMyLocation, setMapLinkScale, geoStatuses } from '../../redux/geo-reducer';
import { maxValue19, isIneger } from '../common/formValidators';
import { reduxForm } from 'redux-form';
import { createField, Input } from '../common/FormControls';
import formStyles from '../common/FormsControls.module.scss';
 

const SetMapLocationForm = props => {
    const { handleSubmit, pristine, reset, submitting, error } = props
    return(
        <form onSubmit={handleSubmit}>
            {createField('Write your map scale...', 'mapScale', Input, [maxValue19, isIneger])}

            {
            error && 
            <div className={formStyles.formSummaryError}>
                {error}
            </div>
            }
            <div className=''>
                <button type='submit' disabled={pristine || submitting} >Send</button>
            </div>
            <div className=''>
                <button type='button' disabled={pristine || submitting} onClick={reset}>Clear</button>
            </div>

        </form>
    )
}
const SetMapLocationReduxForm = reduxForm({form: 'SetMapLocation'})(SetMapLocationForm)

const SetMapLocation = ({setMapLinkScale}) => {
    const onSubmit = (formData) => { 
        parseInt(formData['mapScale']) && setMapLinkScale(formData['mapScale'])
    }
    return (
        <SetMapLocationReduxForm onSubmit={onSubmit} />
    )
}


const getOsmHref = (osmBaseLink, mapLinkScale, latitude, longitude) => {
    return `${osmBaseLink}/#map=${mapLinkScale}/${latitude}/${longitude}`
}

const getOsmText = (latitude, longitude) => {
    return ` Latitude: ${latitude} °, Longitude: ${longitude} °`
} 


const GeolocationSnippet = ({locationStatus, osmBaseLink, latitude, longitude, 
                            mapLinkScale, isFetchingLocation,
                            getMyLocation, setMapLinkScale}) => {
 // mapLinkScale
 // setMapLinkScale

    return (
        <div className={geoClasses.geolocation}>
            { locationStatus && <p> {locationStatus} </p> }
            <button className={geoClasses.find_me} onClick={getMyLocation} disabled={isFetchingLocation} >
                Show my location
            </button>
            { locationStatus === geoStatuses.fullfilled && <><p>Watch my location on site:  
                <a href={getOsmHref(osmBaseLink, mapLinkScale, latitude, longitude)}> 
                    {getOsmText(latitude, longitude)} 
                </a>
                </p> 
                <p>Current map scale: {mapLinkScale}</p>
                <SetMapLocation setMapLinkScale={setMapLinkScale}/>
               </>
            } 
        </div>
    )
}

const mapStateToProps = (state) => ({
    latitude: state.geoLocation.latitude,
    longitude: state.geoLocation.longitude,
    mapLinkScale: state.geoLocation.mapLinkScale, 
    osmBaseLink: state.geoLocation.osmBaseLink,
    locationStatus: state.geoLocation.locationStatus,
    isFetchingLocation: state.geoLocation.isFetchingLocation,
})

export default compose(
    connect(mapStateToProps, {
        setMapLinkScale,
        getMyLocation
    })
)(GeolocationSnippet);