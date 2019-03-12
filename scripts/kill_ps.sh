docker kill $(docker ps -q)
docker rmi -f $(docker images -q)
