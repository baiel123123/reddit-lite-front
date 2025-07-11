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

# remove the stock default
RUN rm /etc/nginx/conf.d/default.conf

# copy your one-and-only conf
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# copy build artifacts
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
