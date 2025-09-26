import View from './View.js';
import previewView from './previewView.js'; // وارد کردن نمای پیش‌نمایش
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
    _message = '';

    // این متد لیست بوکمارک‌ها را رندر می‌کند
    _generateMarkup() {
        return this._data.map(item => previewView.render(item, false)).join('');
    }

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }
}

export default new BookmarksView();