export type MealMarket = "India" | "GCC" | "All";
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Brunch";
export type MealStatus = "Active" | "Inactive";
export type MealCurrency = "GEL" | "USD";

export interface Meal {
  id: number;
  restaurantName: string;
  mealName: string;
  market: MealMarket;
  mealType: MealType;
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
  currency: MealCurrency;
  status: MealStatus;
}

export const MEAL_MARKETS: MealMarket[] = ["India", "GCC", "All"];
export const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Brunch"];

export const mockMeals: Meal[] = [
  {
    id: 1,
    restaurantName: "Spice Garden Indian Restaurant",
    mealName: "Set Lunch",
    market: "India",
    mealType: "Lunch",
    minPax: 4,
    maxPax: 40,
    pricePerPerson: 85,
    currency: "GEL",
    status: "Active",
  },
  {
    id: 2,
    restaurantName: "Spice Garden Indian Restaurant",
    mealName: "Set Dinner",
    market: "India",
    mealType: "Dinner",
    minPax: 4,
    maxPax: 40,
    pricePerPerson: 110,
    currency: "GEL",
    status: "Active",
  },
  {
    id: 3,
    restaurantName: "Shavi Lomi",
    mealName: "Traditional Lunch",
    market: "All",
    mealType: "Lunch",
    minPax: 2,
    maxPax: 30,
    pricePerPerson: 70,
    currency: "GEL",
    status: "Active",
  },
  {
    id: 4,
    restaurantName: "Shavi Lomi",
    mealName: "Traditional Dinner",
    market: "All",
    mealType: "Dinner",
    minPax: 2,
    maxPax: 30,
    pricePerPerson: 95,
    currency: "GEL",
    status: "Active",
  },
  {
    id: 5,
    restaurantName: "Al Barakah Halal Kitchen",
    mealName: "Friday Brunch",
    market: "GCC",
    mealType: "Brunch",
    minPax: 6,
    maxPax: 50,
    pricePerPerson: 130,
    currency: "GEL",
    status: "Active",
  },
  {
    id: 6,
    restaurantName: "Al Barakah Halal Kitchen",
    mealName: "Set Dinner",
    market: "GCC",
    mealType: "Dinner",
    minPax: 6,
    maxPax: 50,
    pricePerPerson: 120,
    currency: "GEL",
    status: "Active",
  },
  {
    id: 7,
    restaurantName: "Hotel Kitchen",
    mealName: "Breakfast Supplement",
    market: "All",
    mealType: "Breakfast",
    minPax: 1,
    maxPax: 100,
    pricePerPerson: 35,
    currency: "GEL",
    status: "Active",
  },
  {
    id: 8,
    restaurantName: "Pheasant's Tears Winery",
    mealName: "Wine & Dine Lunch – Kakheti",
    market: "All",
    mealType: "Lunch",
    minPax: 8,
    maxPax: 60,
    pricePerPerson: 90,
    currency: "GEL",
    status: "Inactive",
  },
];
