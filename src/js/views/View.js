import icons from 'url:../../img/icons.svg';

export default class View {
  _data;


  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup; 

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }




  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // 1. ساخت یک DOM مجازی در حافظه
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // 2. مقایسه المان‌های جدید و قدیمی و جایگزینی تفاوت‌ها
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // مقایسه دو نود با یکدیگر
      // console.log(curEl, newEl.isEqualNode(curEl));

      // به‌روزرسانی متن‌ها (TEXT)
      // فقط المان‌هایی را آپدیت می‌کند که محتوای متنی مستقیم دارند
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // به‌روزرسانی اتریبیوت‌ها (ATTRIBUTES)
      // تمام اتریبیوت‌های المان قدیمی را با اتریبیوت‌های جدید جایگزین می‌کند
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }



  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner = function () {
    const markup = `
                      <div class="spinner">
                        <svg>
                          <use href="${icons}#icon-loader"></use>
                        </svg>
                      </div>
                    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };


  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons} #icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
            `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons} #icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
            `
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }


}