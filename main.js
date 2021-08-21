const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const heading = $('h2');
const btnVolume = $('.btn-volume');
const volumeInput = $('.volume-input');
const volumeMute = $('.volume-mute');
const volumeUp = $('.volume-up');
const mode = $('.mode');
const modeControl = $('.mode-control');
const darkMode = $('.dashboard');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const listSong = $$('.song');
const playSong = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress');
const playNextSong = $('.btn-next');
const playPrevSong = $('.btn-prev');
const playRandomSong = $('.btn-random');
const playRepeatSong = $('.btn-repeat');
const playlist = $('.playlist');
const PLAYING_STORAGE = 'F8_PLAYER';

const app = {
  currentIndex: 0,
  currentVolumeInput: 0,
  currentVolume: 0,
  currentTime: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isDarkMode: false,
  isFlag: false,
  config: JSON.parse(localStorage.getItem(PLAYING_STORAGE)) || {},
  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYING_STORAGE, JSON.stringify(this.config));
  },

  songs: [
    {
      name: 'Cheri Cheri Lady Remix',
      singer: 'Tiktok',
      path: "./assets/mp3/CheriCheriLadyRemix.mp3",
      image: "./assets/img/123.png"
    },
    {
      name: 'Past Lives',
      singer: 'Capientdream',
      path: "./assets/mp3/Pastlives.mp3",
      image: "./assets/img/hqdefault.jpg"
    },
    {
      name: 'With you',
      singer: 'Hoaprox',
      path: "./assets/mp3/WithYou.mp3",
      image: "./assets/img/hqdefault1.jpg"
    },
    {
      name: 'I do',
      singer: '911',
      path: "./assets/mp3/IDo.mp3",
      image: "./assets/img/hqdefault2.jpg"
    },
    {
      name: 'So far away',
      singer: 'Martin Garrix & David Guetta',
      path: "./assets/mp3/SoFarAway.mp3",
      image: "./assets/img/hqdefault3.jpg"
    },
    {
      name: 'We dont talk anymore',
      singer: 'Charlie Puth',
      path: "./assets/mp3/WeDontTalkAnymore.mp3",
      image: "./assets/img/hqdefault4.jpg"
    },
    {
      name: 'The night',
      singer: 'Avicii',
      path: "./assets/mp3/TheNights.mp3",
      image: "./assets/img/hqdefault5.jpg"
    },
    {
      name: 'Waiting for love',
      singer: 'Avicii',
      path: "./assets/mp3/WaitingForLove.mp3",
      image: "./assets/img/hqdefault6.jpg"
    },
    {
      name: 'The specture',
      singer: 'Alan Walker',
      path: "./assets/mp3/TheSpectre.mp3",
      image: "./assets/img/hqdefault7.jpg"
    },
    {
      name: 'Shape of you',
      singer: 'Ed Sheeran',
      path: "./assets/mp3/ShapeofYou.mp3",
      image: "./assets/img/hqdefault8.jpg"
    },
  ],
  render: function() {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${this.isDarkMode ? 'darkModeSong' : ''}  ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
              <h3 class="title ${this.isDarkMode ? 'h2dark' : ''}">${song.name}</h3>
              <p class="author ">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            
          </div>
      </div> `
    })
    playlist.innerHTML = htmls.join('')
  }, 

  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex];
      }
    })
  },
  
  handleEvent: function() {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    // scroll list of song
    document.onscroll = function() {
      const scroll  = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scroll;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    } 
    //scroll cdThumb
    const cdThumbAnimation = cdThumb.animate([
      { transform: "rotate(360deg)" }
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimation.pause();
    // show volumeInput
    btnVolume.onclick = function() {  
      if(!_this.isDarkMode) {
        _this.isDarkMode = true;
        volumeInput.style.display = 'block';  
      }
      else {
        _this.isDarkMode = false;
        volumeInput.style.display = 'none';
      }
    }
    // window.onclick = function() {
    //   volumeInput.style.display = 'none';
    // }
    // set volume for audio
    audio.onvolumechange = function() {
      if(audio.volume) {
        const volumnPercent = audio.volume * 100;
        volumeInput.value = volumnPercent;
      }
      _this.setConfig('currentVolumeInput', volumeInput.value);
    }
    volumeInput.onchange = function(e) {
      const volumnCurrent =  e.target.value / 100;  
      audio.volume = volumnCurrent;
      _this.setConfig('currentVolume', audio.volume);
    }
    // change mode (dark mode or light mode)
    mode.onclick = function() {
      _this.isDarkMode = !_this.isDarkMode;
      darkMode.classList.toggle('darkMode', _this.isDarkMode);
      mode.classList.toggle('mode1', _this.isDarkMode);
      modeControl.classList.toggle('mode-control1', _this.isDarkMode);
      $('h2').classList.toggle('h2dark', _this.isDarkMode);
      volumeUp.classList.toggle('h2dark', _this.isDarkMode);
      _this.setConfig('isDarkMode', _this.isDarkMode);
      _this.render();
    }
    //play and pause
    playSong.onclick = function() {
      if(_this.isPlaying) {
        audio.pause();        
      } 
      else { 
        audio.play();  
      } 
    }
    //when song is playing
    audio.onplay = function() {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimation.play();
      _this.setConfig('currentIndex', _this.currentIndex);
    }
    //when song is pausing
    audio.onpause = function() {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimation.pause();
      _this.setConfig('currentIndex', _this.currentIndex);
    }
    //when song end
    audio.onended = function() {
      if(_this.isRepeat) {
        audio.play();
      } 
      else {
        playNextSong.click();
      } 
    }
    //seeking
    audio.ontimeupdate = function() {

      if(audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progressPercent;
      }
    }
    progress.oninput = function() {
      const seekTime =  audio.duration / 100 * progress.value;
      audio.currentTime = seekTime;
      _this.setConfig('currentTime', audio.currentTime);
    }

    //next song
    playNextSong.onclick = function() {
      if(_this.isRandom) {
        _this.randomSong();
      }
      else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }
    //prev song
    playPrevSong.onclick = function() {
      if(playRandomSong.classList.contains('active')) {
        _this.randomSong();
      }
      else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }
    //random song
    playRandomSong.onclick = function() {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      playRandomSong.classList.toggle('active', _this.isRandom);
    }
    //repeat song
    playRepeatSong.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      playRepeatSong.classList.toggle('active', _this.isRepeat);
    }
    //play song when click
    playlist.onclick = function(e) {
      console.log(e.target);
      const songNode = e.target.closest('.song:not(.active)');
      //const songOption = e.target.closest('.option');
      //if(songNode || songOption) {
        if(songNode) {
          songNode.classList.add('active');
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        } 
        // if(songOption) {
        //   alert('ban')
        // }
      //}
    }

    window.onload = function() {
      _this.render();
      _this.loadCurrentSong();
      _this.loadConfig();
    }

    window.onkeydown = function(e) {
      switch(e.which) {
        case 37:
          playPrevSong.click();
          break;
        case 39:
          playNextSong.click();
          break;
        case 32:
          audio.pause();
          break;
        case 13:
          audio.play();
          break;
      }
    }
  },

  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({behavior: "smooth", block: "nearest"});
    }, 200)
  },

  loadConfig: function() {
    this.currentIndex = this.config.currentIndex;
    this.isDarkMode = this.config.isDarkMode;
    volumeInput.value = this.config.currentVolumeInput;
    audio.currentTime =  this.config.currentTime;
    audio.volume = this.config.currentVolume;
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    playRandomSong.classList.toggle('active', this.isRandom);
    playRepeatSong.classList.toggle('active', this.isRepeat);  
    darkMode.classList.toggle('darkMode', this.isDarkMode);
    mode.classList.toggle('mode1', this.isDarkMode);
    modeControl.classList.toggle('mode-control1', this.isDarkMode);
    $('h2').classList.toggle('h2dark', this.isDarkMode);
    volumeUp.classList.toggle('h2dark', this.isDarkMode);
    this.loadCurrentSong();
    this.render();
  },

  loadCurrentSong: function() {
    heading.innerHTML = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function() {
    this.currentIndex++;
      if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
    this.loadCurrentSong();
  },

  prevSong: function() {

    this.currentIndex--;
    if(this.currentIndex < 0) {
      this.currentIndex = this.songs.length-1
    }
    this.loadCurrentSong();
  },

  randomSong: function() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random()*this.songs.length);
    } while(newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function() {
    this.defineProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.loadConfig();
    this.render();
  }
}

app.start()


