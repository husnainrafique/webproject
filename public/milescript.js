function addToMealPlan(dishName, cost) {
    const mealPlanList = document.getElementById('mealPlanList');
    const entry = document.createElement('li');
    entry.textContent = `${dishName} - $${cost}`;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = function () {
        mealPlanList.removeChild(entry);
        totalCost -= cost;
        document.getElementById('totalCost').textContent = totalCost.toFixed(2);
    };
    entry.appendChild(removeButton);
    mealPlanList.appendChild(entry);

    totalCost += cost;
    document.getElementById('totalCost').textContent = totalCost.toFixed(2);
}