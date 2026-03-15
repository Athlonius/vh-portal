export type MealMarket = "India" | "GCC" | "All";
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Brunch";
export type MealStatus = "Active" | "Inactive";

export interface Meal {
  id: number;
  mealName: string;
  market: MealMarket;
  mealType: MealType;
  minPax: number;
  maxPax: number;
  pricePerPersonGel: number;
  status: MealStatus;
}

export const MEAL_MARKETS: MealMarket[] = ["India", "GCC", "All"];
export const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Brunch"];

export const mockMeals: Meal[] = [
  {
    id: 1,
    mealName: "Indian Restaurant – Set Lunch",
    market: "India",
    mealType: "Lunch",
    minPax: 4,
    maxPax: 40,
    pricePerPersonGel: 85,
    status: "Active",
  },
  {
    id: 2,
    mealName: "Indian Restaurant – Set Dinner",
    market: "India",
    mealType: "Dinner",
    minPax: 4,
    maxPax: 40,
    pricePerPersonGel: 110,
    status: "Active",
  },
  {
    id: 3,
    mealName: "Georgian Restaurant – Traditional Lunch",
    market: "All",
    mealType: "Lunch",
    minPax: 2,
    maxPax: 30,
    pricePerPersonGel: 70,
    status: "Active",
  },
  {
    id: 4,
    mealName: "Georgian Restaurant – Traditional Dinner",
    market: "All",
    mealType: "Dinner",
    minPax: 2,
    maxPax: 30,
    pricePerPersonGel: 95,
    status: "Active",
  },
  {
    id: 5,
    mealName: "Halal Restaurant – Friday Brunch",
    market: "GCC",
    mealType: "Brunch",
    minPax: 6,
    maxPax: 50,
    pricePerPersonGel: 130,
    status: "Active",
  },
  {
    id: 6,
    mealName: "Halal Restaurant – Set Dinner",
    market: "GCC",
    mealType: "Dinner",
    minPax: 6,
    maxPax: 50,
    pricePerPersonGel: 120,
    status: "Active",
  },
  {
    id: 7,
    mealName: "Hotel Breakfast Supplement",
    market: "All",
    mealType: "Breakfast",
    minPax: 1,
    maxPax: 100,
    pricePerPersonGel: 35,
    status: "Active",
  },
  {
    id: 8,
    mealName: "Winery Lunch – Kakheti",
    market: "All",
    mealType: "Lunch",
    minPax: 8,
    maxPax: 60,
    pricePerPersonGel: 90,
    status: "Inactive",
  },
];
