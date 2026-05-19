# Example for a Node.js application
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (change if needed)
EXPOSE 3000

# Command to run the app
CMD ["node", "index.js"]
