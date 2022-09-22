FROM node:18-alpine As build

WORKDIR /app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUNkill

FROM node:18-alpine As run

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:tasks:dev"]