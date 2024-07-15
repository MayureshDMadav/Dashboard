# NODE Version Implementation
FROM node:18-alpine
# Create a Directory
WORKDIR /app
# Copy Package Files
COPY package*.json ./
# Implementing npm ci
RUN npm ci
# COPY whole Path
COPY . .
# Generate The Prisma Schema
RUN npx prisma generate
# Create a Build
RUN npm run build
# Exposing the PORT
EXPOSE 3000
# Starting the server
CMD ["npm", "start"]