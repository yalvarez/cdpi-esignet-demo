
# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the React application with a lightweight web server (e.g., Nginx)
FROM nginx:alpine

# Copy the build output from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copia tu configuración personalizada de Nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]