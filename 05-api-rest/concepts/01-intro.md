# RESTful API

A **RESTful API** (Representational State Transfer Application Programming Interface) is an architectural style for networked applications that enables two computers or software systems to communicate predictably over standard web protocols, primarily **HTTP**.

In REST architecture, data and functionality are treated as **resources**, each identified by a unique Uniform Resource Identifier (URI). Clients interact with these resources by exchanging representations of their state—most commonly formatted in **JSON** (JavaScript Object Notation).

## Vocabulary

### URI

A URI (Uniform Resource Identifier) is a string of characters that identifies a resource, while a URL (Uniform Resource Locator) or URN (Uniform Resource Name) is a spcecific type of URI. 
So a URI is an umbrella term over URL and URN, URL and URN are specific types of URIs.

> All URLs and URNs are URIs, but not all URIa are URLs or URNs

### URL

A URL, is a type of URI that tells you **how** to get to a resource by providing its primary access mechanism or network location. If it has an eplicit protocol web scheme like `http://`, `https://`, or `ftp://`, it is a URL.

### URN

A URN is a type of URI that uses the `urn` scheme to identify a resource by a globally unique and persistent name within a specific namespace. It doesn't care where the resource is hosted or if it's even online right now.


---

## The 6 Guiding Principles of REST

To be considered strictly "RESTful," an API must follow six architectural constraints established by computer scientist Roy Fielding in 2000:

1. **Client-Server Separation:** The user interface (client) and data storage/business logic (server) are completely decoupled. Either can be updated or replaced independently as long as the interface format does not change.
2. **Statelessness:** The server does not store any client session context between requests. Every incoming request must contain all the information necessary to understand and process it (such as authentication tokens, parameters, and payloads).
3. **Cacheability:** Responses must explicitly declare whether they can be cached by the client or intermediary proxies. Caching prevents clients from repeatedly fetching unchanged data, reducing latency and server load.
4. **Uniform Interface:** A standardized interaction model across the entire API, built on four tenets:
* **Resource identification:** Individual resources are addressed by stable URIs (e.g., `/api/v1/customers/42`).
* **Manipulation via representations:** Holding a representation of a resource (like JSON) alongside appropriate permissions gives the client enough information to modify or delete it.
* **Self-descriptive messages:** Each message includes enough metadata (like headers such as `Content-Type: application/json`) to tell the receiver how to parse it.
* **Hypermedia as the Engine of Application State (HATEOAS):** Responses can include hypermedia links pointing to related actions or resources the client can access next.


5. **Layered System:** A client typically cannot tell whether it is connected directly to the end server or to an intermediary (such as a load balancer, reverse proxy, or API gateway). This improves scalability and security.
6. **Code on Demand (Optional):** Servers can temporarily extend client functionality by transferring executable code (such as JavaScript scripts or compiled applets).

---

## How RESTful APIs Work in Practice

REST maps standard database operations—often called **CRUD** (Create, Read, Update, Delete)—directly to standard **HTTP Methods**.

### HTTP Method to CRUD Mapping

| HTTP Method | CRUD Operation | Purpose | Example Endpoint | Expected Status |
| --- | --- | --- | --- | --- |
| **GET** | Read | Retrieve a resource or collection | `GET /books/978-0132350884` | `200 OK` |
| **POST** | Create | Create a new resource | `POST /books` | `201 Created` |
| **PUT** | Update (Replace) | Completely overwrite an existing resource | `PUT /books/978-0132350884` | `200 OK` |
| **PATCH** | Update (Partial) | Modify specific fields of an existing resource | `PATCH /books/978-0132350884` | `200 OK` |
| **DELETE** | Delete | Remove a resource | `DELETE /books/978-0132350884` | `204 No Content` |

*Note: `GET`, `PUT`, `PATCH`, and `DELETE` should be **idempotent** (making the same request multiple times produces the same server state as making it once), whereas `POST` is non-idempotent.*

---

## Common HTTP Response Status Codes

REST APIs rely on standardized HTTP status codes to signal the outcome of an operation:

* **2xx (Success):**
* `200 OK`: Request succeeded.
* `201 Created`: Resource was successfully created (typically follows `POST`).
* `204 No Content`: Action succeeded, but there is no message body to return (often used with `DELETE`).


* **4xx (Client Errors):**
* `400 Bad Request`: Invalid syntax or unprocessable parameters from the client.
* `401 Unauthorized`: Authentication is missing or invalid.
* `403 Forbidden`: Authenticated, but lacking permission to perform this action.
* `404 Not Found`: The requested URI does not exist.
* `429 Too Many Requests`: Rate limit exceeded.


* **5xx (Server Errors):**
* `500 Internal Server Error`: Unexpected failure on the server side.
* `503 Service Unavailable`: Server is temporarily down or overloaded.



---

## Anatomy of a Request and Response

### 1. Client Request

A client sends an HTTP request to create a new user:

```http
POST /api/v1/users HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json
Accept: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "developer"
}

```

### 2. Server Response

The server validates the input, inserts the record into its database, and responds with the created resource and its assigned ID:

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: /api/v1/users/1052

{
  "id": 1052,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "developer",
  "createdAt": "2026-10-22T09:30:00Z"
}

```

By leveraging standard HTTP verbs, stateless requests, and uniform endpoints, RESTful APIs provide a lightweight, scalable, and platform-agnostic communication layer used by modern web apps, mobile backends, and microservice architectures.

## Resources

- https://auth0.com/blog/url-uri-urn-differences/
- https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm