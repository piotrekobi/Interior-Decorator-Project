FROM node:16.13.1
WORKDIR /frontend

COPY package.json package-lock.json /frontend/
RUN npm install 
RUN npm install -g serve
COPY . /frontend
EXPOSE 80
RUN npm run build