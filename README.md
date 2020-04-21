docker network create my-network

docker run \
    --name postgres \
    -e POSTGRES_USER=willianreis \
    -e POSTGRES_PASSWORD=minhasenha \
    -e POSTGRES_DB=docker-postgres \
    -p 5432:5432 \
    -d \
    --network my-network \
    postgres

docker ps 
docker exec -it postgres bash

docker run \
    --name adminer \
    -p 8080:8080 \
    --network my-network \
    -d \
    adminer

docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
    -d \
    --network my-network \
    mongo:4

docker run \
    --name mongoclient \
    -p 3000:3000 \
    --network my-network \
    -d \
    -e MONGO_URI="mongodb://localhost:27017/admin" \
    mongoclient/mongoclient

docker exec -it mongodb \
    mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
    --eval "db.getSiblingDB('docker-mongo').createUser({user: 'willianreis', pwd: 'minhasenha', roles: [{role:'readWrite', db: 'docker-mongo'}]})"