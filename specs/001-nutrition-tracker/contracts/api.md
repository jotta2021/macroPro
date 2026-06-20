# API Interface Contract: Nutrition Tracker

Endpoints are registered with prefix paths relative to the host.

## 1. Profiles API

### GET `/profile`
Retrieve the authenticated user's physical profile and goals.
* **Headers**: `Cookie` / `Authorization` session tokens.
* **Response 200 OK**:
  ```json
  {
    "id": "e9a0e668-cb0a-4fb4-9c5c-7d9a8e0f9b60",
    "userId": "user-uuid",
    "age": 28,
    "gender": "MALE",
    "weight": 80.0,
    "height": 180.0,
    "activityLevel": "MODERATE",
    "goal": "HYPERTROPHY",
    "dailyCalories": 2800.0,
    "carbo": 320.0,
    "protein": 160.0,
    "fat": 80.0,
    "createdAt": "2026-06-20T12:00:00.000Z",
    "updatedAt": "2026-06-20T12:00:00.000Z"
  }
  ```
* **Response 404 Not Found**: If profile is not configured.
* **Response 401 Unauthorized**: Session invalid or missing.

### POST `/profile`
Create or update the authenticated user's profile. Calculates targets automatically if they are omitted.
* **Request Body**:
  ```json
  {
    "age": 28,
    "gender": "MALE",
    "weight": 80.0,
    "height": 180.0,
    "activityLevel": "MODERATE",
    "goal": "HYPERTROPHY",
    "dailyCalories": null,
    "carbo": null,
    "protein": null,
    "fat": null
  }
  ```
* **Response 200 OK**: The created or updated `UserProfile` object.

---

## 2. Food Catalog API

### GET `/foods`
List all reusable food items in the shared catalog.
* **Response 200 OK**:
  ```json
  [
    {
      "id": "food-uuid",
      "name": "Arroz Branco",
      "calories": 130.0,
      "carbo": 28.0,
      "protein": 2.7,
      "fat": 0.3,
      "baseGrams": 100.0
    }
  ]
  ```

### POST `/foods`
Add a food item to the catalog.
* **Request Body**:
  ```json
  {
    "name": "Arroz Branco",
    "calories": 130.0,
    "carbo": 28.0,
    "protein": 2.7,
    "fat": 0.3,
    "baseGrams": 100.0
  }
  ```
* **Response 200 OK**:
  ```json
  {
    "id": "new-food-uuid"
  }
  ```

---

## 3. Meal Logging API

### POST `/meals`
Create a meal container for a given date.
* **Request Body**:
  ```json
  {
    "name": "Café da Manhã",
    "date": "2026-06-20T00:00:00.000Z"
  }
  ```
* **Response 200 OK**:
  ```json
  {
    "id": "meal-uuid",
    "name": "Café da Manhã",
    "date": "2026-06-20T00:00:00.000Z"
  }
  ```

### POST `/meals/:mealId/foods`
Log a food consumption entry under a meal.
* **Request Body**:
  ```json
  {
    "foodId": "food-uuid",
    "consumedGrams": 150.0
  }
  ```
* **Response 200 OK**:
  ```json
  {
    "id": "meal-food-uuid",
    "mealId": "meal-uuid",
    "foodId": "food-uuid",
    "consumedGrams": 150.0
  }
  ```

### DELETE `/meals/:mealId`
Delete a meal and cascadingly delete all logged foods.
* **Response 204 No Content**: Successful deletion.

---

## 4. Daily Dashboard API

### GET `/meals/dashboard/:date`
Retrieve daily summary (Target vs Consumed vs Remaining). Date is formatted as YYYY-MM-DD.
* **Response 200 OK**:
  ```json
  {
    "date": "2026-06-20",
    "goals": {
      "calories": 2800.0,
      "carbo": 320.0,
      "protein": 160.0,
      "fat": 80.0
    },
    "consumed": {
      "calories": 195.0,
      "carbo": 42.0,
      "protein": 4.05,
      "fat": 0.45
    },
    "remaining": {
      "calories": 2605.0,
      "carbo": 278.0,
      "protein": 155.95,
      "fat": 79.55
    }
  }
  ```
