import React, { useState } from 'react'
import geoMapClasses from './GeoMap.module.scss'

import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

// maxZoom can be maximum 19 (no more) ( make zoom 14 and max zoom 19)
// center - position - our coordinates // [50, 10]
const GeoMap = ({center, maxZoom, position}) => { 
    // const 
    // const [url, setUrl] = useState('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
    return (
        <div>
            <LeafletMap
          center={center}
          zoom={maxZoom}
          maxZoom={19}
          attributionControl={true}
                  zoomControl={true}
                  doubleClickZoom={true}
                  scrollWheelZoom={true}
                  dragging={true}
                  animate={true}
                  className={geoMapClasses.leaflet_container}
                //   easeLinearity={0.35}
          >
          <TileLayer
            url={'http://{s}.tile.osm.org/{z}/{x}/{y}.png'}
            // maxZoom={maxZoom}
            // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              Мы находимся здесь!
            </Popup>
          </Marker>
        </LeafletMap>
        </div>
      );
}
  
export default GeoMap;