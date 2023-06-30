let balance = document.querySelector(".balance");
let betAmount = document.querySelector(".bet-amount");
let slotCont = document.querySelector(".slot_cont");

let active = true;
let autoMode = false;

let colAmount = 3;
let rowAmount = 3;
let slotAmount = 3;
let slotLength = 24;
let slotName = "s2";

let visibleSlots = [];

balance.innerHTML = localStorage.getItem("balance_b93");

setVisibleSlots();

for (let i = 0; i < colAmount; i++) {
  let slotCol = document.createElement("div");
  slotCol.classList.add("slot_col");
  slotCont.appendChild(slotCol);
}

initInnerCols();
drawVisibleSlots();

document.querySelector(".spin").onclick = () => {
  if (
    !active ||
    (Number(betAmount.innerHTML) > Number(balance.innerHTML) && !playing) ||
    !Number(betAmount.innerHTML)
  ) {
    return;
  }

  active = false;

  changeBalance(-Number(betAmount.innerHTML));

  setVisibleSlots();

  drawRandomSlots();
  drawVisibleSlots();

  for (let innerSlotCol of document.querySelectorAll(".inner_slot_col")) {
    innerSlotCol.style.top = -(slotLength + rowAmount) * 100 + "%";
  }

  setTimeout(() => {
    active = true;
    resetSlots();

    if (getMaxCombo() >= 3) {
      gameOver(Math.round((1 + getMaxCombo()) * Number(betAmount.innerHTML)));
    }
  }, 4300);
};

document.querySelector(".plus").onclick = () => {
  if (
    Number(betAmount.innerHTML) + 100 > Number(balance.innerHTML) ||
    !active
  ) {
    return;
  }

  betAmount.innerHTML = Number(betAmount.innerHTML) + 100;
};

document.querySelector(".minus").onclick = () => {
  if (!active || Number(betAmount.innerHTML) - 100 < 0) {
    return;
  }

  betAmount.innerHTML = Number(betAmount.innerHTML) - 100;
};

window.onload = () => {
  document.querySelector(".wrapper").classList.remove("hidden");
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setVisibleSlots() {
  for (let i = 0; i < colAmount; i++) {
    visibleSlots[i] = [];

    for (let j = 0; j < rowAmount; j++) {
      visibleSlots[i][j] = randInt(1, slotAmount);
    }
  }
}

function drawRandomSlots() {
  for (let i = 0; i < colAmount; i++) {
    for (let j = 0; j < slotLength; j++) {
      let slot = document.createElement("div");
      slot.classList.add("slot", "block");

      let slotPic = document.createElement("img");
      slotPic.src = `../png/${slotName}${randInt(1, slotAmount)}.png`;

      slot.appendChild(slotPic);
      document.querySelectorAll(".inner_slot_col")[i].appendChild(slot);
    }
  }
}

function drawVisibleSlots() {
  for (let i = 0; i < colAmount; i++) {
    for (let j = 0; j < rowAmount; j++) {
      let slot = document.createElement("div");
      slot.classList.add("slot", "block");

      let slotPic = document.createElement("img");
      slotPic.src = `../png/${slotName}${visibleSlots[i][j]}.png`;

      slot.appendChild(slotPic);
      document.querySelectorAll(".inner_slot_col")[i].appendChild(slot);
    }
  }
}

function initInnerCols() {
  for (let i = 0; i < colAmount; i++) {
    let innerSlotCol = document.createElement("div");
    innerSlotCol.classList.add("inner_slot_col");

    document.querySelectorAll(".slot_col")[i].appendChild(innerSlotCol);
  }
}

function resetSlots() {
  for (let innerSlotCol of document.querySelectorAll(".inner_slot_col")) {
    innerSlotCol.remove();
  }

  initInnerCols();
  drawVisibleSlots();
}

function getMaxCombo() {
  let maxCombo = 1;

  for (let i = 0; i < rowAmount; i++) {
    let combo = 1;

    for (let j = 1; j < colAmount; j++) {
      if (visibleSlots[j][i] == visibleSlots[j - 1][i]) {
        combo++;

        if (combo > maxCombo) {
          maxCombo = combo;
        }
      } else {
        combo = 1;
      }
    }
  }

  return maxCombo;
}

function changeBalance(amount) {
  let balance = document.querySelector(".balance");
  localStorage.setItem(
    "balance_b93",
    Number(localStorage.getItem("balance_b93")) + amount
  );
  balance.innerHTML = localStorage.getItem("balance_b93");
}

function gameOver(win) {
  if (win) {
    changeBalance(win);
  }
}
