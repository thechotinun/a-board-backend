FROM  node:18.0.0-slim
 
# set working directory
 
RUN mkdir -p /usr/src/app
 
WORKDIR /usr/src/app
 
COPY . /usr/src/app/
 
COPY package*.json ./
RUN npm install --force

ARG PORT
ARG DATABASE_TYPE
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_NAME
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_SYNC
ARG JWT_ACCESS_SECRET
ARG JWT_ACCESS_EXPIRE
ARG JWT_REFRESH_SECRET
ARG JWT_REFRESH_EXPIRE
ARG PER_PAGE

ENV PORT=${PORT}
ENV DATABASE_TYPE=${DATABASE_TYPE}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USER=${DATABASE_USER}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_SYNC=${DATABASE_SYNC}
ENV JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
ENV JWT_ACCESS_EXPIRE=${JWT_ACCESS_EXPIRE}
ENV JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
ENV JWT_REFRESH_EXPIRE=${JWT_REFRESH_EXPIRE}
ENV PER_PAGE=${PER_PAGE}
 
# build app
RUN npm run build
 
EXPOSE 3200
# start app
 
CMD ["npm","run","start:prod"]