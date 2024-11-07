class Modal {
    constructor() {
        window.addEventListener('load', () => {
            if(document.querySelector('.modals')) document.querySelector('.modals').remove();

            document.body.innerHTML += `<div class="modals"></div>`;
        });
    }

    render(setData = {}) {
        setData.id      = setData.id      ? setData.id      : 'modal';
        setData.content = setData.content ? setData.content : '';

        if(!document.querySelector('.modals')) return false;
        if(document.querySelector(`#${setData.id}`)) return false;

        document.querySelector('.modals').innerHTML += `<div class="modal" id="${setData.id}"><div class="container">${setData.content}</div></div>`;

        return true;
    }

    destroy(setData = {}) {
        setData.id = setData.id ? setData.id : 'modal';

        if(!document.querySelector(`#${setData.id}`)) return false;

        document.querySelector(`#${setData.id}`).remove();

        return true;
    }
}

class Game {
    constructor() {
        this.sounds = {
            bgm_main:  new Audio('./res/bgm_main.mp3'),
            se_click:  new Audio('./res/se_click.mp3')
        };

        for(let i = 0; i < 12; i++) {
            this.sounds[`se_pop_${i}`] = new Audio(`./res/se_pop-${i}.mp3`);
        }

        this.images = {};

        for(let i = 0; i < 12; i++) {
            this.images[`circle_${i}`] = `./res/circle-${i}.png`;
        }

        let radius_array = [ 24, 32, 40, 56, 64, 72, 84, 96, 128, 160, 192 ];
        let points_array = [ 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33 ];

        this.circles = [];

        for(let i = 0; i < 12; i++) {
            this.circles[i] = {
                radius: radius_array[i],
                points: points_array[i],
                img_src: this.images[`circle_${i}`],
                se_src: this.sounds[`se_pop_${i}`]
            };
        }

        this.settings = {
            playBGM: true,
            playSE: true
        };

        this.config = {};
    }

    initialize() {
        if(this.settings.playBGM) {
            this.sounds.bgm_main.loop = true;
            this.sounds.bgm_main.play();
        }

        let clickEvent = (event) => {
            if(this.settings.playSE) this.sounds.se_click.play();
        };

        document.addEventListener('click', clickEvent);
        document.addEventListener('touchend', clickEvent);

        return true;
    }

    setting(setData = {}) {
        if('playBGM' in setData) this.settings.playBGM = setData.playBGM;
        if('playSE'  in setData) this.settings.playSE  = setData.playSE;

        if(this.settings.playBGM) {
            this.sounds.bgm_main.play();
            this.sounds.bgm_main.volume = 1;
        } else {
            this.sounds.bgm_main.pause();
            this.sounds.bgm_main.volume = 0;
        }

        return true;
    }
}

class App {
    constructor() {
        this.version = 'v1.0.0';

        this.modal = new Modal();
        this.game  = new Game();

        window.addEventListener('load', () => {
            if(window.matchMedia('(prefers-color-scheme: dark)').matches) document.body.classList.add('darkMode');

            let checkDeviceType = (event) => {
                let deviceType = event.changedTouches ? 'touch' : 'mouse' ;

                switch(deviceType) {
                    case 'touch':
                        document.body.classList.add('touchDevice');
                        break;

                    case 'mouse':
                        document.body.classList.remove('touchDevice');
                        break;
                }

                window.removeEventListener('mousemove', checkDeviceType);
                window.removeEventListener('touchstart', checkDeviceType);
            };

            window.addEventListener('mousemove', checkDeviceType);
            window.addEventListener('touchstart', checkDeviceType);

            let lsData = this.storageGetData();

            if(lsData) {
                if('playBGM' in lsData) this.game.settings.playBGM = lsData.playBGM;
                if('playSE'  in lsData) this.game.settings.playSE  = lsData.playSE;
            }

            this.modal.render({ content: `
                <h1><i class="bi bi-music-note-beamed"></i></h1>
                <p>このゲームでは音が流れます！<br>（設定でオフにできます。）</p>
                <div class="button"><div class="clickable" onclick="app.modal.destroy();app.initialize();">閉じる</div></div>
            ` });

            document.body.innerHTML += `<main><div class="container"></div></main>`;
        });
    }

