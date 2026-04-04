#ifndef DATA_h
#define DATA_h


#include <stdio.h>
#include <string.h>
typedef union verify{
    long long aadhar;
    char pass[16];
    char dl[16];
}verify;
typedef struct data{
    char name[20];
    int id;
    int idpr;
    verify v;
}data;

#endif