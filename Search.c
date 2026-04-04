#include <stdio.h>
#include "Data.h"

int main(){
    FILE *a;
    a=fopen("Astonunion.bin","rb");
    if(a == NULL){
        printf("File Not Found");
        return 1;
    }
    data d;
    int search,found=0;
    printf("Enter Id to search :");
    scanf("%d",&search);

    while(fread(&d,sizeof(data),1,a)==1){
        if(search == d.id){
            found++;
            printf("Name : %s\n",d.name);
            printf("Employee id : %d\n",d.id);
            if(d.idpr == 1){
                printf("Aadhar card no. : %lld",d.v.aadhar);
            }
            if(d.idpr == 2){
                printf("Passport : %s",d.v.pass);
            }
            if(d.idpr == 3){
                printf("Driving License : %s",d.v.dl);
            }
            break;
        }
    }
    if(!found){
        printf("Record Not found");
    }
    fclose(a);
    return 0;
}