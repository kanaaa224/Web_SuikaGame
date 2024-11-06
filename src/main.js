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
            se_click:  new Audio('./res/se_click.mp3'),
            se_pop_0:  new Audio('./res/se_pop-0.mp3'),
            se_pop_1:  new Audio('./res/se_pop-1.mp3'),
            se_pop_2:  new Audio('./res/se_pop-2.mp3'),
            se_pop_3:  new Audio('./res/se_pop-3.mp3'),
            se_pop_4:  new Audio('./res/se_pop-4.mp3'),
            se_pop_5:  new Audio('./res/se_pop-5.mp3'),
            se_pop_6:  new Audio('./res/se_pop-6.mp3'),
            se_pop_7:  new Audio('./res/se_pop-7.mp3'),
            se_pop_8:  new Audio('./res/se_pop-8.mp3'),
            se_pop_9:  new Audio('./res/se_pop-9.mp3'),
            se_pop_10: new Audio('./res/se_pop-10.mp3'),
        };

        this.images = {
            circle_0:  './res/circle-0.png',
            circle_1:  './res/circle-1.png',
            circle_2:  './res/circle-2.png',
            circle_3:  './res/circle-3.png',
            circle_4:  './res/circle-4.png',
            circle_5:  './res/circle-5.png',
            circle_6:  './res/circle-6.png',
            circle_7:  './res/circle-7.png',
            circle_8:  './res/circle-8.png',
            circle_9:  './res/circle-9.png',
            circle_10: './res/circle-10.png',
        };

        this.circles = [
            { radius: 24,  points: 1,  img_src: this.images.circle_0,  se_src: this.sounds.se_pop_0  },
            { radius: 32,  points: 3,  img_src: this.images.circle_1,  se_src: this.sounds.se_pop_1  },
            { radius: 40,  points: 6,  img_src: this.images.circle_2,  se_src: this.sounds.se_pop_2  },
            { radius: 56,  points: 9,  img_src: this.images.circle_3,  se_src: this.sounds.se_pop_3  },
            { radius: 64,  points: 11, img_src: this.images.circle_4,  se_src: this.sounds.se_pop_4  },
            { radius: 72,  points: 13, img_src: this.images.circle_5,  se_src: this.sounds.se_pop_5  },
            { radius: 84,  points: 15, img_src: this.images.circle_6,  se_src: this.sounds.se_pop_6  },
            { radius: 96,  points: 17, img_src: this.images.circle_7,  se_src: this.sounds.se_pop_7  },
            { radius: 128, points: 19, img_src: this.images.circle_8,  se_src: this.sounds.se_pop_8  },
            { radius: 160, points: 21, img_src: this.images.circle_9,  se_src: this.sounds.se_pop_9  },
            { radius: 192, points: 23, img_src: this.images.circle_10, se_src: this.sounds.se_pop_10 }
        ];

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