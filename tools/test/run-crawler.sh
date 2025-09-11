#!/bin/bash
# Run the crawler test inside the Docker container

# Run the crawler test
docker exec -it mxtk-site-dev-mxtk node tools/test/crawl-regression.mjs

# Check the exit code
exit $?
