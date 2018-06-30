#!/bin/sh

export GOPATH=$HOME/go
export DOCKER_HOST_IP=172.20.0.3
export BRIDGE_LINKED_PORT=4546

$GOPATH/bin/grpcwebproxy --backend_addr=$DOCKER_HOST_IP:4545 --server_http_debug_port=9090 --backend_tls=false --backend_tls_noverify --server_bind_address=127.0.0.1 --server_tls_client_cert_verification=none --server_http_tls_port=8443 --server_tls_cert_file certs/zumepizza.dev.jchein.name.cert.pem --server_tls_key_file keys/zumepizza.dev.jchein.name.key.pem

# Usage of /Users/jheinnic/go/bin/grpcwebproxy:
#       --backend_addr string                          A host:port (IP or hostname) of the gRPC server to forward it to.
#       --backend_tls                                  Whether the gRPC server of the backend is serving in plaintext (false) or over TLS (true).
#       --backend_tls_ca_files strings                 Paths (comma separated) to PEM certificate chains used for verification of backend certificates. If empty, host CA chain will be used.
#       --backend_tls_noverify                         Whether to ignore TLS verification checks (cert validity, hostname). *DO NOT USE IN PRODUCTION*.
#       --run_http_server                              whether to run HTTP server (default true)
#       --run_tls_server                               whether to run TLS server (default true)
#       --server_bind_address string                   address to bind the server to (default "0.0.0.0")
#       --server_http_debug_port int                   TCP port to listen on for HTTP1.1 debug calls. (default 8080)
#       --server_http_max_read_timeout duration        HTTP server config, max read duration. (default 10s)
#       --server_http_max_write_timeout duration       HTTP server config, max write duration. (default 10s)
#       --server_http_tls_port int                     TCP port to listen on for HTTPS (gRPC, gRPC-Web). (default 8443)
#       --server_tls_cert_file string                  Path to the PEM certificate for server use.
#       --server_tls_client_ca_files strings           Paths (comma separated) to PEM certificate chains used for client-side verification. If empty, host CA chain will be used.
#       --server_tls_client_cert_verification string   Controls whether a client certificate is on. Values: none, verify_if_given, require. (default "none")
#       --server_tls_key_file string                   Path to the PEM key for the certificate for the server use. (default "../misc/localhost.key")
