# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN rm -rf dist

RUN npm run build

# Make sure to copy the .env file into the container
COPY .env ./dist/.env

# Install tzdata for timezone support
RUN apt-get update && apt-get install -y tzdata

# Set the timezone
ENV TZ=America/Mexico_City

# Expose the port that the app will listen on
EXPOSE 3000

# Start the app
CMD [ "npm", "run", "start" ]
