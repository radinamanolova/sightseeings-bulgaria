mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/radinamanolova/cki4njfdc2gb719qig7ulwy2b',
    style: 'mapbox://styles/radinamanolova/ckl2lso9i1k2a18p3hjpjcnac',
    center: sightseeing.geometry.coordinates,
    zoom: 9
});

new mapboxgl.Marker()
    .setLngLat(sightseeing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5>${sightseeing.title}</h5>
                <span>${sightseeing.location}</span>`
            )
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
