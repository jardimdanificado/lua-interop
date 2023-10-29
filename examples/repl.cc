#include <iostream>
#include <stdlib.h>
#include <string>

int main() 
{
    std::string input = ""; // Inicialmente, a string é nula

    //printf("Bem-vindo ao REPL em C!\n");
    //printf("Digite 'exit' para sair.\n");

    while (1) 
    {
        //printf(">>> ");
        input = "";
        std::getline(std::cin, input);
        if (input == "exit") 
        {
            break;
        }

        std::cout << "Você digitou: " << input << std::endl;
        fflush(stdout);
    }

    //free(input); // Liberar a memória alocada dinamicamente
    printf("Saindo do REPL.\n");
    return 0;
}
