let colors = ["red", "orange", "yellow", "green", "blue", "purple"]
let numberLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
let memoryLabels = ["PUSH","POP", "PUSH","SWAP"]
let operationLabels = ["+","-","*", "/", "^"]
let disasterLabels = ["RESET", "", "SHUFFLE", "", "SPIN", "", "RANDOM", ""]
let finalLabels= ["SET", "SET","SET","EVIL"]

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function shuffleArr(arr) {
  	for (let i = arr.length - 1; i > 0; i--) {
    	const j = Math.floor(Math.random() * (i + 1));
    	[arr[i], arr[j]] = [arr[j], arr[i]];
  	}
  	return arr;
}

class Wheel {
  isSpinning = false
  angle = 0
  velocity = 0
  friction = 0
  selectedSlatIdx = 0

  constructor(id, labels, colors, onSelect, fontSize = 40) {
    this.id = id
    this.canvas = document.getElementById(id)
    this.ctx = this.canvas.getContext("2d")
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.labels = labels
    this.colors = colors
    this.fontSize = fontSize
    this.fontColor = "black"
    this.slatColorOffset = Math.floor(Math.random() * this.colors.length)

    this.spinVelocityMin = 10
    this.spinVelocityMax = 20//30

    this.spinFrictionMin = 30//10
    this.spinFrictionMax = 40

    this.canvas.addEventListener('click', () => this.spin(), false);
    this.onSelect = onSelect
  }
  
  update() {
    this.selectedSlatIdx = this.drawWheel(this.angle)
    this.angle += this.velocity

    if (this.velocity > 0) {
      this.velocity -= this.friction
    } else {

      if (this.isSpinning) {
        console.log(this.selectedSlatIdx)
        this.onSelect(this.selectedSlatIdx)
      }
      
      this.isSpinning = false
      this.velocity = -.0003
    }
  }

  spin() {
    if (!this.isSpinning) {
      this.velocity = randRange(this.spinVelocityMin, this.spinVelocityMax) / 100
      this.friction = randRange(this.spinFrictionMin, this.spinFrictionMax) / 100000
      
      console.log("Spin ", this.id, ": V: ", this.velocity, " F: ", this.friction)
      this.isSpinning = true
    }
  }

  drawSlat(angleStart, angleSize, angleOffset, text, color) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(this.width/2, this.height/2, this.height/2, angleStart + angleOffset, angleStart + angleSize + angleOffset);
    this.ctx.lineTo(this.width/2, this.height/2)
    this.ctx.closePath()
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.restore()

    this.ctx.save();
    this.ctx.translate(this.width/2, this.height/2);
    this.ctx.rotate(angleStart + angleSize/2 + angleOffset);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = this.fontColor
    this.ctx.font = this.fontSize + "px Author";
    this.ctx.fillText(text, this.height/4 + 13, 0);
    this.ctx.restore();
  }

  drawFlap() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.moveTo(this.width, this.height/2)
    this.ctx.lineTo(this.width-20, this.height/2)
    this.ctx.lineWidth = 3
    this.ctx.stroke()
    this.ctx.restore()
  }

  drawWheel(angleOffset) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const slatNum = this.labels.length
    const slatSize = (Math.PI*2) / slatNum
    
    for (let idx = 0; idx < slatNum; idx++) {
      this.drawSlat(idx * slatSize, slatSize, angleOffset, this.labels[idx], this.colors[(idx + this.slatColorOffset) % this.colors.length])
    }

    this.drawFlap()

    const normalizedOffset = ((angleOffset % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
    let selectedIdx = Math.floor(((Math.PI * 2) - normalizedOffset) / slatSize) % slatNum;
    return selectedIdx
  }
}

class Memory {
  number = 0
  memory = []

  constructor(canvasID, evilFunc) {
    this.evilFunc = evilFunc

    this.memoryElement = document.getElementById("Memory")

    this.update()
  }
  
  update() {
    console.log("Number:", this.number, "Memory:", this.memory)

    this.memoryElement.innerHTML = ""
    
    let numberSlot = document.createElement("li")
    let numberLabel = document.createTextNode(this.number)
    numberSlot.classList.add("memorySlot")

    this.memoryElement.appendChild(numberSlot)
    numberSlot.appendChild(numberLabel)


    let emptySlot = document.createElement("li")
    emptySlot.classList.add("memorySlotEmpty")
    this.memoryElement.appendChild(emptySlot)


    let memoryReversed = this.memory.toReversed()

    for (let i = 0; i < 10; i++) {
      let content = ""

      if (i < this.memory.length) {
        content = memoryReversed[i]
      }

      let memorySlot = document.createElement("li")
      let memoryLabel = document.createTextNode(content)
      memorySlot.classList.add("memorySlot")

      this.memoryElement.appendChild(memorySlot)
      memorySlot.appendChild(memoryLabel)
    }
  }

