const $modal = {
  container: document.getElementById("modal-container"),
  username: document.getElementById("gameover-submit-yourScore-name"),
  submit: document.getElementById("gameover-submit-yourScore-button"),
  SendToServer: document.getElementById("sendToServer"),
};
const container = document.querySelector(".image-container");
const gametext = document.querySelector(".game-text");
const playtime = document.querySelector(".play-time");
let result;

function setup() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  width = 800;
  height = 600;
  mainmenu = true;
  backgroundImg = new Image();
  backgroundImg.src = "res/background.png";

  targetImg = new Image();
  targetImg.src = "res/target.png";

  menutextImg = new Image();
  menutextImg.src = "res/menutext.png";

  startbutton_darkImg = new Image();
  startbutton_darkImg.src = "res/startbutton_dark.png";

  startbutton_lightImg = new Image();
  startbutton_lightImg.src = "res/startbutton_light.png";

  gameovertextImg = new Image();
  gameovertextImg.src = "res/gameovertext.png";

  retrybutton_darkImg = new Image();
  retrybutton_darkImg.src = "res/retrybutton_dark.png";

  retrybutton_lightImg = new Image();
  retrybutton_lightImg.src = "res/retrybutton_light.png";
}

function setupGame() {
  mousePos = { x: 0, y: 0 };

  mouse1 = false;
  score = 0;
  startTime = Math.round(new Date().getTime() / 1000);
  timeleft = 60;
  gameover = false;

  target.setupTarget();
}

function update() {
  if (timeleft > 0) {
    // gameplay
    target.update();
    timeleft = startTime - Math.round(new Date().getTime() / 1000) + 60;
    render();
  } else {
    result = score;
    $modal.container.style.display = "flex";
    gameoverscreen();

    // alert('Game over. Your score is ' + result);
    document.getElementById("getYourScore").textContent = score;
    // 다시 게임 시작 버튼을 눌렀을 경우 게임 시작할 수 있게 한다.

    $modal.submit.onclick = async () => {
      let username = $modal.username.value; // $modal은 모달창과 관련된 것입니다.
      // 아래 3줄의 console.log는 console에서 확인하고 싶으시면 쓰셔도 되구요.
      console.log($modal);
      console.log($modal.username);
      console.log(username);
      // alert($modal.username.value);

      username = username.trim(); // 모달창에서 유저 이름을 저장한 문자열에서 공백을 제거하여 다시 모달창의 유저 이름 입력하는 부분에 저장합니다.
      // 예를 들면 '     abcde     '이 trim() 메서드에 의하여 'abcde'이 되어 username에 저장되는 것이죠
      if (username === undefined) {
        // 모달창의 유저 이름 입력창에 아무 문자도 입력하지 않을 경우 if문 안 코드가 실행됩니다.
        alert("User name is empty! Please fill in the textbox");
        return;
      }

      const reqData = {
        // 아래 3줄의 프로퍼티를 가진 객체 리터럴을 참조하는 reqData를 선언합니다.
        gamename: "aimPractice",
        username: username,
        score: result,
      };

      console.log(result, typeof result);

      const res = await postData(reqData); // 서버에 객체 참조변수인 reqData의 프로퍼티들을 전송하는 거 같아요.
      $modal.SendToServer.textContent = "👍🏻   Submission completed!!!";
      $modal.SendToServer.style.color = "rgb(27, 168, 22)";
      console.log(res);
      alert("Submission completed!!!");
    };
  }
  mouse1 = false;
}

target = {
  setupTarget: function () {
    this.radius = 30;
    this.x = width / 2;
    this.y = height / 2;
    this.x = Math.floor(Math.random() * 700 + this.radius);
    this.y = Math.floor(Math.random() * 400 + 100);
  },
  draw: function () {
    ctx.drawImage(targetImg, this.x - this.radius, this.y - this.radius);
  },
  update: function () {
    x = mousePos.x - this.x;
    y = mousePos.y - this.y;

    if (x ** 2 + y ** 2 <= this.radius ** 2) {
      //hit
      if (mouse1) {
        this.hit();
      }
    } else {
      //miss
    }
  },
  hit: function () {
    this.x = Math.floor(Math.random() * 700 + this.radius);
    this.y = Math.floor(Math.random() * 400 + 100);

    score += 1;
  },
};

function render() {
  ctx.drawImage(backgroundImg, 0, 0);

  target.draw();

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";

  ctx.fillText("score: " + score, 10, 30);
  ctx.fillText("time: " + timeleft, 600, 30);
}

function gameoverscreen() {
  ctx.drawImage(backgroundImg, 0, 0);

  ctx.drawImage(gameovertextImg, 300 - 114, 150);

  ctx.textAlign = "center";
  ctx.fillStyle = "white";

  ctx.font = "40px Arial";
  ctx.fillText("score: " + score, width / 2, height / 2 + 10);
}

// events
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

window.addEventListener(
  "mousemove",
  function (evt) {
    mousePos = getMousePos(canvas, evt);
  },
  false
);

window.addEventListener("mousedown", function (evt) {
  mouse1 = true;
});

document.addEventListener("DOMContentLoaded", function () {
  $modal.container.style.display = "none";
});

async function postData(data) {
  const url =
    "https://script.google.com/macros/s/AKfycbzl7yTwWaIYtiF1kVcQ6vxtLTAU5v3WPa7j9Cyd1VD6S1QTz97kmTDAiJKToOMP0_G2/exec";
  let res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
}

setup();
setupGame();
setInterval(function () {
  update();
}, 1000 / 240);
