#include "DataParser.hpp"

using std::string;

void DataParser::Parse(char* stringToParse)
{

    int numOfObjects = 0;
    int objectStart, objectEnd;
    size_t pos = 0;
    string s2P(stringToParse);
    printf("RAW Object -> %s\n", s2P.c_str());
    // Assume data is formatted correctly [TODO] Change this!!

    // Determine the amount of objects
    for (size_t i = 0; i < s2P.size(); i++)
    {
        // [TODO] Add Escape Char detection
        if(s2P.at(i) == '|') 
        {
            numOfObjects++;
            printf("%s\n", s2P.substr(i, i + 2).c_str());
        }
        
    }

    numOfObjects = numOfObjects / 2;

    printf("Detected Object -> %d\n", numOfObjects);


    // Extract the data
    for (size_t z = 0; z < numOfObjects; z++)
    {
        string sObj;
        // // Get the Object Boundaries
        // objectStart = s2P.find("|", pos);
        // printf("Detected Object Start -> %d\n", objectStart);
        // objectEnd = s2P.find("|", objectStart);
        // printf("Detected Object End -> %d\n", objectEnd);
        // sObj = s2P.substr(objectStart, objectEnd);
        if(stringToParse[z] == '|')
        {
            for (size_t x = z; x < strlen(stringToParse); x++)
            {
                if(stringToParse[x] == '|')
                {
                    sObj = s2P.substr(z + 1, x - 1);
                }
            }
        }

        // Get the data from the object
        printf("Extracted Object -> %s\n", sObj.c_str());

        // Move the pos to look after the current object
        pos = objectEnd;
    }
    
}

