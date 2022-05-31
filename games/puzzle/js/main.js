const $modal = {
  container: document.getElementById("modal-container"),
  username: document.getElementById("gameover-submit-yourScore-name"),
  submit: document.getElementById("gameover-submit-yourScore-button"),
  SendToServer: document.getElementById("sendToServer"),
};

const container = document.querySelector(".image-container");
const gametext = document.querySelector(".game-text");
const playtime = document.querySelector(".play-time");

let tiles = [];
const dragged = {
  el: null,
  class: null,
  index: null,
};
let isPlaying = false;
let timeinterval = null;
let currentTime = playtime.textContent;

let result;
setgame();

// functions

function setgame() {
  container.innerHTML = "";
  gametext.style.display = "none";
  clearInterval(timeinterval);

  tiles = createImageTiles();
  tiles.forEach((tile) => container.appendChild(tile));

  setTimeout(() => {
    container.innerHTML = "";
    timeinterval = setInterval(() => {
      currentTime--;

      playtime.innerText = currentTime;
      if (currentTime === 0) {
        checkStatus();
      }
    }, 1000);

    shuffle(tiles).forEach((tile) => container.appendChild(tile));
    isPlaying = true;
  }, 5000);
}

function checkStatus() {
  const currentList = [...container.children];
  const unMatchedList = currentList.filter((child, index) => {
    return Number(child.getAttribute("data-index")) !== index;
  });

  if (unMatchedList.length === 0) {
    gametext.style.display = "block";
    let isPlaying = false;
    result = currentTime;
    clearInterval(timeinterval);

    // alert('Game over. Your score is ' + result);
    document.getElementById("getYourScore").textContent = currentTime;
    $modal.container.style.display = "flex";
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
        gamename: "puzzle",
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
  } else if (currentTime === 0) {
    let isPlaying = false;
    result = currentTime;
    clearInterval(timeinterval);

    // alert('Game over. Your score is ' + result);
    document.getElementById("getYourScore").textContent = currentTime;
    $modal.container.style.display = "flex";
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
        gamename: "puzzle",
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
}

function createImageTiles() {
  const tempArray = [];

  Array(16)
    .fill()
    .forEach((_, i) => {
      const li = document.createElement("li");
      li.setAttribute("data-index", i);
      li.setAttribute("draggable", "true");
      li.classList.add("list" + i);
      container.appendChild(li);
      tempArray.push(li);
    });

  return tempArray;
}

function shuffle(array) {
  let index = array.length - 1;
  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    index--;
  }
  return array;
}

// events

container.addEventListener("dragstart", (e) => {
  if (!isPlaying) return;
  const obj = e.target;
  dragged.el = obj;
  dragged.class = obj.className;
  dragged.index = [...obj.parentNode.children].indexOf(obj);
});

container.addEventListener("dragover", (e) => {
  e.preventDefault();
});

container.addEventListener("drop", (e) => {
  if (!isPlaying) return;
  const obj = e.target;

  if (obj.className !== dragged.class) {
    let originPlace;
    let isLast = false;

    if (dragged.el.nextSibling) {
      originPlace = dragged.el.nextSibling;
    } else {
      originPlace = dragged.el.previousSibling;
      isLast = true;
    }

    const droppedIndex = [...obj.parentNode.children].indexOf(obj);

    dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);

    isLast ? originPlace.after(obj) : originPlace.before(obj);
  }

  checkStatus();
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

document.addEventListener("DOMContentLoaded", function () {
  $modal.container.style.display = "none";
});
