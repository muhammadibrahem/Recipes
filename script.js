const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

const restaurantMenuItems = [
  {
    id: "1",
    strMeal: "Dessert",
    strMealThumb: "cake.jpg",
    description: "Sweet treats to complete your meal.",
    ingredients: ["Sugar", "Milk", "Cream", "Fruit"],
  },
  {
    id: "2",
    strMeal: "Yogurt",
    strMealThumb: "yogurt.jpg",
    description: "Cool yogurt with honey and nuts.",
    ingredients: ["Yogurt", "Honey", "Nuts"],
  },
  {
    id: "3",
    strMeal: "Biryani",
    strMealThumb: "biryani.jpg",
    description: "Aromatic biryani with tender meat and rice.",
    ingredients: ["Rice", "Spices", "Meat", "Yogurt"],
  },
  {
    id: "4",
    strMeal: "Beef",
    strMealThumb: "beef.jpg",
    description: "Juicy beef dish served with aromatic spices.",
    ingredients: ["Beef", "Spices", "Onion"],
  },
  {
    id: "5",
    strMeal: "Protein",
    strMealThumb: "protein.jpg",
    description: "High protein special for a strong meal.",
    ingredients: ["Chicken", "Lentils", "Nuts"],
  },
  {
    id: "6",
    strMeal: "Haleem",
    strMealThumb: "haleem.jpg",
    description: "Slow-cooked haleem with wheat and meat.",
    ingredients: ["Wheat", "Meat", "Spices"],
  },
  {
    id: "7",
    strMeal: "Paneer",
    strMealThumb: "paneer.jpg",
    description: "Creamy paneer dish with rich gravy.",
    ingredients: ["Paneer", "Tomato", "Cream"],
  },
  {
    id: "8",
    strMeal: "Semiya",
    strMealThumb: "simiya.jpg",
    description: "Sweet semiya served with nuts and milk.",
    ingredients: ["Vermicelli", "Milk", "Sugar"],
  },
  {
    id: "9",
    strMeal: "Vegetables",
    strMealThumb: "vegetables.jpg",
    description: "Healthy mixed vegetable dish.",
    ingredients: ["Carrot", "Beans", "Potato", "Peas"],
  },
  {
    id: "10",
    strMeal: "Gole Kabab",
    strMealThumb: "gole kabab.jpg",
    description: "Spiced ground meat kebabs fried to perfection.",
    ingredients: ["Meat", "Spices", "Onion"],
  },
  {
    id: "11",
    strMeal: "Seekh Kabab",
    strMealThumb: "seekh kabab.jpg",
    description: "Grilled seekh kababs with aromatic spices.",
    ingredients: ["Minced Meat", "Spices", "Herbs"],
  },
  {
    id: "12",
    strMeal: "Burger",
    strMealThumb: "burger.jpg",
    description: "Classic burger with cheese and fresh toppings.",
    ingredients: ["Bun", "Patty", "Cheese", "Lettuce"],
  },
  {
    id: "13",
    strMeal: "Bread",
    strMealThumb: "bread.jpg",
    description: "Freshly baked bread to accompany any meal.",
    ingredients: ["Flour", "Yeast", "Water"],
  },
];

function getMealId(mealData) {
  return mealData.idMeal || mealData.id;
}

function getMealName(mealData) {
  return mealData.strMeal;
}

function createImageDataUri(title, bgColor = "#f3f3f3") {
  const safeTitle = title
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="400" height="250" fill="${bgColor}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#333">${safeTitle}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getMenuImage(mealData) {
  return (
    mealData.strMealThumb ||
    createImageDataUri(getMealName(mealData), "#f3f3f3")
  );
}

function getMenuItemById(id) {
  return restaurantMenuItems.find((meal) => getMealId(meal) === id);
}

function searchMenuItems(term) {
  if (!term) return restaurantMenuItems;
  return restaurantMenuItems.filter((meal) =>
    getMealName(meal).toLowerCase().includes(term.toLowerCase()),
  );
}

loadMenuItems();
fetchFavMeals();

function loadMenuItems() {
  mealsEl.innerHTML = "";
  restaurantMenuItems.forEach((meal) => addMeal(meal));
}

function addMeal(mealData, random = false) {
  console.log(mealData);
  const mealName = getMealName(mealData);

  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
        <div class="meal-header">
            ${
              random
                ? `
            <span class="random"> Chef's Special </span>`
                : ""
            }
            <img
                src="${getMenuImage(mealData)}"
                alt="${mealName}"
            />
        </div>
        <div class="meal-body">
            <h4>${mealName}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;

  const mealImg = meal.querySelector("img");
  mealImg.onerror = () => {
    mealImg.onerror = null;
    mealImg.src = createImageDataUri(mealName, "#f3f3f3");
  };

  const btn = meal.querySelector(".meal-body .fav-btn");

  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    const mealId = getMealId(mealData);
    if (btn.classList.contains("active")) {
      removeMealLS(mealId);
      btn.classList.remove("active");
    } else {
      addMealLS(mealId);
      btn.classList.add("active");
    }

    fetchFavMeals();
  });

  meal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  mealsEl.appendChild(meal);
}

function addMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId)),
  );
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

function fetchFavMeals() {
  // clean the container
  favoriteContainer.innerHTML = "";

  const mealIds = getMealsLS();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    const meal = getMenuItemById(mealId);
    if (meal) {
      addMealFav(meal);
    }
  }
}

function addMealFav(mealData) {
  const favMeal = document.createElement("li");
  const mealName = getMealName(mealData);

  favMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealName}"
        /><span>${mealName}</span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

  const btn = favMeal.querySelector(".clear");

  btn.addEventListener("click", () => {
    removeMealLS(getMealId(mealData));

    fetchFavMeals();
  });

  favMeal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
  // clean it up
  mealInfoEl.innerHTML = "";

  // update the Meal info
  const mealEl = document.createElement("div");

  const mealName = getMealName(mealData);
  const mealDescription =
    mealData.description || mealData.strInstructions || "";
  const ingredients = mealData.ingredients || [];

  mealEl.innerHTML = `
        <h1>${mealName}</h1>
        <img
            src="${getMenuImage(mealData)}"
            alt="${mealName}"
        />
        <p>
        ${mealDescription}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
              .map(
                (ing) => `
            <li>${ing}</li>
            `,
              )
              .join("")}
        </ul>
    `;

  mealInfoEl.appendChild(mealEl);
  const profileImg = mealEl.querySelector("img");
  profileImg.onerror = () => {
    profileImg.onerror = null;
    profileImg.src = createImageDataUri(mealName, "#f3f3f3");
  };

  // show the popup
  mealPopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", () => {
  // clean container
  mealsEl.innerHTML = "";

  const search = searchTerm.value;
  const meals = searchMenuItems(search);

  if (meals.length) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});

popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
