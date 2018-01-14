## **SetUp:**

Pull This repo `git clone https://github.com/saikatharryc/tweeterThing-stream.git`

and the go to `tweeterThing-stream` folder .
and run following command : 
```
npm install  
```

Get **twitter-app** credentials from here : [click here](https://apps.twitter.com/)

and place those in `/config.js` :
```
	consumer_key: "xxxxxxxxxx",
    consumer_secret: "xxxxxxxxx",
    access_token_key: "xxxxx-xxxxxxx",
    access_token_secret: "xxxxxxx"
```

## **RUN:*

To run the app run following command:
```
npm start
```
and Boom! its Running in port `3000` (by default),  
[http://localhost:3000](http://localhost:3000)



## **APIs:**

**To Register User :**

*method* :  **POST**

*url* : `localhost:3000/api/auth/register`
*payload*:
```
{
	"username":"yuor_username",
	"password":"your_passsword"
}
```


**To Login User :**

*method* :  **POST**

*url* : `localhost:3000/api/auth/login`
*payload*:
```
{
	"username":"yuor_username",
	"password":"your_passsword"
}
```


**To Get User List :**

*method* :  **Get**

*url* : `localhost:3000/api/user/list`

*Header* : `x-access-token : TOKEN_GET_FROM_LOGIN`



**To Get Tweeter Data :**

*method* :  **Get**

*url* : `http://localhost:3000/api/v1/client?key=hi`

*query-param* : Optional, by default searches with `HI` keyword.

*Header* : `x-access-token : TOKEN_GET_FROM_LOGIN`




*To pass the headers, i'm using [Modify Header extension](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj) for chrome*

*i know code is little messy,will fix it soon*
