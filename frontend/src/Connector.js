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

    optimizeRectangles (rectangle_json, wall_json, preferred_spacing, fill_zone, task_id) {
        console.log(this.backendURL);
        return fetch(this.backendURL + "optimizer/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{rectangle_json, wall_json, preferred_spacing, fill_zone, task_id}])
        })
            .then(response => response.json())
            .then(data => {return data;});
    }

    createTask = () => {
        return fetch(this.backendURL + "createTask/")
            .then(response => response.json())
            .then(data => {return data;});
    }

    getProgress = (task_id) => {
        return fetch(this.backendURL + "getProgress/", {
            method: 'POST',
            body: JSON.stringify([task_id]),
        })
            .then(response => response.json())
            .then(data => {return data;});
    }

    removeTask = (task_id) => {
        return fetch(this.backendURL + "removeTask/", {
            method: 'POST',
            body: JSON.stringify([task_id]),
        })
            .then(response => response.json())
            .then(data => {return data;});
    }
}