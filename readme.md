# Poligon Server | by UMDSOFT

> Backend API for Poligon application, which is a bootcamp directory website

>Test domen http://umdsoft.uz
>
#Api for Home Page
```
/api/ui | GET
```
#Api For Slider Reklama Admin page
```
/api/slider/add | POST
/api/slider/all | GET
/api/slider/:id | PUT
/api/slider/:id | DELETE

POST
*name
*url
*image | File
*endDate | type: Date,
*status
```

## Api For Rating Product
```
/api/rating/product   | GET | GET Product by rating
/api/rating/product   | POST | Add Rating,

Post required:
    *user | User ID
    *product | Product ID
    *cost   | 1-5 | type: Number
```

## Api For Product
```
FOR Comment

/api/product/comment  |POST | Comment add
                      | PUT | Comment by id edit | Faqat komentariya egasi
                      | DELETE | Comment by id edit | Faqat komentariya egasi va admin

---> PS. id lar body da jo`natilsin
*product | Product ID
*comment | Comment

Headerda token
```
```
/api/product/    | GET    | Barcha productlar
/api/:id            | GET    | Product ID bo`yicha , Public
/api/:id             | DELETE | Product ni o`chirish, Public

/api/product/add | POST | Product kiritish

Header: Authorization: Bearer token
----Required----
*titleuz
*titleru
*category
*company
*descriptionuz
*descriptionru
*infouz
*inforu
*images | Array
*price
```

## Api For Company

```
/api/company/branch  | POST | Add Branch
    Required:
        Header: Authorization: Bearer token
    Body: 
        *company | type: ObjectID,
        *lat
        *long
        *address
        *contact
        

/api/company/all        | GET | All Companies
/api/company/:id        | GET | Company by Id
/api/company/create     | POST | Companiya yaratish uchun
/api/company/:id       | DELETE | Id bo'yicha o'chirish
/api/company/query      | GET | Query 
Required:
    Header: Authorization: Bearer token
Body: 
    *name | type: String,
    *descriptionuz 
    *descriptionru
    *file
    *category
    *address
    *contact
    
    Fro social
    - telegram
    - instagram
    - facebook

    For location
    *lat    | String
    *long   | String

    
```

## Api For News
```
/api/news/add   | POST  | Yangilik qo`shish | Protected
/api/news/all   | GET | Barcha yangiliklarni olish
/api/news/:id   | DELETE | ID bo`yicha o`chirish


POST uchun
* titleuz | String ,
* titleru | String,
* descriptionuz | String
* descriptionru | String
* category | enum: [ 'exp' , 'gor' ] 
    exp - Ekperta blog
    gor - Goryachi blog

* file | File | Rasm jo`natiladi
* tags | String , Array

Header da token
```


## Api For Category
```
/api/category   | POST | role === admin
/api/category   | GET | Public
/api/category/:id | GET | Public, Get products for category
/api/category/:id   | PUT | role === admin
/api/category/:id   | DELETE | role === admin

required: POST Method
--- Header ---
Authorization: Bearer token 

---- Body ----
*nameuz: String,
*nameru: String,
parentId: String  | Agar Subcategory bo`lsa
```

## Api For Auth

```
/api/auth/register  | POST
/api/auth/login     | POST
/api/auth/logout    | GET
/api/auth/profile   | GET
/api/auth/editavatar | POST | image
/api/auth/forgotpassword    | POST
/api/auth/resetpassword/:resettoken    | PUT

-- SMS Code orqali parol tiklash uchun --
/api/auth/forgotpasswordtosms  | POST   | body: phone
/api/auth/checkcode  | POST   | body: phone
/api/auth/editpassword  | POST  | headerda: phone va code , body: password



Protected APIs

/api/auth/profile   | GET
/api/auth/updatedetails | PUT
/api/auth/updatepassword    | PUT


```
> Register User
```
* name: String 
* phone: String
* password: String,
* email: String,
* type: Enum [ personal , business ]
```
> Login User
```
* phone, 
* password
```
> Protected API larda HEADER da token jo`natish kerak

```
Authorization: Bearer token
```
