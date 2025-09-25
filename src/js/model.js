import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
// import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from './helpers.js';

// 1. Import the local JSON file at the top
import recipeData from './mockRecipe.json'; // مسیر فایل را متناسب با پروژه خود تنظیم کنید
import recipeResult from './mockSearchResults.json';

console.log(recipeData, 'recipeData');

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1
    },
    bookmarks: [],
};

//local Api - without web api version --------------------------------------------------------------------------------------------------

const createRecipeObject = function (data) {
    const recipe = data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url, // No optional chaining needed here
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
}
// 2. Update the loadRecipe function
export const loadRecipe = async function (id) {

    try {
        // The 'id' parameter is no longer needed but we can keep it for structure consistency
        const recipe = await recipeData.data.recipes.find(rec => rec.id === id);
        state.recipe = createRecipeObject(recipe);

        // چک می‌کند که آیا دستور پخت لود شده در لیست بوکمارک‌ها هست یا نه
        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

    } catch (err) {
        console.log(err);

    }
};

// Web Api version ----------------------------------------------------------------------------------------------------

// export const loadRecipe = async function (id) {
//     try {
//         const data = await AJAX(`${API_URL}/${id}?key={KEY}`);
//         state.recipe = createRecipeObject(data);
//          if(state.bookmarks.some(bookmark => bookmark.id === id))
//          state.recipe.bookmarked = true;
//          else state.recipe.bookmarked = false;
//     } catch (err) {
//         throw err;
//     }
// }

//local Api - whithout web api version --------------------------------------------------------------------------------------------------

export const loadSearchResults = async function (query) {
    if (query === "pizza") {

        state.search.results = await recipeResult.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                page: 1,
                ...(rec.key && { key: rec.key }),
            };
        }
        );

    }

}

// Web Api version ----------------------------------------------------------------------------------------------------
// export const loadSearchResults = async function (query) {
//     try {
//         state.search.query = query;
//         const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
//         console.log(data);
//         state.search.results = data.data.recipes.map(rec => {
//             return {
//                 id: rec.id,
//                 title: rec.title,
//                 publisher: rec.publisher,
//                 image: rec.image_url,
//                 ...(rec.key && {key: rec.key}),
//             };
//         }
//         );
//      state.search.page = 1;
//     } catch (err) {
//         throw err;
//     }
// }

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newQt = oldQt * newServing / oldServing // 2 * 8 / 4 = 4
    });
    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
    // 1. اضافه کردن دستور پخت به آرایه بوکمارک‌ها
    state.bookmarks.push(recipe);

    // 2. علامت‌گذاری دستور پخت فعلی به عنوان بوکمارک شده
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};

export const deleteBookmark = function (id) {
    // 1. پیدا کردن ایندکس و حذف بوکمارک از آرایه
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // 2. علامت‌گذاری دستور پخت فعلی به عنوان بوکمارک نشده
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
}

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
            const ingArr = ing[1].split(',').map( el => el.trim())
            // const ingArr = ing[1].replaceAll(' ', '').split(',');
            if (ingArr.length !== 3)
                throw new Error('Wrong ingeredient format! Please use the correct format :');
            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description };
        });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: + newRecipe.servings,
            ingredients,

            //Add to localStorage
            id: (Date.now() + '').slice(-10),
            key: KEY,
        };
        //used in web Api
        // const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        // state.recipe = createRecipeObject(data);
        state.recipe = recipe;
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
}