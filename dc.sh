#!/usr/bin/env bash

ALL="prometheus grafana node-exporter redis upbit-exporter"

case $1 in
	down)
		if [[ $2 ]]; then
			docker-compose stop $2
			docker-compose rm -f $2
			exit 0
		fi
		docker-compose stop $ALL
		docker-compose rm -f $ALL
		exit 0
		;;
	exec)
		docker-compose $@
		exit 0
		;;
	reup)
		if [[ $2 ]]; then
			docker-compose stop $2
			docker-compose rm -f $2
			docker-compose up -d $2
			docker-compose logs -f $2
			exit 0
		fi
		echo "Warning: `reup` takes a service name"
		exit 1
		;;
esac

for last; do true; done
if [[ $ALL == *"$last"* ]]; then
	docker-compose $@
	exit 0
fi

docker-compose $@ $ALL
