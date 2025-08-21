import { Product, CostCalculation } from '../types';

export function calculateProductCost(product: Product): CostCalculation {
  const totalIngredientsCost = product.ingredients.reduce((sum, ingredient) => {
    return sum + ingredient.totalCost;
  }, 0);

  const safetyMargin = totalIngredientsCost * 0.1; // 10% margin
  const costPerPortionOrKg = totalIngredientsCost + safetyMargin;
  const finalCost = costPerPortionOrKg * product.portionYield;

  return {
    totalIngredientsCost,
    safetyMargin,
    costPerPortionOrKg,
    finalCost
  };
}