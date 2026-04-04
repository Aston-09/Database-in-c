#include <stdio.h>
#include <string.h>
#include "Data.h"

int main(){
    FILE *a;
    char c;
    data d;
    a=fopen("Astonunion.bin","ab");
    if(a==NULL){
        printf("Error Opening file");
        return 1;
    }

    do{
        printf("Enter name of employee:");
        fgets(d.name,20,stdin);
        d.name[strlen(d.name)-1]='\0';
        printf("Enter employee id :");
        scanf("%d",&d.id);
        printf("Enter Type of Verification :\n(1) for Aadhar || (2) for Passport || (3) for Driving license :");
        scanf("%d",&d.idpr);
        getchar();

        if(d.idpr == 1){
            scanf("%lld",&d.v.aadhar);
            getchar();
        }
        if(d.idpr == 2){
            fgets(d.v.pass,16,stdin);
            d.v.pass[strlen(d.v.pass)-1]='\0';
        }
        if(d.idpr == 3){
            fgets(d.v.dl,16,stdin);
            d.v.dl[strlen(d.v.dl)-1]='\0';
        }

        fwrite(&d, sizeof(data), 1, a);

        printf("Add more? (y/n): ");
        scanf(" %c",&c);
        getchar();

    }while(c =='y' || c == 'Y');

    fclose(a);
    printf("File Created Succesfully");
    return 0;
}













