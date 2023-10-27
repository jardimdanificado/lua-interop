#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() 
{
    char *input = NULL; // Inicialmente, a string é nula
    size_t inputSize = 0;

    //printf("Bem-vindo ao REPL em C!\n");
    //printf("Digite 'exit' para sair.\n");

    while (1) 
    {
        //printf(">>> ");

        // Usar getline para ler a linha e alocar memória dinamicamente
        if (getline(&input, &inputSize, stdin) == -1) 
        {
            perror("Erro ao ler a entrada");
            break;
        }

        // Remova o caractere de nova linha do final da entrada
        input[strcspn(input, "\n")] = '\0';

        if (strcmp(input, "exit") == 0) 
        {
            break;
        }

        printf("Você digitou: %s", input);
        fflush(stdout);
    }

    free(input); // Liberar a memória alocada dinamicamente
    printf("Saindo do REPL.\n");
    return 0;
}
