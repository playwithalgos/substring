/**
 * 
 * @param {*} n 
 * @returns a random Word (represented as an array) where letters are 
 */
function randomWord(n) { return Array.from({ length: n }, () => String.fromCharCode(65 + Math.floor(Math.random() * 4))); }


/**
 * 
 * @param {*} label 
 * @returns the parameter in the URL named label
 */
function getParam(label) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(label);
}


const pattern = getParam("pattern") ? Array.from(getParam("pattern")) : randomWord(5);
const text = getParam("text") ? Array.from(getParam("text")) : addPatternAroundTheEnd(randomWord(40), pattern);

/**
 * 
 * @param {*} char 
 * @returns the color of the character
 */
function getColor(char) {
    return `hsl(${((char.charCodeAt(0) - 65) % 13) * 360 / 13} 100% 35%)`;
}

/**
 * 
 * @param {*} text 
 * @param {*} pattern 
 * @returns place the pattern in the text
 */
function addPatternAroundTheEnd(text, pattern) {
    const b = text.length - pattern.length - 1 - Math.floor(Math.random() * 4);
    for (let i = 0; i < pattern.length; i++)
        text[b + i] = pattern[i];
    return text;
}

let pos = 0;


/**
 * 
 * @param {*} el 
 * @param {*} word 
 * @description fill the DOM element el with the word
 */
function fill(el, word) {
    for (const char of word) {
        const charElement = document.createElement("div");
        charElement.classList.add("char");
        charElement.innerText = char;
        charElement.style.background = getColor(char);
        el.appendChild(charElement);
    }
}

fill(document.getElementById("word"), text);
fill(document.getElementById("pattern"), pattern);

const CHARWIDTH = (document.getElementById("word").children[text.length - 1].getBoundingClientRect().left - document.getElementById("word").children[0].getBoundingClientRect().left) / text.length;




function getMousePos(evt) {
    if (evt.pageX)
        return { x: evt.pageX, y: evt.pageY };
    else if (evt.touches)
        return { x: evt.touches[0].pageX, y: evt.touches[0].pageY };
    else
        return { x: 0, y: 0 };
}




/**
 * 
 * @param {*} el
 * @description makes that the element (the pattern) el moves horizontal 
 */
function moveHorizontallyOnDrag(el) {
    let x = 0;
    el.onmousedown = (evt) => {
        evt.preventDefault();
        x = getMousePos(evt).x;
        console.log(x)

        document.ontouchmove = (evt) => {
            el.style.left = (parseInt(el.style.left ? el.style.left : 0) + getMousePos(evt).x - x) + "px";
            x = getMousePos(evt).x;
            evt.preventDefault();
            document.body.style.overflow = "hidden";
        }

        document.onmousemove = (evt) => {
            if (evt.buttons)
                document.ontouchmove(evt);
        }

        document.onmouseup = (evt) => {
            let bestX = 100000;
            let newpos = undefined;
            for (let i = 0; i < text.length; i++) {
                const d = Math.abs(document.getElementById("word").children[i].getBoundingClientRect().left - document.getElementById("pattern").getBoundingClientRect().left);
                if (d < bestX) {
                    bestX = d;
                    newpos = i;
                }
            }
            pos = newpos;

            el.style.left = document.getElementById("word").children[pos].getBoundingClientRect().left - document.getElementById("word").getBoundingClientRect().left + "px";

            document.body.style.overflow = null;
            document.onmousemove = undefined;
            document.onmouseup = undefined;
            document.ontouchmove = undefined;
            document.ontouchend = undefined;
        }

        document.ontouchend = document.onmouseup;
    }

    el.ontouchstart = el.onmousedown;

   
}

moveHorizontallyOnDrag(document.getElementById("pattern"));

/**
document.querySelectorAll(".char").forEach(
    el => el.onclick = () => el.classList.toggle("seen"));
     */