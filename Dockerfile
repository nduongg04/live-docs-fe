# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --quiet
COPY . .
RUN npm run build

# Run stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --chown=node:node --from=build /app/.next ./.next
COPY --chown=node:node --from=build /app/public ./public
COPY --chown=node:node package*.json ./

RUN npm ci --only=production --quiet \
    && npm cache clean --force

RUN rm -rf /root/.npm

USER node
EXPOSE 3000
CMD ["npm", "run", "start"]