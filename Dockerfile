FROM node:20.11.1-alpine3.19 AS build
# Set the working directory
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .
RUN npm run build --configuration=production



# Stage 2: Serve the application with nginx
FROM nginx:1.25.4-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY  --from=build /app/dist/job-sourcing-frontend-v1/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80


