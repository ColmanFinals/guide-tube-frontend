# Use official Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Replace .env with .env-prod
RUN cp .env-prod .env

# Build the React app
RUN npm run build

# Expose port 80
EXPOSE 443

# Start the Vite preview server
CMD ["npx", "npm", "run", "prod"]
