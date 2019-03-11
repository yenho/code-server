

all:
	docker run -t --net=host -p 127.0.0.1:8443:8443 -v "/home/yenho/src/riscv_007:/root/project" codercom/code-server --allow-http --no-auth

stop:
	docker kill $(docker ps -q) || true

.PHONY: all stop clean
