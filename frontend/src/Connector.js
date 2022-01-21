// Copyright (c) 2022, Piotr Paturej, Miłosz Kasak, Kamil Szydłowski, Jakub Polak
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * Connector class for handling requests to backend and frontend server
 */
class Connector{
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
    }

    /**
     * Sends information about rectangles, wall, preferred spaacing, fill zone and task id to backend optimizer"
     * @param {*} rectangle_json 
     * @param {*} wall_json 
     * @param {*} preferred_spacing 
     * @param {*} fill_zone 
     * @param {*} task_id 
     * @returns {JSON}
     */
    optimizeRectangles = (rectangle_json, wall_json, preferred_spacing, fill_zone, task_id) => {
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

    /**
     * Sends request to backend so that a new task was created.
     * @returns {JSON}
     */
    createTask = () => {
        return fetch(this.URL + "createTask/")
            .then(response => response.json())
            .then(data => {return data;});
    }

    /**
     * Sends request to backend so as to receive the task status.
     * @param {*} task_id 
     * @returns {JSON}
     */
    getProgress = (task_id) => {
        return fetch(this.URL + "getProgress/", {
            method: 'POST',
            body: JSON.stringify([task_id]),
        })
            .then(response => response.json())
            .then(data => {return data;});
    }

    /**
     * Sends request to backend so that the task was removed.
     * @param {*} task_id 
     * @returns {JSON}
     */
    removeTask = (task_id) => {
        return fetch(this.URL + "removeTask/", {
            method: 'POST',
            body: JSON.stringify([task_id]),
        })
            .then(response => response.json())
            .then(data => {return data;});
    }

    /**
     * Sends request to frontend static server to receive walls collection.
     * @returns {JSON}
     */
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

export default Connector;