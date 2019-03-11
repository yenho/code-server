all:
	docker run -t --net=host -p 127.0.0.1:8443:8443 -v "/home/yenho/src/riscv_007:/root/project" codercom/code-server --allow-http --no-auth

stop:
	docker kill $(docker ps -q) || true

init:
	wget https://github.com/codercom/code-server/releases/download/1.31.1-100/code-server-1.31.1-100-linux-x64.tar.gz
	tar zxvf code-server-1.31.1-100-linux-x64.tar.gz
	mv code-server-1.31.1-100-linux-x64 coderom

.PHONY: all stop clean init
