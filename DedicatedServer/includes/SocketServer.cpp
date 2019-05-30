#include "SocketServer.hpp"
#include "DataParser.hpp"


SocketServer::SocketServer(/* args */) // Constructor
{}

SocketServer::~SocketServer() // Destructor
{}

void SocketServer::Start() // Starts the Server
{
    struct sockaddr_in address; 
    int server_fd, new_socket; 
    int opt = 1, addrlen = sizeof(address);

    // UNIX ~ "Everything is a FILE" :P
     if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) this->ErrorHandler((char*)"socket failed");
       
    // Forcefully attaching socket to the port 8080 
    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt))) this->ErrorHandler((char*)"setsockopt");

    address.sin_family = AF_INET; 
    address.sin_addr.s_addr = INADDR_ANY; 
    address.sin_port = htons( PORT ); // Currently the PORT is a macro/constant [TODO] Might change this in a later revision with the constructor
       
    // Forcefully attaching socket to the port 8080 
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address))<0) this->ErrorHandler((char*)"bind failed");

    if (listen(server_fd, 3) < 0) this->ErrorHandler((char*)"listen");

    if ((new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen))<0) this->ErrorHandler((char*)"accept");

    // [TODO] Change to a loop after testing the Class
    this->Parser(new_socket);
    this->Responder(new_socket);
}

SocketServer::SocketData SocketServer::Parser(int clientSocket) // Parses data from the client [TODO] VSCode shows as an error IGNORE it
{
    int readStatus;
    SocketServer::SocketData sockData;
    char tmpBuffer[1061];
    // memset(&tmpBuffer, 0xFF, 1062);

    // Read from the Socket
    readStatus = read( clientSocket , tmpBuffer, 1061);

    // Parse the data into the struct
    memcpy(sockData.Header, tmpBuffer, 13);
    memcpy(sockData.Checksum, tmpBuffer + 11, 25);
    memcpy(sockData.Body, tmpBuffer + 37, 1025);

    // 
    sockData.Header[12] = '\0';
    sockData.Checksum[25] = '\0';
    sockData.Body[1024] = '\0';

    // [DEBUG] Test
    printf("SocketData -> Header %ld %s\n\n", strlen(sockData.Header), sockData.Header);
    printf("SocketData -> Body %ld %s\n\n", strlen(sockData.Body), sockData.Body);
    printf("SocketData -> Checksum %ld %s\n", strlen(sockData.Checksum), sockData.Checksum);

    // Parse JSON
    DataParser dParser;
    dParser.Parse(sockData.Body);

    // Return the Parsed Data
    return sockData;
}

void SocketServer::Responder(int clientSocket)
{
    send(clientSocket , "TEST" , strlen("TEST") , 0 ); 
    printf("Message sent\n"); 
}

void SocketServer::ErrorHandler(char* error) // Handles Errors from the Server/
{
    // Basic impliemintation
    perror(error); 
    exit(EXIT_FAILURE); 
}