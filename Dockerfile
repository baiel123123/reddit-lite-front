# ┌───────────────────────────────┐
# │ 1. Build stage: compile SPA  │
# └───────────────────────────────┘
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies (caches on package.json changes)
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build


# ┌──────────────────────────────────────────┐
# │ 2. Runtime stage: serve via Nginx (SHA)  │
# └──────────────────────────────────────────┘
FROM nginx:stable-alpine

# Remove default site
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx.conf (see below) 
COPY nginx.conf /etc/nginx/conf.d/

# Copy build artifacts
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
