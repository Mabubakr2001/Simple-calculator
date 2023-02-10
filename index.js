const previousOperandSpot = document.querySelector("[data-prev-operand]");
const currentOperandSpot = document.querySelector("[data-curr-operand]");
const allNumsBtns = document.querySelectorAll("[data-num]");
const allOperationsBtns = document.querySelectorAll("[data-operation]");
const deleteBtn = document.querySelector("[data-delete]");
const clearAllBtn = document.querySelector("[data-clear]");
const equalsBtn = document.querySelector("[data-equals]");

class Calculator {
  #previousOperand = "";
  #currentOperand = "";
  #operation = undefined;

  constructor(previousOperandSpot, currentOperandSpot) {
    this.previousOperandSpot = previousOperandSpot;
    this.currentOperandSpot = currentOperandSpot;
    document.addEventListener("keydown", (event) =>
      this._handleKeyPress(event)
    );
    allNumsBtns.forEach((btn) =>
      btn.addEventListener("click", () => this._appendNum(btn.dataset.num))
    );
    allOperationsBtns.forEach((btn) => {
      btn.addEventListener("click", () => this._addOperation(btn.textContent));
    });
    equalsBtn.addEventListener("click", () =>
      this._checkOperation(this.#operation)
    );
    deleteBtn.addEventListener("click", () =>
      this._delete(this.#currentOperand)
    );
    clearAllBtn.addEventListener("click", (event) => this._clearAll(event));
  }

  _handleKeyPress(event) {
    if (event.ctrlKey) return;
    const keyPressed = event.key;
    if (keyPressed.match(/^[0-9\.]$/)) this._appendNum(keyPressed);
    if (keyPressed.match(/[+\-\/\*]/)) this._addOperation(keyPressed);
    if (keyPressed === "=" || keyPressed === "Enter")
      this._checkOperation(this.#operation);
    if (keyPressed === "Backspace") this._delete(this.#currentOperand);
    if (keyPressed === "Escape") this._clearAll(keyPressed);
  }

  _appendNum(number) {
    if (number === "." && this.#currentOperand === "") return;
    if (number === "." && this.#currentOperand.includes(number)) return;
    this.#currentOperand += number;
    this.currentOperandSpot.textContent = this._displayNumLocal(
      this.#currentOperand
    );
  }

  _displayNumLocal(number) {
    const stringNum = number.toString();
    const stringNumParts = stringNum.split(".");
    const integerPart = parseFloat(stringNumParts.at(0));
    const decimalPart = stringNumParts.at(1);
    let integerDisplay;
    if (isNaN(integerPart)) integerDisplay = "";
    else
      integerDisplay = integerPart.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      });
    if (decimalPart != null) return `${integerDisplay}.${decimalPart}`;
    else return integerDisplay;
  }

  _addOperation(operation) {
    if (this.#currentOperand == "") return;
    if (this.#currentOperand.split("").at(-1) === ".") return;
    if (this.#previousOperand !== "") this._checkOperation(this.#operation);
    this.#operation = operation;
    this.#previousOperand = this.#currentOperand;
    this.previousOperandSpot.textContent = `${this._displayNumLocal(
      this.#previousOperand
    )} ${this.#operation}`;
    this.#currentOperand = "";
    this.currentOperandSpot.textContent = this.#currentOperand;
  }

  _checkOperation(operation) {
    if (
      this.#previousOperand === "" ||
      this.#currentOperand === "" ||
      this.#currentOperand === "."
    )
      return;
    const prevOperandNum = Number(this.#previousOperand);
    const currOperandNum = Number(this.#currentOperand);
    let answer;
    switch (operation) {
      case "x":
      case "*":
        answer = prevOperandNum * currOperandNum;
        break;
      case "+":
        answer = prevOperandNum + currOperandNum;
        break;
      case "-":
        answer = prevOperandNum - currOperandNum;
        break;
      case "÷":
      case "/":
        answer = prevOperandNum / currOperandNum;
        break;
      default:
        return;
    }
    this.previousOperandSpot.textContent = "";
    this.currentOperandSpot.textContent = this._displayNumLocal(answer);
    this.#currentOperand = answer.toString();
    this.#previousOperand = "";
  }

  _delete(operand) {
    let newOperand;
    newOperand = operand.substring(0, operand.length - 1);
    if (newOperand === "-") newOperand = "";
    this.#currentOperand = newOperand;
    this.currentOperandSpot.textContent = this._displayNumLocal(
      this.#currentOperand
    );
  }

  _clearAll(event) {
    if (event !== "Escape" && event.target.dataset.clear === undefined) return;
    this.#previousOperand = "";
    this.previousOperandSpot.textContent = this.#previousOperand;
    this.#currentOperand = "";
    this.currentOperandSpot.textContent = this.#currentOperand;
    this.#operation = undefined;
  }
}

const calculator = new Calculator(previousOperandSpot, currentOperandSpot);
