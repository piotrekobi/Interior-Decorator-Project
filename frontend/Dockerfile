FROM node:16.13.1
WORKDIR /frontend

COPY package.json package-lock.json /frontend/
RUN npm install 
COPY . /frontend
EXPOSE 80
