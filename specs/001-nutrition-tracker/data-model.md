# Data Models: Nutrition Tracker

## Entities and Database Schema

This feature leverages the existing models configured in `prisma/schema.prisma`.

### 1. UserProfile
Stores the physical stats and target goals of a specific user.
* **Fields**:
  * `id`: `String` (UUID, Primary Key)
  * `userId`: `String` (Unique, Foreign Key referencing `User.id`)
  * `age`: `Int?` (Optional age)
  * `gender`: `Gender?` (Enum: `MALE`, `FEMALE`)
  * `weight`: `Float` (Weight in kg)
  * `height`: `Float` (Height in cm)
  * `activityLevel`: `ActivityLevel` (Enum: `SEDENTARY`, `MODERATE`, `INTENSE`)
  * `goal`: `Goal` (Enum: `HYPERTROPHY`, `MAINTENANCE`, `WEIGHTLOSS`)
  * `dailyCalories`: `Float` (Target daily calories)
  * `carbo`: `Float` (Target daily carbohydrates in grams)
  * `protein`: `Float` (Target daily protein in grams)
  * `fat`: `Float` (Target daily fats in grams)
* **Validation Rules**:
  * `weight` > 0
  * `height` > 0
  * `dailyCalories` >= 0
  * `carbo`, `protein`, `fat` >= 0

### 2. Food
Stores reusable items in the global food catalog.
* **Fields**:
  * `id`: `String` (UUID, Primary Key)
  * `name`: `String` (Food name, e.g., "Arroz Branco")
  * `calories`: `Float` (Calories per `baseGrams` standard reference)
  * `carbo`: `Float` (Carbs in grams per `baseGrams` standard reference)
  * `protein`: `Float` (Protein in grams per `baseGrams` standard reference)
  * `fat`: `Float` (Fats in grams per `baseGrams` standard reference)
  * `baseGrams`: `Float` (Default: 100g, reference weight)
* **Validation Rules**:
  * `calories`, `carbo`, `protein`, `fat` >= 0
  * `baseGrams` > 0

### 3. Meal
Contains log entries of meals consumed by a user on a given date.
* **Fields**:
  * `id`: `String` (UUID, Primary Key)
  * `userId`: `String` (Foreign Key referencing `User.id`)
  * `name`: `String` (Name of the meal, e.g. "Almoço")
  * `date`: `DateTime` (Date reference of the intake log)
* **Validation Rules**:
  * `name` must not be empty.

### 4. MealFood
Junction table linking foods to meals, specifying the weight consumed.
* **Fields**:
  * `id`: `String` (UUID, Primary Key)
  * `mealId`: `String` (Foreign Key referencing `Meal.id` with onDelete: Cascade)
  * `foodId`: `String` (Foreign Key referencing `Food.id`)
  * `consumedGrams`: `Float` (Weight of the food eaten)
* **Validation Rules**:
  * `consumedGrams` > 0
