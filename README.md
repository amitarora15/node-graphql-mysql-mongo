# node-graphql-mysql-mongo
 First GraphQL Application on top of express used for keeping tack of Content Partner ingesting content.
#
****Technologies****

Following technologies used for implementing this application
1. Node
    1. Humps for camel case
    1. lodash for collection manipulation
    1. nodemon
    1. Winston Logger
1. GraphQL
    1. Queries
    1. Mutation
    1. Union
    1. Enum
    1. Dataloader for N+1 problem and caching
1. Express & Express GraphQL
1. Mysql
1. Mongo DB

****Usage****
* Checkout the code
* Run `npm update` on terminal


**Sample Queries**
```query greeting($greetName: String!) {
   greet(name: $greetName)
 }
 
 query getCPDetails($email: String!) {
   cp(email: $email) {
     id
     email
     firstName
     lastName
     fullName
     movies {
       id
       name
       genre
       ingestedOn
       ingestedBy {
         fullName
       }
     }
     shows {
       title
       id
       genre
       seasonCount
       ingestedBy {
         fullName
       }
     }
     counts {
       show
       movie
     }
     ingested_titles {
        ... on MovieType {
         title : name
       }
   		... on ShowType {
         title: title
       }
     }
   }
 }
 
 query findMovie($movieTitle: String!) {
   movie(title: $movieTitle) {
     name
     genre
     ingestedBy {
       fullName
       email
       movies {
         name
         genre
       }
       shows {
         title
         genre
         seasonCount
       }
     }
   }
 }
 
 query findShow($showTitle: String!) {
   show(title: $showTitle) {
     title
     genre
     seasonCount
     ingestedBy {
       fullName
       email
       movies {
         name
         genre
       }
       shows {
         title
         genre
         seasonCount
       }
     }
   }
 }
 
 mutation addCp($cp : CpInputType!){
   AddCp(cp : $cp){
     email
     fullName
     id
   }
 }
 
 mutation updateCp($modifiedCp : CpInputType!){
   UpdateCp(cp : $modifiedCp){
     email
     fullName
     id
   }
 }
 
 mutation deleteCp($deletedCpEmail : String!) {
   DeleteCp(email : $deletedCpEmail)
 }
 
 
 mutation addMovie($movie : MovieInputType!){
   AddMovie(movie : $movie){
     genre
     name
     id
     ingestedBy {
       fullName
     }
   }
 }
 ```

Sample Variables used
```
{
  "greetName": "Amit",
  "email": "balaji@gmail.com",
  "movieTitle": "P",
  "showTitle": "B",
  "cp": {
    "email": "amit.arora15@gmail.com",
    "firstName": "Amit",
    "lastName": "Arora"
  },
  "modifiedCp": {
    "email": "amit.arora15@gmail.com",
    "firstName": "Medhansh",
    "lastName": "Arora"
  },
  "deletedCpEmail": "amit.arora15@gmail.com",
  "movie": {
    "name": "Aatish",
    "genre": "thriller",
    "cpEmail": "amit.arora15@gmail.com"
  }
}
```
 