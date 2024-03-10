'use client';
import React, { useState, useEffect } from "react";
import DeckGL from '@deck.gl/react';
import { GeoArrowScatterplotLayer } from "@geoarrow/deck.gl-layers";
import * as arrow from "apache-arrow";
import { MapView } from '@deck.gl/core';
import "mapbox-gl/dist/mapbox-gl.css";
import Map from 'react-map-gl';
import { Slider } from "@nextui-org/react";
import GetData from "./GetData";

const INITIAL_VIEW_STATE = {
    longitude: -121.3153,
    latitude: 44.0582,
    zoom: 9,
    pitch: 0,
    bearing: 0
};

export default function GeoArrow() {
    const [table, setTable] = useState(null);
    const [layers, setLayers] = useState([]);
    const [month, setMonth] = useState(6);
    const [RowCount, setRowCount] = useState(null);
    const [Time, setTime] = useState(null);

    // Assuming the data URL depends on the month
    // If the data URL does not change, you should adjust this approach.
    useEffect(() => {
        const fetchData = async () => {
            const start = new Date();
            const GEOARROW_POINT_DATA = `http://127.0.0.1:8080/movement_wbounds_${month}.feather`;
            const response = await fetch(GEOARROW_POINT_DATA);
            const buffer = await response.arrayBuffer();
            const table = arrow.tableFromIPC(buffer);
            setTable(table);
            console.log(table.numRows)
            setRowCount(table.numRows)
            const layer = new GeoArrowScatterplotLayer({
                id: "geoarrow-points",
                data: table,
                getFillColor: table.getChild("colors"),
                opacity: 0.5,
                getRadius: 50,
                radiusMinPixels: 0.1,
                getPosition: table.getChild("geometry")
            });

            setLayers([layer]);
            const end = new Date();
            setTime(end - start);
        };

        fetchData();
    }, [month]); // Dependency array includes month, so effect runs when month changes

    // Handler to update the month state based on slider change
    const handleSliderChange = (value) => {
        setMonth(value);
    };

    return (
        <main className="relative flex flex-grow">
            <div className="absolute top-3 left-3 z-10 px-4 py-2 bg-slate-600 hover:bg-green-600 rounded-lg font-mono text-white">
                Month: {month} <br />
                Year: 2020 <br />
                Time to Load: {Time}ms <br />
                Rows Returned: {RowCount} <br />
                <GetData />
            </div>
            <Slider
                aria-label="Month"
                step={1}
                maxValue={12}
                minValue={1}
                defaultValue={6}
                value={month}
                onChange={handleSliderChange}
                className="absolute top-3 left-60 z-10 max-w-md"
            />
            <div>
                <DeckGL
                    initialViewState={INITIAL_VIEW_STATE}
                    layers={layers}
                    style={{ width: '100%', height: '100%' }}
                >
                    <MapView id="map" controller={true}>
                        <Map
                            mapStyle="mapbox://styles/mapbox/dark-v11"
                            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                            className="w-full h-full"
                        />
                    </MapView>
                </DeckGL>
            </div>
        </main>
    );
}
