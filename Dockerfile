# Phase 1: Build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build the app. Ensure VITE_URL is passed during build if needed, 
# or use a default that can be overridden by a config file.
RUN npm run build

# Phase 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Add custom nginx config if needed, otherwise default is fine
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
