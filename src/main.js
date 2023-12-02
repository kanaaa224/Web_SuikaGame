class Modal {

	install(id, title, content, btn) {
		if(!(id && title && content && btn)) return false;

		let element = document.getElementById(id);
		if(element != null) return false;

		element = document.createElement('div');
		element.innerHTML = '<div class="modal" id="' + id + '"><div class="container"><h1>' + title + '</h1><p>' + content + '</p><div class="btn">' + btn + '</div></div></div>';
		document.querySelector('body').append(element.firstChild);

		return true;
	};

	uninstall(id) {
		let element = document.getElementById(id);
		if(element == null) return false;

		element.remove();

		return true;
	};

};

////////////////////////////////////////////////////////////////////////////////////////////////////

const main = {
	'modal': new Modal()
};

////////////////////////////////////////////////////////////////////////////////////////////////////

main.modal.install('test', '開発中！', 'coming soon!', '<div onclick=main.modal.uninstall("test");>閉じる</div>');
