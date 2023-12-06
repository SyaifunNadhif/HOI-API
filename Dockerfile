# Use an official Node.js runtime as a parent image
FROM node:16

# Create app directory
WORKDIR /app

# Copy the package.json and package-lock.json files to /app 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to /app
COPY . /app

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["npm","start"]