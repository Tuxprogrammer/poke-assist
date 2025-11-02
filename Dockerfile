# Build stage
FROM node:22-alpine AS build

# Install git for version detection
RUN apk add --no-cache git

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files (including .git for version detection)
COPY . .

# Get git version and create VERSION file
RUN git rev-parse --short HEAD > VERSION || echo "unknown" > VERSION

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy VERSION file to nginx root for runtime access
COPY --from=build /app/VERSION /usr/share/nginx/html/VERSION

# Copy nginx configuration (optional - using default)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
