(function() {

 function Space() {
  this.oPlayGame = document.querySelector('#btnPlay');
  this.oStartGame = document.querySelector('#startGame');
  this.oWrapperWelcom = document.querySelector('#wrapperWelcom');
  this.oWrapperSetting = document.querySelector('#wrapperSetting');
  this.oWrapperScore = document.querySelector('#wrapperScore');
  this.oWrapperGame = document.querySelector('#wrapperGame');

  this.oWrapperCongratulation = document.querySelector('#wrapperCongratulation');
  this.oGameFild = document.querySelector('#gameFild');

  this.arrOfLowScores = [];
  this.arrOfMediumScores = [];
  this.arrOfHightScores = [];

  window.localStorage.setItem(10, this.arrOfLowScores);
  window.localStorage.setItem(18, this.arrOfMediumScores);
  window.localStorage.setItem(24, this.arrOfHightScores);

  this.aPlayerInfo = '';
  this.lvl = 10;
  this.timeKeeperSec = 0;
  this.timeKeeperMin = 0;
  this.forSwitch = 0;
  this.aChecked = [];
  this.counterOfpairs = 0;
  this.tmpForScore = [];
 }

 Space.prototype.createBtnEvents = function() {
  this.oPlayGame.addEventListener('click', this.playGame.bind(this));
  this.oStartGame.addEventListener('click', this.startGame.bind(this));
 }


 Space.prototype.removeChildren = function(elem) {
  while (elem.lastChild) {
   elem.removeChild(elem.lastChild);
  }
 }

 Space.prototype.playGame = function() {
  if (this.oWrapperWelcom.classList.contains('show')) {
   this.oWrapperWelcom.classList.remove('show');
  }

  if (this.oWrapperGame.classList.contains('show')) {
   this.removeCardsListener();
   this.oWrapperGame.classList.remove('show');
   this.removeChildren(this.oGameFild);
   this.removeCardsListener();
   clearInterval(this.interval);
   this.timeKeeperSec = 0;
   this.timeKeeperMin = 0;
  }

  if (this.oWrapperScore.classList.contains('show')) {
   this.oWrapperScore.classList.remove('show');
   this.removeChildren(this.oGameFild);
   this.removeCardsListener();
   clearInterval(this.interval);
   this.timeKeeperSec = 0;
   this.timeKeeperMin = 0;
  }

  if (this.oWrapperCongratulation.classList.contains('show')) {
   this.oWrapperCongratulation.classList.remove('show');
   this.oWrapperGame.classList.remove('show');
   this.removeChildren(this.oGameFild);
   this.removeCardsListener();
  }

  this.oWrapperSetting.classList.add('show');

  this.playerSecondName = document.querySelector('#playerSecondName');
  this.playerFirstName = document.querySelector('#playerFirstName');
  this.playerEmail = document.querySelector('#playerEmail');

  this.oDifficultyLevel = document.querySelector('#difficultyLevel');
  this.oDifficultyLevel.addEventListener('change', this.chooseDifficultyLevel.bind(this));

  this.oCardsShirt = document.querySelector('#shirts');
  this.oCardsShirt.addEventListener('click', this.chooseCardsShirt.bind(this));
 }

 Space.prototype.chooseDifficultyLevel = function(e) {
  this.lvl = e.target.value;
 }

 Space.prototype.chooseCardsShirt = function(e) {
  if (!e.target.classList.contains('shirt-checked') && e.target.classList.contains('img-shirt')) {
   for (let i = 1; i < 4; i++) {
    if (this.oCardsShirt.children[i].classList.contains('shirt-checked')) {
     this.oCardsShirt.children[i].classList.remove('shirt-checked');
     e.target.classList.add('shirt-checked');
    }
   }
  }
 }

 Space.prototype.startGame = function() {
  if (this.playerFirstName.value && this.playerSecondName.value && this.playerEmail.value && (this.playerEmail.value.indexOf('@') !== -1) && (this.playerEmail.value.indexOf('.') !== -1)) {
   this.oWrapperSetting.classList.remove('show');
   this.oWrapperGame.classList.add('show');

   this.aPlayerInfo = this.playerFirstName.value + ' ' +
    this.playerSecondName.value + ' ' +
    this.playerEmail.value + ' ';

   this.actualPlayer = document.querySelector('#actualPlayer');
   this.oBackToSettings = document.querySelector('#backToSettings');

   this.oBackToSettings.addEventListener('click', this.playGame.bind(this));

   this.cardFace = [];
   this.createGameFild();
   this.aChecked = [];
   this.counterOfpairs = 0;
   this.aCards = [];

   this.turnCard = this.turnCard.bind(this)
   this.oGameFild.addEventListener('click', this.turnCard);
  } else if ((this.playerEmail.value.indexOf('@') === -1) || (this.playerEmail.value.indexOf('.') === -1)) {
     alert('Тhe email must contain "@" and "." Сheck it');
  } else {
   alert('Enter information about yourself');
  }
 }

 Space.prototype.createGameFild = function() {
  let level = 'card-low-level';
  if (this.lvl != 10 && this.lvl != 24) {
   level = 'card-medium-level';
  }
  if (this.lvl != 10 && this.lvl != 18) {
   level = 'card-hight-level';
  }

  let shirt = 'bg-donut';
  if (this.oCardsShirt.children[2].classList.contains('shirt-checked')) {
   shirt = 'bg-mountain';
  }
  if (this.oCardsShirt.children[3].classList.contains('shirt-checked')) {
   shirt = 'bg-planet';
  }
  this.cardFace = this.createCardsFace(this.cardFace);
  this.cardFace = this.shuffle(this.cardFace);

  for (let i = 0; i < this.lvl; i++) {
   this.oNewCard = document.createElement('div');
   this.oCardBack = document.createElement('div');
   this.oCardFace = document.createElement('div');

   this.oNewCard.classList.add(level);
   this.oNewCard.classList.add('card');
   this.oCardBack.classList.add(shirt);
   this.oCardBack.classList.add('back');
   this.oCardFace.classList.add('front');
   this.oNewCard.classList.add('unturn');
   this.oCardFace.textContent = this.cardFace[i];

   this.oNewCard.appendChild(this.oCardBack);
   this.oNewCard.appendChild(this.oCardFace);
   this.oGameFild.appendChild(this.oNewCard);
  }
  this.setTimer();
  this.showActualPlayer();
 }

 Space.prototype.createCardsFace = function(array) {
  let j = 1
  for (let i = 0; i < this.lvl; i++) {
   array[i] = j;
   array[i + 1] = j;
   j++;
   i++;
  }
  return array;
 }

 Space.prototype.shuffle = function(array) {
  var currentIndex = array.length,
   temporaryValue, randomIndex;

  while (currentIndex !== 0) {
   randomIndex = Math.floor(Math.random() * currentIndex);
   currentIndex -= 1;
   temporaryValue = array[currentIndex];
   array[currentIndex] = array[randomIndex];
   array[randomIndex] = temporaryValue;
  }
  return array;
 }

 Space.prototype.setTimer = function() {
  this.interval = setInterval(() => {
   if (this.timeKeeperSec > 58) {
    this.timeKeeperSec = 0;
    this.timeKeeperMin += 1;
   }
   this.timeKeeperSec++;
   this.timer = this.timeKeeperMin + ' : ' + this.timeKeeperSec;
   document.querySelector('.timer').textContent = this.timer;
  }, 1000);
 }

 Space.prototype.showActualPlayer = function() {
  this.actualPlayer.textContent = this.playerFirstName.value;
 }

 Space.prototype.turnCard = function(e) {
  if (e.target.classList.contains('back') && this.aChecked.length < 2) {
   switch (this.forSwitch) {
    case 1:
     e.target.parentNode.classList.remove('unturn');
     e.target.parentNode.classList.add('turn');
     e.target.nextSibling.classList.add('checked');
     this.aChecked = document.querySelectorAll('.checked');
     if (this.aChecked.length < 2) {
      break;
     } else
     if (this.aChecked[0].innerText === this.aChecked[1].innerText) {
      this.aChecked[0].classList.remove('checked');
      this.aChecked[1].classList.remove('checked');
      this.aChecked = [];
      this.forSwitch = 0;

      this.counterOfpairs += 1;
      if (this.counterOfpairs === this.lvl / 2) {
       clearInterval(this.interval);
       this.timer = 0;
       this.forSwitch = 0;

       this.creatWinnerBox();
      }
     } else
     if (this.aChecked[0].innerText !== this.aChecked[1].innerText) {
      setTimeout(() => { this.turnOffCard(this.aChecked[0], this.aChecked[1]) }, 500);
     }
     break;
    case 0:
     e.target.parentNode.classList.remove('unturn');
     e.target.parentNode.classList.add('turn');
     e.target.nextSibling.classList.add('checked');
     this.forSwitch = 1;
     break;
   }
  }
 }

 Space.prototype.turnOffCard = function(first, sec) {
  first.classList.remove('checked');
  sec.classList.remove('checked');
  first.parentNode.classList.remove('turn');
  first.parentNode.classList.add('unturn');
  sec.parentNode.classList.remove('turn');
  sec.parentNode.classList.add('unturn');

  this.ch = 0;
  this.aChecked = [];
 }

 Space.prototype.creatWinnerBox = function() {
  this.writeToScore(this.tmpForScore);

  this.oWrapperCongratulation.classList.add('show');

  this.oPlayAgainFromWinnerBox = document.querySelector('#btnPlayAgainWin');
  this.oBtnScore = document.querySelector('#btnScore');

  this.oPlayAgainFromWinnerBox.addEventListener('click', this.playGame.bind(this));
  this.oBtnScore.addEventListener('click', this.creatWrapperScore.bind(this));
 }

 Space.prototype.writeToScore = function(topPlayer) {
  if (this.timeKeeperMin !== 0) {
   this.aPlayerInfo += this.timeKeeperMin * 60 + this.timeKeeperSec;
  } else {
   this.aPlayerInfo += this.timeKeeperSec;
  }

  topPlayer = window.localStorage.getItem(this.lvl);
  let arrTopPlayer = [];
  if (topPlayer) {
   arrTopPlayer = topPlayer.split(';');
   arrTopPlayer.push(this.aPlayerInfo);
   topPlayer = arrTopPlayer.join(';');
  } else {
   topPlayer += this.aPlayerInfo;
  }
  window.localStorage.setItem(this.lvl, topPlayer);
 }

 Space.prototype.removeCardsListener = function() {
  this.oGameFild.removeEventListener('click', this.turnCard);
 }

 Space.prototype.creatWrapperScore = function() {
  let tmpForLowTop = window.localStorage.getItem(10);
  let tmpForMediumTop = window.localStorage.getItem(18);
  let tmpForHightTop = window.localStorage.getItem(24);

  this.oWrapperCongratulation.classList.remove('show');
  this.oWrapperGame.classList.remove('show');
  this.oWrapperScore.classList.add('show');

  this.oPlayAgainFromScore = document.querySelector('#btnPlayAgainScore');
  this.oPlayAgainFromScore.addEventListener('click', this.playGame.bind(this));

  let colLowScore = document.querySelector('#low-lvl-info');
  let colMediumScore = document.querySelector('#medium-lvl-info');
  let colHightScore = document.querySelector('#hight-lvl-info');

  if (colLowScore.hasChildNodes()) {
   this.removeChildren(colLowScore);
  }
  if (colMediumScore.hasChildNodes()) {
   this.removeChildren(colMediumScore);
  }
  if (colHightScore.hasChildNodes()) {
   this.removeChildren(colHightScore);
  }

  let arr10 = [];
  let arr18 = [];
  let arr24 = [];

  function sortScore(a, b) {
   return a[3] - b[3];
  }

  arr10 = tmpForLowTop.split(';');
  let arr10El = [];
  for (let i = 0; i < arr10.length; i++) {
   arr10El[i] = arr10[i].split(' ');
  }
  arr10El.forEach(function(el) {
   arr10El.sort(sortScore);
  });
  for (let i = 0; i < arr10.length; i++) {
   arr10[i] = arr10El[i].join(' ');
  }
  arr10.forEach(function(element) {
   let newRow = document.createElement('div');
   newRow.textContent = element;
   colLowScore.appendChild(newRow);
  });
  tmpForLowTop = arr10.slice(0, 10).join(';');
  window.localStorage.setItem(10, tmpForLowTop);

  arr18 = tmpForMediumTop.split(';');
  let arr18El = [];
  for (let i = 0; i < arr18.length; i++) {
   arr18El[i] = arr18[i].split(' ');
  }
  arr18El.forEach(function(el) {
   arr18El.sort(sortScore);
  });
  for (let i = 0; i < arr18.length; i++) {
   arr18[i] = arr18El[i].join(' ');
  }
  arr18.forEach(function(element) {
   let newRow = document.createElement('div');
   newRow.textContent = element;
   colMediumScore.appendChild(newRow);
  });
  tmpForMediumTop = arr18.slice(0, 10).join(';');
  window.localStorage.setItem(18, tmpForMediumTop);

  arr24 = tmpForHightTop.split(';');
  let arr24El = [];
  for (let i = 0; i < arr24.length; i++) {
   arr24El[i] = arr24[i].split(' ');
  }
  arr24El.forEach(function(el) {
   arr24El.sort(sortScore);
  });
  for (let i = 0; i < arr24.length; i++) {
   arr24[i] = arr24El[i].join(' ');
  }
  arr24.forEach(function(element) {
   let newRow = document.createElement('div');
   newRow.textContent = element;
   colHightScore.appendChild(newRow);
  });
  tmpForHightTop = arr24.slice(0, 10).join(';');
  window.localStorage.setItem(24, tmpForHightTop);
 }

 window.onload = () => {
  let oSpace = new Space();

  oSpace.createBtnEvents();
 }
})();
