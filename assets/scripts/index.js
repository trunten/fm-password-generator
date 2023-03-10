// Array of special characters to be included in password
const specialCharacters = [
    "@",  "%",  "+",  "\\",  "/",  "'",  "!",  "#",  "$",  "^",  "?", 
     ":",  ",",  ")", "(",  "}",  "{",  "]",  "[",  "~",  "-",  "_",  ".",
  ];
  
  // Array of numeric characters to be included in password
  const numericCharacters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  
  // Array of lowercase characters to be included in password
  const lowerCasedCharacters = [
    "a",  "b",  "c",  "d",  "e",  "f",  "g",  "h",  "i",  "j",  "k",  "l",  "m",  
    "n",  "o",  "p",  "q",  "r",  "s",  "t",  "u",  "v",  "w",  "x",  "y",  "z",
  ];
  
  // Array of uppercase characters to be included in password
  const upperCasedCharacters = [
    "A",  "B",  "C",  "D",  "E",  "F",  "G",  "H",  "I",  "J",  "K",  "L",  "M",
    "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
  ];

const charsets = {
upperCase: upperCasedCharacters,
lowerCase: lowerCasedCharacters, 
numbers: numericCharacters, 
special: specialCharacters
};

const MIN_LENGTH = 10;
const MAX_LENGTH = 64;

// Function to prompt user for password options
function getPasswordOptions() {
const options = {};
const length = parseInt(document.getElementById("length").value);
const checkboxes = document.querySelectorAll("input[type='checkbox']");

let anySelected = false
for (el of checkboxes) {
    if (el.checked) { 
        anySelected = true 
        options[el.id] = el.checked;
    };
}
if (!anySelected) {
    showPopup("Select at least one character option", 2500);
    return false;
} else {
    options.length = length;
    return options;
}
}

// Function for getting a random element from an array supplied as a paramater
function getRandom(arr) {
    if (!arr) { return; }
    return arr[Math.floor(Math.random() * arr.length)];
}

// Function to generate password with user input
function generatePassword() {
    const options = getPasswordOptions();
    if (!options) { return ""; }

    let password = "";
    while (password.length < options.length) {
        if (options.length && options.hasUpperCase) { password += getRandom(charsets.upperCase); } 
        if (password.length < options.length && options.hasLowerCase) { password += getRandom(charsets.lowerCase); }
        if (password.length < options.length && options.hasNumbers) { password += getRandom(charsets.numbers); }
        if (password.length < options.length && options.hasSpecial) { password += getRandom(charsets.special); }
    }
    // Shuffle password
    if (Object.keys(options).length > 2) {
        password = [...password].map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value).join("");
    }
    return password;
}

// Get references to the #generate and #copy  elements
const generateBtn = document.querySelector('button');
const copyBtn = document.querySelector('#copy');
const popup = document.getElementById("popup");
let timeout;

// Write password to the #password input
function writePassword(e) {
    e.preventDefault();
    popup.classList.remove("show");
    var password = generatePassword();
    if (password) {
        var passwordText = document.querySelector('#password');
        passwordText.textContent = password;
        passwordText.dataset.placeholder=false;
        copyBtn.dataset.disabled = false;
        document.querySelector("#password").classList.remove("pulse");
        setTimeout(() => { document.querySelector("#password").classList.add("pulse"); },0)
    }
}

// Function to copy the password to clipboard
function copyPassword() {
    const pass = document.querySelector('#password');
    if (pass.dataset.placeholder === "false") {
        const password = document.querySelector('#password').textContent.trimEnd();
        if (password) {
            navigator.clipboard.writeText(password);    
            showPopup();
        }
    }
}

function showPopup(text, delay) {
    if (!delay) { delay = 1500; }
    if (timeout) { clearTimeout(timeout); }
    if (text) { popup.textContent = text } else { popup.textContent = "Copied to clipboard"}
    popup.classList.add("show");
    timeout = setTimeout(function(){ popup.classList.remove("show"); timeout = false;}, delay);
}
  
// Add event listener to generate and copy to clipboard buttons
generateBtn.addEventListener("click", writePassword);
copyBtn.addEventListener("click", copyPassword);
document.querySelector('#password').addEventListener("click", copyPassword);

// =======================
// Password length fields
// =======================

//Set reference to slider and length input fields
const slider = document.querySelector("#length");
const lengthInput = document.querySelector("#lengthValue")

// Update length on slider change
slider.oninput = function() {
    lengthInput.classList.remove("red-text");
    lengthInput.value = this.value;
};

// Update slider on length change
lengthInput.oninput = function() {
    if (this.value < MIN_LENGTH) {
        this.classList.add("red-text");
        slider.value = MIN_LENGTH;
    } else if (this.value > MAX_LENGTH) {
        this.classList.add("red-text");
        slider.value = MAX_LENGTH;
    } else {
        this.classList.remove("red-text");
        slider.value = this.value;
    }
};

// Update slider on length change
lengthInput.onchange = function() {
    if (this.value < MIN_LENGTH) {
        this.value = MIN_LENGTH;
    } else if (this.value > MAX_LENGTH) {
        this.value = MAX_LENGTH;
    }
    this.classList.remove("red-text");
};

// Select all text when clicking on length input field
lengthInput.onclick = function() {
    if (/android|iphone|kindle|ipad/i.test(navigator.userAgent) && this.setSelectionRange) {
        // Mobile only because select gives me that stupid copy/paste popup
        const len = this.value.length;
        // Number fields don't support text selection so turn to a text field to enable
        this.type = 'text';
        if (this.setSelectionRange) {
            this.setSelectionRange(len, len);
            console.log("a");
        } 
        // Turn the field back to a number now we're done
        this.type = 'number';
    } else {
        // Fine everywhere else
        this.select();
    }
};



  