    initialize() {
        if(document.querySelector('header')) document.querySelector('header').remove();
        if(document.querySelector('main'))   document.querySelector('main')  .remove();
        if(document.querySelector('footer')) document.querySelector('footer').remove();

        document.body.innerHTML += `
            <main>
                <div class="container"></div>
            </main>
            <header>
                <div class="container">
                    <div></div>
                    <div onclick="app.setting();"><i class="bi bi-gear-wide-connected"></i></div>
                </div>
            </header>
            <footer>
                <div class="container">
                    <p>&copy; 2023&nbsp;<a href="//github.com/kanaaa224/" target="_blank" style="color:inherit;"><u>kanaaa224</u></a>. | ${this.version}</p>
                </div>
            </footer>
        `;

        app.game.initialize();

        return true;
    }

    setting(setData = {}) {
        let modalID = 'modal_app-setting';

        if(!document.querySelector(`#${modalID}`)) {
            let modalContent = `
                <h1><i class="bi bi-gear-wide-connected"></i> 設定</h1>
                <p>
                    BGM: <u id="playBGM">unknown</u><br>
                    SE: <u id="playSE">unknown</u><br><br>
                    テーマ: <u onclick="window.alert('coming soon!');" style="opacity: 0.5;">デフォルト</u><br><br>
                    <u onclick="app.setting({ 'dataReset': true });">データをリセット</u>
                </p>
                <div class="button"><div class="clickable" onclick="app.modal.destroy({ 'id': '${modalID}' });">閉じる</div></div>
            `

            if(!this.modal.render({ id: modalID, content: modalContent })) return false;
        }

        if('playBGM' in setData) this.game.setting({ playBGM: setData.playBGM });
        if('playSE'  in setData) this.game.setting({ playSE:  setData.playSE  });

        if(document.querySelector(`#${modalID}`)) {
            let button_playBGM = document.querySelector(`#${modalID} #playBGM`);
            let button_playSE  = document.querySelector(`#${modalID} #playSE`);

            switch(this.game.settings.playBGM) {
                case true:
                    button_playBGM.innerHTML = 'オン';
                    button_playBGM.setAttribute('onclick', `app.setting({ 'playBGM': false });`);
                    break;

                case false:
                    button_playBGM.innerHTML = 'オフ';
                    button_playBGM.setAttribute('onclick', `app.setting({ 'playBGM': true });`);
                    break;
            }

            switch(this.game.settings.playSE) {
                case true:
                    button_playSE.innerHTML = 'オン';
                    button_playSE.setAttribute('onclick', `app.setting({ 'playSE': false });`);
                    break;

                case false:
                    button_playSE.innerHTML = 'オフ';
                    button_playSE.setAttribute('onclick', `app.setting({ 'playSE': true });`);
                    break;
            }
        }

        let lsData = this.storageGetData();

        if(!lsData) lsData = {};

        lsData.playBGM = this.game.settings.playBGM;
        lsData.playSE  = this.game.settings.playSE;

        if(!this.storageSetData(lsData)) return false;

        if('dataReset' in setData) {
            if(setData.dataReset) {
                let result = window.confirm('スコアや設定をリセットします。本当にリセットしますか？');

                if(result) {
                    this.storageSetData({});
                    window.alert('リセットが完了しました。再起動します。');
                    location.reload();
                }
            }
        }

        return true;
    }

    storageGetData(key = '') {
        let lsKey = location.href;

        let isObject = function(value) {
            return value !== null && typeof value === 'object';
        };

        let lsData = localStorage.getItem(lsKey);

        if(!lsData) return null;

        lsData = JSON.parse(lsData);

        if(!isObject(lsData)) return false;

        if(key) {
            if(key in lsData) return lsData[key];
            else return null;
        }

        return lsData;
    }

    storageSetData(setData = {}) {
        let lsKey = location.href;

        let isObject = function(value) {
            return value !== null && typeof value === 'object';
        };

        if(!isObject(setData)) return false;

        setData = JSON.stringify(setData);

        localStorage.setItem(lsKey, setData);

        return true;
    }
}

const app = new App();