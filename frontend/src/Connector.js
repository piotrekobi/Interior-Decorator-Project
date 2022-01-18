export default class Connector{
    constructor(urls){
        this.URL = null;
        urls.forEach(url => {
            fetch(url)
                .then(() => {
                    if(this.URL == null)
                        this.URL = url;
                })
                .catch(() => {})
        });
        this.optimizeRectangles = this.optimizeRectangles.bind(this);
    }

    optimizeRectangles (rectangle_json, wall_json, preferred_spacing, fill_zone, task_id) {
        return fetch(this.URL + "optimizer/", {
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
        return fetch(this.URL + "createTask/")
            .then(response => response.json())
            .then(data => {return data;});
    }

    getProgress = (task_id) => {
        return fetch(this.URL + "getProgress/", {
            method: 'POST',
            body: JSON.stringify([task_id]),
        })
            .then(response => response.json())
            .then(data => {return data;});
    }

    removeTask = (task_id) => {
        return fetch(this.URL + "removeTask/", {
            method: 'POST',
            body: JSON.stringify([task_id]),
        })
            .then(response => response.json())
            .then(data => {return data;});
    }

    getWalls = () => {
        return fetch("./walls.json",
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => {return json});
    }
}