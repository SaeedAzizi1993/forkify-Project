import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// const recipeContainer = document.querySelector('.recipe');

// if (module.hot) {
//   module.hot.accept();
// }



const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1) Loading recipe
    await model.loadRecipe(id);
    // 2)Rendering recipe
    // recipeView.render(model.state.recipe);
    recipeView.render(model.state.recipe);
  }
  catch (err) {
    recipeView.renderError(`${err}💥💥💥`)
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load search results
    await model.loadSearchResults(query);

    //3) Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage());

    //4) Render initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlServings = function (newServings) {
  // منطق آپدیت سروینگ
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  //1)Render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) Render New pagination buttons
  paginationView.render(model.state.search)

}


// آپدیت کنترلر مربوط به اضافه/حذف بوکمارک
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 1. آپدیت view دستور پخت (برای تغییر آیکون)
  recipeView.update(model.state.recipe);

  // 2. رندر کردن لیست بوکمارک‌ها
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading  spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();
    // Render bookkmark view
    bookmarksView.render(model.state.bookmarks);

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //go to the back page. is useful.
    // window.history.back(); 

    console.log('test for new branch');

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000
    );
  } catch (err) {
    addRecipeView.renderError(err.message);

  }
};

const init = function () {
  console.log('welcome to the forkify!!!');
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe)
  // controlServings();
}
init();
