# Makefile for DontPlayMe Dedicated Server

# Builds

debug: clean Symbols/DataParserDEBUG.o Symbols/SocketServerDEBUG.o Symbols/ServerDEBUG.o
	g++ -g -std=c++11 Symbols/*.o -o Build/Server_debug

release: clean Symbols/DataParser.o Symbols/SocketServer.o Symbols/Server.o
	g++ -std=c++11 Symbols/*.o -o Build/Server_release

libs: clean Symbols/DataParser.o Symbols/SocketServer.o
	@echo "Compling only the Libs"

# Symbols [Release]

Symbols/Server.o: server.cpp
	g++ -std=c++11 -c Server.cpp -o Symbols/Server.o

Symbols/SocketServer.o: includes/SocketServer.cpp includes/SocketServer.hpp
	g++ -std=c++11 -c includes/SocketServer.cpp -o Symbols/SocketServer.o

Symbols/DataParser.o: includes/DataParser.cpp includes/DataParser.hpp
	g++ -std=c++11 -c includes/DataParser.cpp -o Symbols/DataParser.o

# Symbols [Debug]

Symbols/ServerDEBUG.o: server.cpp
	g++ -g -std=c++11 -c Server.cpp -o Symbols/ServerDEBUG.o

Symbols/SocketServerDEBUG.o: includes/SocketServer.cpp includes/SocketServer.hpp
	g++ -g -std=c++11 -c includes/SocketServer.cpp -o Symbols/SocketServerDEBUG.o

Symbols/DataParserDEBUG.o: includes/DataParser.cpp includes/DataParser.hpp
	g++ -g -std=c++11 -c includes/DataParser.cpp -o Symbols/DataParserDEBUG.o

# Utils

clean:
	rm Symbols/* Build/*