# Healthevate API Documentation
This API provides access to the user information and habit details for the Healthevate.
All endpoints return data in JSON format and use GET requests. If you submit an invalid request,
the server will return an HTTP error code of 400. For any other errors that are independent of
any client input, the server will return an error code of 500 with the plain text message:
`An error occurred on the server. Try again later.`

## Endpoint 1: User information
**Request Format:** `/userInfo`

**Body Parameters:** none

**Request Type:** `GET`

**Returned Data Format:** `JSON`

**Description:** Server returns username, xp, and coin of the user that is saved on the database.

**Example Request:** `/userInfo`

**Example Response:**
```json
{
  "username": "example User",
  "currentXP": 2350,
  "currentCoins": 350,
}
```

## Endpoint 2: Habit Details
**Request Format:** `/habits`

**Body Parameters:** `filter` (optional)

**Request Type:** `GET`

**Returned Data Format:** `JSON`

**Description:** If the filter parameter is not included in the request, returns all the courses
in ascending order of the category and then name.

**Example Request 1:** `/habits`

**Example Response 1:**
```json
{
  "habits": [
    {
      "category": "Physical Activity",
      "name": "Walk 5000 steps",
    },
    {
      "category": "Physical Activity",
      "name": "Walk 20,000 steps",
    },
  ...
  ]
}
```

**Example Request 2:** `/habits/Mindfulness`
**Example Response 2:**
```json
{
  "habits": [
    {
      "category": "Mindfulness",
      "name": "Meditate for 5 minutes",
    },
    {
      "category": "Mindfulness",
      "name": "Read 10 pages",
    },
  ...
  ]
}
```


