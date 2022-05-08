import Screen from "./screen";
import './scss/style.scss'
import ASScroll from "@ashthornton/asscroll";

new Screen({domElement: document.querySelector('#container'), debug: true})


const asscroll = new ASScroll();

window.addEventListener('load', ()=> {
    asscroll.enable({
        horizontalScroll: true
    })
}, {passive: true})