#include <unistd.h> 
#include <stdio.h> 
#include <sys/socket.h> 
#include <stdlib.h> 
#include <netinet/in.h> 
#include <string.h> 

#define PORT 8080 

#ifndef SocketServer_H
#define SocketServer_H

class SocketServer
{
private:
    /* data */
public:
    // Structs
    typedef struct SocketData
    {
        // Simple Data Structure to Test the Server
        char Header[13];
        char Body[1025];
        char Checksum[26];
    } SOCKETDATA, *PSOCKETDATA;
    

    // Functions
    SocketServer(/* [TODO] Possible Args? */); // Constructor
    ~SocketServer(); // Destructor

    void Start(); // Starts Server [TODO] Change Sig to return a Handle?

    void ErrorHandler(char* error); // Handles Server Errors
    SocketServer::SocketData Parser(int clientSocket); // Parses incoming data from the TCP Socket
    void Responder(int clientSocket); // Sends a message back to the client
};

#endif