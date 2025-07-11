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

# 1) Remove the stock default config inside the container
RUN rm /etc/nginx/conf.d/default.conf

# 2) Copy your one-and-only config into conf.d/
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# 3) Copy the built app
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
