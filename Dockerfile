# -----------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm ci
COPY . .
RUN npm run build

# -----------------------------------------
# 2) PRODUCTION STAGE
# -----------------------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# If your server code is not in "build" but in root, copy it over
COPY --from=builder /app/server.js ./

# Expose the port your server will listen on
EXPOSE 3000

# Start the Node.js server in production
CMD ["npm", "run", "start"]
   