#include "includes/SocketServer.hpp"

int main(int argc , char** argv)
{
    // Start the Server
    SocketServer sServer;
    sServer.Start();

    return 0;
}