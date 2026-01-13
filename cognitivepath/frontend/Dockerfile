# CognitivePath Frontend Dockerfile

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Expo Web port
EXPOSE 8081

# Start the application
CMD ["npx", "expo", "start", "--web"]
