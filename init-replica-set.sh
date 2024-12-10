#!/bin/bash

# Wait for MongoDB instances to be ready
sleep 20

# Initialize the replica set
docker exec mongo1 mongosh -u adminUser -p strongPassword --authenticationDatabase admin --eval '
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})
'

# Check the status of the replica set
docker exec mongo1 mongosh -u adminUser -p strongPassword --authenticationDatabase admin --eval 'rs.status()'