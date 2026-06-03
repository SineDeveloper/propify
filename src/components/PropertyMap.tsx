'use client'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'

export function PropertyMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="mt-6 h-64 rounded-lg overflow-hidden">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
        <Map defaultCenter={{ lat, lng }} defaultZoom={15} mapId="prop-map">
          <AdvancedMarker position={{ lat, lng }} />
        </Map>
      </APIProvider>
    </div>
  )
}