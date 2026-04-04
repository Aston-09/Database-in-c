#include <stdio.h>
#include "Data.h"

int main(){
    FILE *a = fopen("Astonunion.bin","rb");
    data d;

    if(a == NULL){
        printf("File not found!\n");
        return 0;
    }

    while(fread(&d, sizeof(data), 1, a) == 1){
        printf("Name : %s\nEmployee id : %d\n",d.name,d.id);

        if(d.idpr == 1)
            printf("Aadhar : %lld\n",d.v.aadhar);
        if(d.idpr == 2)
            printf("Passport : %s\n",d.v.pass);
        if(d.idpr == 3)
            printf("DL : %s\n",d.v.dl);

        printf("\n");
    }

    fclose(a);
    return 0;
}