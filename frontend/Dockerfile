FROM node:16.13.1
WORKDIR /frontend

COPY package.json package-lock.json ./frontend
RUN npm install 
RUN npm install react-scripts@4.0.3 -g 
COPY . ./frontend
EXPOSE 80