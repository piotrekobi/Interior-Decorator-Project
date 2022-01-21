<!--
 Copyright (c) 2022, Piotr Paturej, Miłosz Kasak, Kamil Szydłowski, Jakub Polak
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
-->

# The interiors (Wnętrza)

Supporting interior design and optimizing distribution of rectangles on the plane system.

## Table of contents

* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [External documentation](#external-documentation)

## General info

The system is supposed to function under the following circumstances:

It is given 

* representing a wall fragment polygon (e.g. a wall without an opening door),
* a set of rectangles that represent photographs.

The system's task is to arrange the rectangles inside the polygon in an optimal way, taking into account the set limitations.

Additional requirements:

* the user draws a closed shape inside the polygon, in which rectangles should be placed in the first order,
* the user specifies the preferred distance between adjacent rectangles
* the user might determine the position himself (using the mouse) of selected rectangles.

## Technologies

* Python 3.9

  * Django
* CSS
* JavaScript

  * React
* Azure App Service
* Azure Container Registry

## Setup

To run this project, you have to install Docker on your own (https://docs.docker.com/get-docker/).

Firstly build an image from a docker-compose.yml file:

```shell
docker-compose build
```

Nextly run your dockerized frontend and backend:

```shell
docker-compose up -d
```

The frontend will be available on the port 80 on your server.

<b>NOTE:</b> Please make sure that the port 80 is opened on your server.

Optionally, push the image to a remote container registry:

```Shell
docker login <registry-name> --username <your-login> --password <your-password>
docker-compose push
```

Using a container registry, you may configure a continuous deployment, e.g. on Azure App Service (you have to install Azure Command-Line Interface (CLI) (https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest) and configure Azure App Service on your own (https://docs.microsoft.com/pl-pl/azure/app-service/tutorial-custom-container?pivots=container-linux)):

```Shell
az login
az webapp config container set --name <app-name> --resource-group <resource-group-name> --docker-custom-image-name <registry-name>:latest --docker-registry-server-url https://<registry-name> --multicontainer-config-file ./docker-compose.yml --multicontainer-config-type COMPOSE
```

## External documentation

The external documentation to this project is available at: https://wutwaw-my.sharepoint.com/:w:/g/personal/01149776_pw_edu_pl/ERFwC562_TxKpRWO-G5JevoBvFkfv5xQ1JQExNKD09wu9w?e=xroj7R

It contains:

* requirements specification
* specification of use cases
* definition of architecture
* analytical and design specification
* user's and administrator's manuals.