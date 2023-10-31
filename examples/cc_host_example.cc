#include <iostream>
#include <stdlib.h>
#include <string>

int main() 
{
    std::string input = "";
    while (1) 
    {
        input = "";
        std::getline(std::cin, input);
        if (input == "exit") 
        {
            break;
        }
        std::cout << "Você digitou: " << input << std::endl;
        fflush(stdout);
    }
    printf("Saindo do REPL.\n");
    return 0;
}
