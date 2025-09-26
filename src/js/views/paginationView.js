import View from './View.js';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');


  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);



      handler(goToPage);
    })
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    console.log(numPages, 'perpage');
    return this.markupButton(curPage, numPages, icons);

  }

  markupButton(cur, num, icon) {

    // Page 1, and there are other pages
    if (cur === 1 && num > 1) {
      console.log(cur, num, icon);
      return `
            <button data-goto=${cur + 1} class="btn--inline pagination__btn--next">
            <span>${cur + 1}</span>
            <svg class="search__icon">
            <use href="${icon}#icon-arrow-right"></use>
            </svg>
            </button>
          
          `
    }
    // Last page
    if (cur === num && num > 1) {
      return `<button data-goto=${cur - 1} class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>${cur - 1}</span>
          </button>`;
    }

    // Other page
    if (cur < num) {
      return `<button data-goto=${cur + 1} class="btn--inline pagination__btn--next">
            <span>${cur + 1}</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
          </button>
          <button data-goto=${cur - 1} class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>${cur - 1}</span>
          </button>`;

    }

    // Page 1, and there are NO other pages
    return '';
  }


}

export default new PaginationView();