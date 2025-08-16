'use client';
import { useState, useEffect } from 'react';
import { Map, Marker, Popup } from 'react-map-gl';
import type { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Define the Event type
type Event = {
    id: string;
    name: { text: string };
    description: { text: string };
    start: { local: string };
    url: string;
    venue: {
        latitude: string;
        longitude: string;
        name: string;
        address: {
            localized_address_display: string;
        };
    };
    ticket_availability?: {
        has_available_tickets: boolean;
        minimum_ticket_price?: {
            display: string;
        };
    };
};

// Define the component props interface
interface MapViewProps {
    userLocation: {
        latitude: number;
        longitude: number;
    };
    events: Event[];
}

type MapViewState = {
    latitude: number;
    longitude: number;
    zoom: number;
    bearing: number;
    padding: { top: number; bottom: number; left: number; right: number };
    pitch: number;
};

function MapView({ userLocation, events }: MapViewProps) {
    const [viewState, setViewState] = useState<MapViewState>({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        zoom: 13,
        bearing: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        pitch: 0
    });
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        setViewState(v => ({
            ...v,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
        }));
    }, [userLocation]);

    const handleMove = (evt: { viewState: MapViewState }) => {
        setViewState(evt.viewState);
    };

    return (
        <Map
            {...viewState}
            onMove={handleMove}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
            {/* User location marker */}
            <Marker
                latitude={userLocation.latitude}
                longitude={userLocation.longitude}
            >
                <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg pulse-animation" />
            </Marker>

            {/* Event markers */}
            {events.map(event => (
                <Marker
                    key={event.id}
                    latitude={Number(event.venue.latitude)}
                    longitude={Number(event.venue.longitude)}
                    onClick={(e: { originalEvent: MouseEvent }) => {
                        e.originalEvent.stopPropagation();
                        setSelectedEvent(event);
                    }}
                >
                    <div className="cursor-pointer transform hover:scale-110 transition-transform">
                        <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-lg" />
                    </div>
                </Marker>
            ))}

            {/* Popup for selected event */}
            {selectedEvent && (
                <Popup
                    latitude={Number(selectedEvent.venue.latitude)}
                    longitude={Number(selectedEvent.venue.longitude)}
                    onClose={() => setSelectedEvent(null)}
                    closeButton={true}
                    closeOnClick={false}
                    className="z-50"
                    offset={25}
                >
                    <div className="p-3 max-w-xs">
                        <h3 className="font-bold text-sm mb-1">{selectedEvent.name.text}</h3>
                        <p className="text-xs text-gray-600 mb-2">
                            {new Date(selectedEvent.start.local).toLocaleString()}
                        </p>
                        <p className="text-xs mb-2">{selectedEvent.venue.name}</p>
                        <p className="text-xs text-gray-500 mb-2">
                            {selectedEvent.venue.address.localized_address_display}
                        </p>
                        {selectedEvent.ticket_availability && (
                            <p className={`text-xs font-semibold ${selectedEvent.ticket_availability.has_available_tickets
                                ? 'text-emerald-600'
                                : 'text-red-600'
                                }`}>
                                {selectedEvent.ticket_availability.has_available_tickets
                                    ? `From ${selectedEvent.ticket_availability.minimum_ticket_price?.display || 'Free'}`
                                    : 'Sold Out'}
                            </p>
                        )}
                        <a
                            href={selectedEvent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium block mt-2"
                        >
                            View Details →
                        </a>
                    </div>
                </Popup>
            )}
        </Map>
    );
}

export default MapView;
