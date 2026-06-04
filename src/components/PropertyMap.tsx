'use client'

import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import { MapPin } from 'lucide-react'

export function PropertyMap({ lat, lng }: { lat: number; lng: number }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

    if (!apiKey) {
        return (
            <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200 bg-white">
                <div className="flex h-64 items-center justify-center bg-[linear-gradient(135deg,#f4f4f5_25%,transparent_25%),linear-gradient(225deg,#f4f4f5_25%,transparent_25%),linear-gradient(45deg,#f4f4f5_25%,transparent_25%),linear-gradient(315deg,#f4f4f5_25%,#fafafa_25%)] bg-[length:32px_32px] bg-[position:16px_0,16px_0,0_0,0_0]">
                    <div className="rounded-lg bg-white px-4 py-3 text-center shadow-sm ring-1 ring-zinc-200">
                        <MapPin className="mx-auto size-6 text-zinc-950" />
                        <p className="mt-2 text-sm font-medium text-zinc-950">
                            Location preview
                        </p>
                        <p className="text-xs text-zinc-500">
                            {lat.toFixed(4)}, {lng.toFixed(4)}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-8 h-64 overflow-hidden rounded-lg border border-zinc-200">
            <APIProvider apiKey={apiKey}>
                <Map defaultCenter={{ lat, lng }} defaultZoom={15} mapId="prop-map">
                    <AdvancedMarker position={{ lat, lng }} />
                </Map>
            </APIProvider>
        </div>
    )
}
