## Checklist

- [x] Users
- [x] Authentication
- [x] Authorization
- [x] Clients
- [x] Products
- [x] Warehouses
- [x] Pickups
- [x] Transfers
- [x] Deliverers
- [x] Orders (90%)
- [ ] Payments
- [ ] Events
- [ ] Messages
- [ ] Payment Agent
- [ ] Follow Up Agent

---

## API Documentaion

- [Client](https://documenter.getpostman.com/view/9802261/TWDRtLUv)

---

## [API TEST URL](http://159.203.173.224:4040) (Not Available)

---

## API Responses

- Success

```
{success: true, data: {resource}}
```

(resource: Resource Requested; example => for GET /users, {resource} would be {users: []})

- Failure

```
{success: false, data: {message, detail, type}}
```

(message: Error Message; example => "phone number is required"')
(detail: Optional Additional Message)
(type: "ClientError")

---

## How to Run

1. clone repo
2. run npm install
3. create dev.env & test.env files inside src/\_rest/config/dev.env
4. provide dev.env and test.env files with the following environment variables

   - TOKEN_SECRET (secret code for jwt signing and verifying)
   - AES_SECRET (secret code for encrypting and decrypting strings)
   - MONGO_URI (string for mongodb connection)

## Lines of Javascript: 7098

## Files of Javascript: 173

---
