'use client';

import { useState, useEffect } from "react";
import MapView from "./components/MapView";
import { states, cities, categories, mockEvents } from "./data/mockData";
import { format, parseISO, startOfDay, endOfDay, addDays, isWithinInterval } from 'date-fns';

export default function Home() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [userLocation, setUserLocation] = useState({ latitude: 37.7749, longitude: -122.4194 });
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced filtering logic
  useEffect(() => {
    setIsLoading(true);
    let filtered = mockEvents;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.text.toLowerCase().includes(searchLower) ||
        event.venue.name.toLowerCase().includes(searchLower) ||
        event.venue.address.localized_address_display.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = startOfDay(new Date());
      filtered = filtered.filter(event => {
        const eventDate = parseISO(event.start.local);
        switch (dateFilter) {
          case 'today':
            return isWithinInterval(eventDate, {
              start: today,
              end: endOfDay(today)
            });
          case 'week':
            return isWithinInterval(eventDate, {
              start: today,
              end: endOfDay(addDays(today, 7))
            });
          case 'month':
            return isWithinInterval(eventDate, {
              start: today,
              end: endOfDay(addDays(today, 30))
            });
          default:
            return true;
        }
      });
    }

    // Location filter
    if (selectedCity) {
      const cityData = Object.values(cities)
        .flat()
        .find(city => city.value === selectedCity);

      if (cityData) {
        filtered = filtered.filter(event => {
          const eventLat = Number(event.venue.latitude);
          const eventLng = Number(event.venue.longitude);
          const distance = calculateDistance(
            eventLat,
            eventLng,
            cityData.coordinates.lat,
            cityData.coordinates.lng
          );
          return distance <= 50; // Within 50km
        });

        // Sort by distance
        filtered.sort((a, b) => {
          const distA = calculateDistance(
            Number(a.venue.latitude),
            Number(a.venue.longitude),
            cityData.coordinates.lat,
            cityData.coordinates.lng
          );
          const distB = calculateDistance(
            Number(b.venue.latitude),
            Number(b.venue.longitude),
            cityData.coordinates.lat,
            cityData.coordinates.lng
          );
          return distA - distB;
        });
      }
    }

    setFilteredEvents(filtered);
    setIsLoading(false);
  }, [selectedState, selectedCity, selectedCategory, searchTerm, dateFilter]);

  // Handle state selection
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedCity("");

    if (newState) {
      const firstCity = cities[newState][0];
      setUserLocation({
        latitude: firstCity.coordinates.lat,
        longitude: firstCity.coordinates.lng
      });
    }
  };

  // Handle city selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);

    const cityData = Object.values(cities)
      .flat()
      .find(city => city.value === newCity);

    if (cityData) {
      setUserLocation({
        latitude: cityData.coordinates.lat,
        longitude: cityData.coordinates.lng
      });
    }
  };

  // Add a helper function for consistent date formatting
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MM/dd/yyyy, h:mm a');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            Discover Local Events
          </h1>
          <p className="text-gray-600 text-lg">Find amazing events happening near you</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 max-w-4xl mx-auto text-black">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">State</label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                disabled={!selectedState}
              >
                <option value="">Select City</option>
                {selectedState &&
                  cities[selectedState].map(city => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* New filters: Search and Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Events</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or location..."
                  className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Next 7 Days</option>
                <option value="month">Next 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Event List */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[700px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Events
                  <span className="ml-2 text-lg text-indigo-600">({filteredEvents.length})</span>
                </h2>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No events found for the selected filters.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEvents.map((event: any) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <h3 className="font-bold text-lg text-gray-900">{event.name.text}</h3>
                      <div className="flex items-center gap-2 mt-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">{formatEventDate(event.start.local)}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.venue.name}</p>
                          <p className="text-sm">{event.venue.address.localized_address_display}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="space-x-2">
                          {event.category && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {event.category}
                            </span>
                          )}
                          {event.ticket_availability && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${event.ticket_availability.has_available_tickets
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {event.ticket_availability.has_available_tickets
                                ? `From ${event.ticket_availability.minimum_ticket_price?.display || 'Free'}`
                                : 'Sold Out'}
                            </span>
                          )}
                        </div>
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                          View Details →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:w-2/3">
            <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white h-[700px]">
              <MapView userLocation={userLocation} events={filteredEvents} />
            </div>
          </div>
        </div>
      </div>
    </main >
  );
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}