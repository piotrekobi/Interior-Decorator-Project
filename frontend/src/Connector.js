export default class Connector{
    constructor(urls){
        this.backendURL = null;
        urls.forEach(url => {
            fetch(url)
                .then(() => {
                    if(this.backendURL == null)
                        this.backendURL = url;
                })
                .catch(() => {})
        });
        this.optimizeRectangles = this.optimizeRectangles.bind(this);
    }

    optimizeRectangles (rectangle_json, wall_json, preferred_spacing) {
        console.log(this.backendURL);
        return fetch(this.backendURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{rectangle_json, wall_json, preferred_spacing}])
        })
            .then(response => response.json())
            .then(data => {return data;});
    }
}