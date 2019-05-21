FROM g++:latest

WORKDIR /usr/src/server

COPY . .

RUN g++ *.cpp *.hpp -o ./server


CMD ["./server"]