all:
	docker run -t --net=host -p 127.0.0.1:8443:8443 \
		-v "/home/yenho/src/riscv_007:/root/project" \
		codercom/code-server --allow-http --no-auth

stop:
	scripts/kill_ps.sh

init:
	wget https://github.com/codercom/code-server/releases/download/1.31.1-100/code-server-1.31.1-100-linux-x64.tar.gz
	tar zxvf code-server-1.31.1-100-linux-x64.tar.gz
	mv code-server-1.31.1-100-linux-x64 coderom

mac_init:
	wget https://github.com/codercom/code-server/releases/download/1.31.1-100/code-server-1.31.1-100-darwin-x64.zip
	tar zxvf code-server-1.31.1-100-darwin-x64.zip
	mv code-server-1.31.1-100-darwin-x64 coderom

clean:
	rm code-server-1.31.1-100-linux-x64.tar.gz

.PHONY: all stop clean init mac_init
