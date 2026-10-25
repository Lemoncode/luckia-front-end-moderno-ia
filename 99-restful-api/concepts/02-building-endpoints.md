# Defining API endpoints

Designing clean, intuitive API endpoints requires following established conventions around resource naming, URI hierarchy, HTTP method semantics, and query handling.

---

## 1. Resource Naming and URL Structure

* **Use nouns, not verbs:** The HTTP method already acts as the verb. Paths should identify the resource, not the action.
* **Incorrect:** `GET /getUsers`, `POST /createUser`, `POST /deleteOrder`
* **Correct:** `GET /users`, `POST /users`, `DELETE /orders/{id}`


* **Use plural nouns for collections:** Plural nouns keep endpoints consistent regardless of whether you are retrieving the entire set or an individual item.
* `GET /users` (collection)
* `GET /users/{id}` (single resource from collection)
* *Exception:* Singleton resources that inherently have only one instance (e.g., `GET /me`, `GET /health`, `GET /settings`).


* **Use kebab-case and lowercase in URIs:** URIs are case-sensitive according to the [RFC 3986 standard](https://www.rfc-editor.org/info/rfc3986/). Always use lowercase letters and hyphens for separation. Avoid camelCase or underscores in URL paths.
* **Incorrect:** `/userProfiles/{id}`, `/user_profiles/{id}`
* **Correct:** `/user-profiles/{id}`



---

## 2. Resource Hierarchy and Nesting

Endpoints should reflect real parent-child relationships, but nesting must remain shallow to avoid brittle, overly complex URLs.

* **Nest for direct containment:** Nest resources only when a sub-resource belongs strictly to a parent resource.
* `GET /teams/{teamId}/members`
* `POST /articles/{articleId}/comments`


* **The "Two-Level Rule":** Limit path nesting to at most two levels (e.g., `/{collection}/{id}/{sub-collection}`).
* **Avoid:** `/companies/10/departments/4/teams/2/users/15/tasks`
* **Better:** Flatten deep relationships and use query parameters:
* `GET /tasks?user_id=15`
* `GET /tasks/{taskId}`





---

## 3. Query Parameters for Filtering, Sorting, and Pagination

Path variables identify *which resource* is targeted, while query parameters control *how the data is retrieved or formatted*.

| Pattern | Purpose | Example |
| --- | --- | --- |
| **Filtering** | Narrow results by field value | `GET /products?category=hardware&in_stock=true` |
| **Sorting** | Specify sort order and direction | `GET /orders?sort=-created_at` *(prefix `-` for descending)* |
| **Pagination** | Break large payloads into manageable pages | `GET /customers?cursor=eyJpZCI6MTB9&limit=50` |
| **Field Selection** | Request only specific fields (sparse fieldsets) | `GET /users?fields=id,name,email` |
| **Full-Text Search** | Freeform search across resources | `GET /articles?q=kubernetes` |

> Prefer **cursor-based pagination** over offset/limit (`?offset=20&limit=10`) for large datasets or real-time feeds to prevent skipped records and reduce database query load.

---

## 4. Modeling Non-CRUD Actions

Some business actions cannot cleanly map to simple CRUD verbs (e.g., canceling an order, locking an account, or sending an invoice). Standard workarounds include:

1. **State transition via `PATCH`:** Treat the action as a status update.
```http
PATCH /orders/982
Content-Type: application/json

{ "status": "canceled" }

```


2. **Sub-resource execution:** Treat the action or its event log as a sub-resource and trigger it with `POST`.
* `POST /orders/982/cancellations`
* `POST /invoices/104/send`
* `POST /accounts/44/lock`



---

## 5. API Versioning

API versioning protects existing clients from breaking changes.

* **URI Path Versioning (Industry Standard):** Place the major version number directly in the URL prefix.
* `/api/v1/users`
* `/api/v2/users`


* **Header Versioning (Alternative):** Pass the requested version via custom or media-type headers (e.g., `Accept: application/vnd.company.v2+json`). While cleaner in terms of pure REST theory, it is harder to inspect and test via standard browser tools.
* **Deprecation Notice:** When retiring an endpoint, use standardized RFC headers to notify clients ahead of removal:
* `Deprecation: true`
* `Sunset: Wed, 11 Nov 2026 00:00:00 GMT`



---

## 6. Response Payload and Error Contracts

* **Always wrap responses in top-level JSON objects:** Avoid returning top-level primitive arrays or booleans. Objects can be extended in the future with metadata without breaking schema contracts.
```json
// Avoid: ["alpha", "beta"]
// Better:
{
  "data": ["alpha", "beta"],
  "pagination": {
    "next_cursor": "abc123xyz",
    "has_more": true
  }
}

```


* **Consistent error envelope:** Provide a machine-readable error code alongside human-readable text and affected field indicators.
```json
{
  "error": {
    "code": "invalid_parameter",
    "message": "The provided email address is improperly formatted.",
    "field": "email"
  }
}

```


* **Match HTTP status codes to response contents:** Never return `200 OK` with an error message like `{"success": false}` inside the body. Always align status codes (`400`, `401`, `403`, `404`, `422`, `500`) with the true state of the execution.