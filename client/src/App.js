import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm'

const App = () => {
	const [popupOpen, setPopupOpen] = useState({});
	const [logEntries, setLogEntries] = useState([]);
	const [addEntryLocation, setAddEntryLocation] = useState(null);
	const [viewport, setViewPort] = useState({
		width: '100vw',
		height: '100vh',
		latitude: 37.6,
		longitude: -95.655,
		zoom: 3,
	});

	const getEntries = async () => {
		const logEntries = await listLogEntries();
		setLogEntries(logEntries)
	}

	useEffect(() => {
		//Work around to use async func in useEffect by calling the func immediately
		getEntries();
	}, []);

	const showAddMarkerPopup = (e) => {
		const [longitude, latitude] = e.lngLat;
		console.log(longitude, latitude);
		setAddEntryLocation({
			latitude,
			longitude
		})
	}

	return (
		<ReactMapGL
			{...viewport}
			mapStyle="mapbox://styles/dombartenope/ckeahzyqm05zv19phnzwyzbli"
			onViewportChange={setViewPort}
			mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
			onDblClick={showAddMarkerPopup}
		>
			{logEntries.map((entry) => (
				<React.Fragment key={entry._id}>
					<Marker
						latitude={entry.latitude}
						longitude={entry.longitude}
					>
						<div
							onClick={() =>
								setPopupOpen({
									[entry._id]: true,
								})
							}
						>
							<svg
								style={{
									width: `${6 * viewport.zoom}px`,
									height: `${6 * viewport.zoom}px`,
								}}
								className="marker"
								viewBox="0 0 24 24"
								strokeWidth="2"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
						</div>
					</Marker>
					{popupOpen[entry._id] ? (
						<Popup
							latitude={entry.latitude}
							longitude={entry.longitude}
							closeButton={true}
							closeOnClick={false}
							onClose={() => setPopupOpen({})}
							anchor="top"
							dynamicPosition={true}
						>
							<div className="popup">
								<h3>{entry.title}</h3>

								{entry.image ?
									<img className="image" src={entry.image} alt={entry.title} />
									: null}

								{entry.description ? <p>Description: {entry.description}</p> : null}

								{entry.comments ? <p>Comments: {entry.comments}</p> : null}

								<br />

								{entry.rating ? <small> Rating: {entry.rating} / 10
								</small> : null}

								<br />

								<small>
									Visited On: {new Date(entry.visitDate).toLocaleDateString()}
								</small>
							</div>
						</Popup>
					) : null}
				</React.Fragment>
			))}
			{addEntryLocation ? (
				<>
					<Marker
						key={addEntryLocation._id}
						latitude={addEntryLocation.latitude}
						longitude={addEntryLocation.longitude}
					>
						<div>
							<svg
								style={{
									width: `${6 * viewport.zoom}px`,
									height: `${6 * viewport.zoom}px`,
								}}
								className="addMarker"
								viewBox="0 0 24 24"
								strokeWidth="2"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
						</div>
					</Marker>
					<Popup
						latitude={addEntryLocation.latitude}
						longitude={addEntryLocation.longitude}
						closeButton={true}
						closeOnClick={false}
						onClose={() => setAddEntryLocation(null)}
						anchor="top"
						dynamicPosition={true}
					>
						<div className="popup">
							<LogEntryForm onClose={() => {
								setAddEntryLocation(null);
								getEntries();
							}}
								location={addEntryLocation}
							/>
						</div>
					</Popup>
				</>
			) : null}
		</ReactMapGL>
	);
};

export default App;
