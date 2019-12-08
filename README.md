# About crypto-mon
- This is simple Prometheus exporter sets to support metrics of crypto currency prices and volumes
- Supporting exporters: upbit-exporter


# How to build
```
$ git clone https://github.com/sshtel/crypto-mon/
$ cd crypto-mon/upbit-exporter && docker build -t upbit-exporter .
```

# How to operate services
- You need Docker and docker-compose(optional) to launch server instances
- docker-compose.yml defines all service 
```
$ docker-compose up -d prometheus node-exporter upbit-exporter grafana
```

# Prometheus configs
- prometheus.yml defines Prometheus configures 
- refer to https://prometheus.io/docs/prometheus/latest/configuration/configuration/ for details
```
global:
  scrape_interval:     15s # By default, scrape targets every 15 seconds.

  # Attach these labels to any time series or alerts when communicating with
  # external systems (federation, remote storage, Alertmanager).
  # external_labels:
  #   monitor: 'codelab-monitor'

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'upbit-exporter'
    # Override the global default and scrape targets from this job every 5 seconds.
    scrape_interval: 5s
    static_configs:
      - targets: [ 'upbit-exporter.com:3001' ]
      #- targets: [ 'docker.for.mac.localhost:3030' ]

  - job_name: 'node-exporter'
    scrape_interval: 5s
    static_configs:
      - targets: [ 'node-exporter.com:9100' ]
```



# Tech stacks
- Dependencies: Prometheus, Grafana
