# Use official Node.js image as the base image
FROM node:20-slim

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create and set the working directory inside the container
WORKDIR /app

# Install dependencies first for better cache layer usage
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application (next build)
RUN npm run build

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
