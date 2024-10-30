class Modal {
	constructor() {
		if(document.querySelector('.modals')) document.querySelector('.modals').remove();

		document.querySelector('body').innerHTML += `<div class="modals"></div>`;
	}

	install(setData = {}) {
		setData.id      = setData.id      ? setData.id      : 'modal';
		setData.content = setData.content ? setData.content : '';

		if(!document.querySelector('.modals')) return false;
		if(document.querySelector('#' + setData.id)) return false;

		document.querySelector('.modals').innerHTML += `<div class="modal" id="${setData.id}"><div class="container">${setData.content}</div></div>`;

		return true;
	}

	uninstall(setData = {}) {
		setData.id = setData.id ? setData.id : 'modal';

		if(!document.querySelector('#' + setData.id)) return false;

		document.querySelector('#' + setData.id).remove();

		return true;
	}
}

class App {
	constructor() {
		window.addEventListener('load', () => {
			this.modal = new Modal();
			this.initialize();
		});
	}

	initialize() {
		if(document.querySelector('header')) document.querySelector('header').remove();
		if(document.querySelector('main'))   document.querySelector('main')  .remove();
		if(document.querySelector('footer')) document.querySelector('footer').remove();

		document.querySelector('body').innerHTML += `<header></header><main><div class="container"><div class="cards"></div></div></main><footer><div class="container"><p>&copy; 2023&nbsp;<a href="//github.com/kanaaa224/" style="color:inherit;"><u>kanaaa224</u></a>.</p></div></footer>`;

		this.modal.install({ 'content': '<h1>開発中！</h1><p>coming soon!</p><div class="button"><div onclick=app.modal.uninstall();>閉じる</div></div>' });
	}
}

const app = new App();