  setNumber(number) {
    this.number = number
  }

  getNumber() {
    return this.number
  }

  push() {
    if (this.number != 0) {
      this.memory.push(this.number)
      this.number = 0
    }
  }

  pop() {
    if (this.memory.length > 0) this.number = this.memory.pop()
  }

  swap() {
    if (this.memory.length > 0) {
      let val = this.memory.pop()
      this.memory.push(this.number)
      this.number = val

    } else {
      this.memory.push(this.number)
      this.number = 0
    }
  }

  clear() {
    this.memory = []
    this.number = 0
  }

  shuffle() {
    this.memory = shuffleArr(this.memory)
  }

  add() {
    if (this.memory.length >= 2) {
      const a = this.memory.pop()
      const b = this.memory.pop()
      this.memory.push(clamp(a + b, 0, 100))
    } else {
      evilFunc()
    }
  }

  sub() {
    if (this.memory.length >= 2) {
      const a = this.memory.pop()
      const b = this.memory.pop()
      this.memory.push(clamp(a - b, 0, 100))
    } else {
      evilFunc()
    }
  }

  mul() {
    if (this.memory.length >= 2) {
      const a = this.memory.pop()
      const b = this.memory.pop()
      this.memory.push(clamp(a * b, 0, 100))
    } else {
      evilFunc()
    }
  }

  div() {
    if (this.memory.length >= 2) {
      const a = this.memory.pop()
      const b = this.memory.pop()
      
      if (b != 0)
        this.memory.push(clamp(Math.round(a / b), 0, 100))
      else
        evilFunc()
    } else {
      evilFunc()
    }
  }

  pow() {
    if (this.memory.length >= 2) {
      const a = this.memory.pop()
      const b = this.memory.pop()
      this.memory.push(clamp(Math.pow(a, b), 0, 100))
    } else {
      evilFunc()
    }
  }
}


function onNumberSelect(idx) {
  let number = idx + 1

  memory.setNumber(number)
  memory.update()
}

function onMemorySelect(idx) {
  let memoryOp = memoryLabels[idx]

  if (memoryOp === "PUSH") memory.push()
  else if (memoryOp === "POP") memory.pop()
  else if (memoryOp === "SWAP") memory.swap()
  
  memory.update()
}

function onOperationSelect(idx) {
  let operation = operationLabels[idx]
  console.log("Operation: ", operation)

  if (operation === "+") memory.add()
  else if (operation === "-") memory.sub()
  else if (operation === "*") memory.mul()
  else if (operation === "/") memory.div()
  else if (operation === "^") memory.pow()

  memory.update()
}

function onDisasterSelect(idx) {
  let disaster = disasterLabels[idx]
  console.log("Disaster: ", disaster)

  if (disaster === "RESET") memory.clear()
  else if (disaster === "SHUFFLE") memory.shuffle()
  else if (disaster === "RANDOM") setVolume(randRange(0,100))
  else if (disaster === "SPIN") {
    numberWheel.spin()
    memoryWheel.spin()
    operationWheel.spin()
    disasterWheel.spin()
    finalWheel.spin()
  }

  memory.update()
}


function onFinalSelect(idx) {
  let final = finalLabels[idx]
  console.log("Final: ", final)

  if (final === "SET") {
    console.log("Set volume to:", memory.getNumber())
    setVolume(memory.getNumber())
    memory.clear()
  }
  else if (final === "EVIL") evilFunc()

  memory.update()
}

function evilFunc() {
  disasterWheel.spin()
}

function setVolume(num) {
  let volumeElement = document.getElementById("Volume")
  volumeElement.value = num 
}

let numberWheel = new Wheel("NumberWheel", numberLabels, colors, onNumberSelect)
let memoryWheel = new Wheel("MemoryWheel", memoryLabels, colors, onMemorySelect)
let operationWheel = new Wheel("OperationWheel", operationLabels, colors, onOperationSelect)
let disasterWheel = new Wheel("DisasterWheel", disasterLabels, colors, onDisasterSelect, 30)
let finalWheel = new Wheel("FinalWheel", finalLabels, colors, onFinalSelect)

let memory = new Memory(evilFunc)

function loop() {
  numberWheel.update()
  memoryWheel.update()
  operationWheel.update()
  disasterWheel.update()
  finalWheel.update()

  requestAnimationFrame(loop)
}

loop()


