'use strict';

//startup variabile per i dati del pg - si assume un solo PG e una singola scheda da popolare
var characterInfo = null;
var keptPressed = false;
var waitForCallback=false
var clockList=[]
var FUDB = {};
var data = {};

const domain = "https://com.studiosplinters.fabulaultimabeyond/";
const fallbackImgB64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAABESAAAREgEAwpvaAAACCklEQVQokbWSO2hUURiE5//vuY/NzVNXYohuCCoJKVSMIIqNYrqIkEJIo5WKjYJgIYjGQstUgihiaSpBCIKNEFFQEDEGNObhc03MWza7yZ6995zzWwSCYJXC6QZmmvmGRAQbEW8oDUABSEQcwIAABDCgiCoQASKQMykrvwLxQQSoca2vmjIgDeIYNEu0VeiUCvrJVAn64EfPHuLoyT64OfZ2WKeU8kbCegADupwLMidIlsTtJBoW3pQm2535/nMyZ11rGA+xd1i0ipUHB+coDtVmpkcgD0zixCCFL8ligzfHSEJbbYRbPcWNQO71Mr9xtRbzJVOTuCwAEL2z3gdbGuzD8kTpyY3Pec3vbb32lBNeHJpcTYMjz3k1cTURj1zugJXKyy+l2jA+fn5h8MyWrnNteXn84tu2thYlItMTY9pI2L67d1/D2UNZJgqY0uWS0WVUZ6ua6ry40Vspu9mZSHKqktrEis/m1aWObMZbG9tZ66bGNbPhrrilmfw4XZ12C/nI28++4kxgHEFg1+nEvhdWLTVm08APKNMMUF2NMaEuVjSnIoXfb9N0dDT/62+cV3o6v858ajp97f7H9u6bDy723ysWx77Oz9NUodB76+7Ej9ko8IfvXK/NROu1pyOjF24PALSidfeBPcf27uo52EkiIiLGusJKOVtX/e95imXNRHEUrln672/9A3Ga9XsyeQGMAAAAAElFTkSuQmCC";

const systemData={
    svg: {
        bars: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>',
        bolt: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z"/></svg>',
        coins: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zM320 128c106 0 192-28.7 192-64S426 0 320 0 128 28.7 128 64s86 64 192 64zM0 300.4V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4zm416 11c57.3-11.1 96-31.7 96-55.4v-42.7c-23.2 16.4-57.3 27.6-96 34.5v63.6zM192 160C86 160 0 195.8 0 240s86 80 192 80 192-35.8 192-80-86-80-192-80zm219.3 56.3c60-10.8 100.7-32 100.7-56.3v-42.7c-35.5 25.1-96.5 38.6-160.7 41.8 29.5 14.3 51.2 33.5 60 57.2z"/></svg>',
        bone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M598.88 244.56c25.2-12.6 41.12-38.36 41.12-66.53v-7.64C640 129.3 606.7 96 565.61 96c-32.02 0-60.44 20.49-70.57 50.86-7.68 23.03-11.6 45.14-38.11 45.14H183.06c-27.38 0-31.58-25.54-38.11-45.14C134.83 116.49 106.4 96 74.39 96 33.3 96 0 129.3 0 170.39v7.64c0 28.17 15.92 53.93 41.12 66.53 9.43 4.71 9.43 18.17 0 22.88C15.92 280.04 0 305.8 0 333.97v7.64C0 382.7 33.3 416 74.38 416c32.02 0 60.44-20.49 70.57-50.86 7.68-23.03 11.6-45.14 38.11-45.14h273.87c27.38 0 31.58 25.54 38.11 45.14C505.17 395.51 533.6 416 565.61 416c41.08 0 74.38-33.3 74.38-74.39v-7.64c0-28.18-15.92-53.93-41.12-66.53-9.42-4.71-9.42-18.17.01-22.88z"/></svg>',
        book: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"/></svg>',
        backspace: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z"/></svg>',
        "angle-right": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/></svg>',
        trash: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/></svg>',
        times: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>',
        box: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M509.5 184.6L458.9 32.8C452.4 13.2 434.1 0 413.4 0H272v192h238.7c-.4-2.5-.4-5-1.2-7.4zM240 0H98.6c-20.7 0-39 13.2-45.5 32.8L2.5 184.6c-.8 2.4-.8 4.9-1.2 7.4H240V0zM0 224v240c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V224H0z"/></svg>',
        "book-open": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z"/></svg>',
        "shield-alt": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z"/></svg>',
        brain: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M208 0c-29.9 0-54.7 20.5-61.8 48.2-.8 0-1.4-.2-2.2-.2-35.3 0-64 28.7-64 64 0 4.8.6 9.5 1.7 14C52.5 138 32 166.6 32 200c0 12.6 3.2 24.3 8.3 34.9C16.3 248.7 0 274.3 0 304c0 33.3 20.4 61.9 49.4 73.9-.9 4.6-1.4 9.3-1.4 14.1 0 39.8 32.2 72 72 72 4.1 0 8.1-.5 12-1.2 9.6 28.5 36.2 49.2 68 49.2 39.8 0 72-32.2 72-72V64c0-35.3-28.7-64-64-64zm368 304c0-29.7-16.3-55.3-40.3-69.1 5.2-10.6 8.3-22.3 8.3-34.9 0-33.4-20.5-62-49.7-74 1-4.5 1.7-9.2 1.7-14 0-35.3-28.7-64-64-64-.8 0-1.5.2-2.2.2C422.7 20.5 397.9 0 368 0c-35.3 0-64 28.6-64 64v376c0 39.8 32.2 72 72 72 31.8 0 58.4-20.7 68-49.2 3.9.7 7.9 1.2 12 1.2 39.8 0 72-32.2 72-72 0-4.8-.5-9.5-1.4-14.1 29-12 49.4-40.6 49.4-73.9z"/></svg>',
        "chevron-up": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"/></svg>',
        "chevron-down": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>',
        "chevron-left": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/></svg>',
        "chevron-right": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>',
        briefcase: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z"/></svg>',
        check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>',
        edit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/></svg>',
        heartbeat: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320.2 243.8l-49.7 99.4c-6 12.1-23.4 11.7-28.9-.6l-56.9-126.3-30 71.7H60.6l182.5 186.5c7.1 7.3 18.6 7.3 25.7 0L451.4 288H342.3l-22.1-44.2zM473.7 73.9l-2.4-2.5c-51.5-52.6-135.8-52.6-187.4 0L256 100l-27.9-28.5c-51.5-52.7-135.9-52.7-187.4 0l-2.4 2.4C-10.4 123.7-12.5 203 31 256h102.4l35.9-86.2c5.4-12.9 23.6-13.2 29.4-.4l58.2 129.3 49-97.9c5.9-11.8 22.7-11.8 28.6 0l27.6 55.2H481c43.5-53 41.4-132.3-7.3-182.1z"/></svg>',
        plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/></svg>',
        minus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/></svg>',
        running: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"><path d="M272 96c26.51 0 48-21.49 48-48S298.51 0 272 0s-48 21.49-48 48 21.49 48 48 48zM113.69 317.47l-14.8 34.52H32c-17.67 0-32 14.33-32 32s14.33 32 32 32h77.45c19.25 0 36.58-11.44 44.11-29.09l8.79-20.52-10.67-6.3c-17.32-10.23-30.06-25.37-37.99-42.61zM384 223.99h-44.03l-26.06-53.25c-12.5-25.55-35.45-44.23-61.78-50.94l-71.08-21.14c-28.3-6.8-57.77-.55-80.84 17.14l-39.67 30.41c-14.03 10.75-16.69 30.83-5.92 44.86s30.84 16.66 44.86 5.92l39.69-30.41c7.67-5.89 17.44-8 25.27-6.14l14.7 4.37-37.46 87.39c-12.62 29.48-1.31 64.01 26.3 80.31l84.98 50.17-27.47 87.73c-5.28 16.86 4.11 34.81 20.97 40.09 3.19 1 6.41 1.48 9.58 1.48 13.61 0 26.23-8.77 30.52-22.45l31.64-101.06c5.91-20.77-2.89-43.08-21.64-54.39l-61.24-36.14 31.31-78.28 20.27 41.43c8 16.34 24.92 26.89 43.11 26.89H384c17.67 0 32-14.33 32-32s-14.33-31.99-32-31.99z"/></svg>',
        archive: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 448c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32V160H32v288zm160-212c0-6.6 5.4-12 12-12h104c6.6 0 12 5.4 12 12v8c0 6.6-5.4 12-12 12H204c-6.6 0-12-5.4-12-12v-8zM480 32H32C14.3 32 0 46.3 0 64v48c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16V64c0-17.7-14.3-32-32-32z"/></svg>',
        pen: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M109.46 244.04l134.58-134.56-44.12-44.12-61.68 61.68a7.919 7.919 0 0 1-11.21 0l-11.21-11.21c-3.1-3.1-3.1-8.12 0-11.21l61.68-61.68-33.64-33.65C131.47-3.1 111.39-3.1 99 9.29L9.29 99c-12.38 12.39-12.39 32.47 0 44.86l100.17 100.18zm388.47-116.8c18.76-18.76 18.75-49.17 0-67.93l-45.25-45.25c-18.76-18.76-49.18-18.76-67.95 0l-46.02 46.01 113.2 113.2 46.02-46.03zM316.08 82.71l-297 296.96L.32 487.11c-2.53 14.49 10.09 27.11 24.59 24.56l107.45-18.84L429.28 195.9 316.08 82.71zm186.63 285.43l-33.64-33.64-61.68 61.68c-3.1 3.1-8.12 3.1-11.21 0l-11.21-11.21c-3.09-3.1-3.09-8.12 0-11.21l61.68-61.68-44.14-44.14L267.93 402.5l100.21 100.2c12.39 12.39 32.47 12.39 44.86 0l89.71-89.7c12.39-12.39 12.39-32.47 0-44.86z"/></svg>',
		comment: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/></svg>',
		"paper-plane": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"/></svg>',
		dice: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M592 192H473.26c12.69 29.59 7.12 65.2-17 89.32L320 417.58V464c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V240c0-26.51-21.49-48-48-48zM480 376c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm-46.37-186.7L258.7 14.37c-19.16-19.16-50.23-19.16-69.39 0L14.37 189.3c-19.16 19.16-19.16 50.23 0 69.39L189.3 433.63c19.16 19.16 50.23 19.16 69.39 0L433.63 258.7c19.16-19.17 19.16-50.24 0-69.4zM96 248c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"/></svg>',
		"share": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z"/></svg>',
		"users": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"/></svg>',
		clock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"/></svg>',
		copy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>',
    },
    unicode:{
        "fisico": "⚔",
        "aria": "🌬",
        "fulmine": "⚡",
        "ombra": "🕳",
        "terra": "⛰",
        "fuoco": "🔥",
        "ghiaccio": "🧊",
        "luce": "🌣",
        "veleno": "☠",
        "mischia": "⚔",
        "distanza": "🏹",
        "punto": "?"
    }
}

const defaultData = {
    id: "Default",
    maxLv: "10",
    maxClasses: "3",
    editorTags: {
        OGGETTO: {
            RARITA: { label: "Rarita'", tag: "select", values: ["BASE", "RARA"] },
            NOME: { label: "Nome", tag: "input", inputType: "text" },
            CATEGORIA: {
                label: "Categoria",
                tag: "select",
                values: [
                    "Da Rissa",
                    "Da Lancio",
                    "Arcana",
                    "Arco",
                    "Flagello",
                    "Da Fuoco",
                    "Lancia",
                    "Pesante",
                    "Pugnale",
                    "Spada",
                    "Armatura",
                    "Scudo",
                    "Accessorio",
                ]
            },
            MARZIALE: { label: "E' marziale", tag: "select", values: ["", "M"] },
            COSTO: { label: "Costo in zenit", tag: "input", inputType: "number" },
            PRECISIONE: { label: "Tiro di Precisione", tag: "input", inputType: "text" },
            DANNO: { label: "Formula Danno", tag: "input", inputType: "text" },
            TIPO_DANNO: { label: "Tipo Danno", tag: "input", inputType: "text" },
            MANI: { label: "Mani Richieste", tag: "select", values: ["Una", "Due", "Sec", "Corpo"] },
            RAGGIO: { label: "Raggio", tag: "select", values: ["Mischia", "Distanza"] },
            QUALITA: { label: "Qualita' Oggetto", tag: "textarea" },
            MOD_PV: { label: "Mod. Punti Vita", tag: "input", inputType: "number" },
            MOD_PM: { label: "Mod. Punti Mente", tag: "input", inputType: "number" },
            MOD_PI: { label: "Mod. Punti Inventario", tag: "input", inputType: "number" },
            MOD_INIZ: { label: "Mod. Iniziativa", tag: "input", inputType: "number" },
            MOD_DIF: { label: "Mod. Difesa", tag: "input", inputType: "number" },
            MOD_DIFM: { label: "Mod. Difesa Magica", tag: "input", inputType: "number" },
            TIPO_DIF: { label: "Tipo Mod. Difesa", tag: "select", values: ["BASE", "MOD"] },
            TIPO_DIF_MAG: { label: "Tipo Mod. Dif. Magica", tag: "select", values: ["BASE", "MOD"] },
            MAX_AB_OGGETTO: { label: "Livello Massimo Abilita' Oggetto", tag: "input", inputType: "number" },
            AB_OGGETTO: { label: "Abilita' conferite", tag: "list", values: "abilities" },
        },
        ABILITA: {
            TIPO: { label: "Tipo Abilita'", tag: "select", values: ["Abilita'", "Eroica", "Incantesimo"] },
            SUBTIPO: { label: "Indica la dimensione relativa per abilita' condizionali (come gli incantesimi)", tag: "input", inputType: "number" },
            MAX_LA: { label: "Massimo Livello Abilita'", tag: "input", inputType: "number" },
            CLASSE: {
                label: "Classe",
                tag: "select",
                values: [
                    "Arcanista",
                    "Artefice",
                    "Canaglia",
                    "Chimerista",
                    "Elementalista",
                    "Entropista",
                    "Furia",
                    "Guardiano",
                    "Lama Oscura",
                    "Maestro d'Armi",
                    "Oratore",
                    "Sapiente",
                    "Spiritista",
                    "Tiratore",
                    "Viandante",
                ]
            },
            NOME: { label: "Nome Abilita'", tag: "input", inputType: "text" },
            OFFENSIVO: { label: "Mettere 'x' se � un incantesimo offensivo", tag: "select", values: ["", "x"] },
            COSTO: { label: "Costo Abilita'", tag: "input", inputType: "text" },
            BERSAGLIO: { label: "Bersaglio", tag: "input", inputType: "text" },
            DURATA: { label: "Durata", tag: "input", inputType: "text" },
            REQUISITI: { label: "Abilita' Requisito", tag: "input", inputType: "text" },
            TESTO: { label: "Testo Abilita'", tag: "textarea" },
            MOD_PV: { label: "Mod. Punti Vita", tag: "input", inputType: "number" },
            MOD_PM: { label: "Mod. Punti Mente", tag: "input", inputType: "number" },
            MOD_PI: { label: "Mod. Punti Inventario", tag: "input", inputType: "number" },
            MOD_INIZ: { label: "Mod. Iniziativa", tag: "input", inputType: "number" },
            MOD_DIF: { label: "Mod. Difesa", tag: "input", inputType: "number" },
            MOD_DIFM: { label: "Mod. Difesa Magica", tag: "input", inputType: "number" },
            COMP_MIS: { label: "Fornisce competenza in armi da mischia marziali?", tag: "select", values: ["0", "1"] },
            COMP_DIS: { label: "Fornisce competenza in armi a distanza marziali?", tag: "select", values: ["0", "1"] },
            COMP_SCU: { label: "Fornisce competenza in scudi marziali?", tag: "select", values: ["0", "1"] },
            COMP_ARM: { label: "Fornisce competenza in armature marziali?", tag: "select", values: ["0", "1"] }
        },
        WIKI: {
			NOME: { label: "Titolo", tag: "input", inputType: "text" },
			DESCRIZIONE: { label: "Contenuto", tag: "textarea" }
        }
    },
    classes: [
        "Arcanista",
        "Artefice",
        "Canaglia",
        "Chimerista",
        "Elementalista",
        "Entropista",
        "Furia",
        "Guardiano",
        "Lama Oscura",
        "Maestro d'Armi",
        "Oratore",
        "Sapiente",
        "Spiritista",
        "Tiratore",
        "Viandante",
    ],
    img: {
        classes: {},
        items: {}
    },
    default: [
        { RARITA: "BASE", NOME: "Colpo Senz'Armi", CATEGORIA: "Da Rissa", MARZIALE: "", COSTO: "0", PRECISIONE: "[DES+VIG]", DANNO: "[TM+0]", TIPO_DANNO: "fisico", MANI: "Una", RAGGIO: "Mischia", QUALITA: "Sempre equipaggiato negli slot mano vuoti.", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", TIPO_DIF: "", TIPO_DIF_MAG: "" },
        { RARITA: "BASE", NOME: "Nessuna", CATEGORIA: "Armatura", MARZIALE: "", COSTO: "0", PRECISIONE: "", DANNO: "", TIPO_DANNO: "", MANI: "Corpo", RAGGIO: "", QUALITA: "Nessuna Qualita'.", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", TIPO_DIF: "MOD", TIPO_DIF_MAG: "MOD" }
    ],
    items: [
        { RARITA: "BASE", NOME: "Colpo Senz'Armi", CATEGORIA: "Da Rissa", MARZIALE: "", COSTO: "0", PRECISIONE: "[DES+VIG]", DANNO: "[TM+0]", TIPO_DANNO: "fisico", MANI: "Una", RAGGIO: "Mischia", QUALITA: "Sempre equipaggiato negli slot mano vuoti.", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", TIPO_DIF: "", TIPO_DIF_MAG: "" },
        { RARITA: "BASE", NOME: "Improvvisata (Misc.)", CATEGORIA: "Da Rissa", MARZIALE: "", COSTO: "0", PRECISIONE: "[DES+VIG]", DANNO: "[TM+2]", TIPO_DANNO: "fisico", MANI: "Una", RAGGIO: "Mischia", QUALITA: "<p style='color:red;'>Si rompe dopo l'attacco.</p>", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", TIPO_DIF: "", TIPO_DIF_MAG: "" },
        { RARITA: "BASE", NOME: "Improvvisata (Dist.)", CATEGORIA: "Da Lancio", MARZIALE: "", COSTO: "0", PRECISIONE: "[DES+VIG]", DANNO: "[TM+2]", TIPO_DANNO: "fisico", MANI: "Una", RAGGIO: "Distanza", QUALITA: "<p style='color:red;'>Si rompe dopo l'attacco.</p>", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", TIPO_DIF: "", TIPO_DIF_MAG: "" },
        { RARITA: "BASE", NOME: "Nessuna", CATEGORIA: "Armatura", MARZIALE: "", COSTO: "0", PRECISIONE: "", DANNO: "", TIPO_DANNO: "", MANI: "Corpo", RAGGIO: "", QUALITA: "Nessuna Qualita'.", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", TIPO_DIF: "MOD", TIPO_DIF_MAG: "MOD" }
    ],
    abilities: [
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Arcanista", NOME: "ABILITA' DA ARCANISTA", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Artefice", NOME: "ABILITA' DA ARTEFICE",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Canaglia", NOME: "ABILITA' DA CANAGLIA",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Chimerista", NOME: "ABILITA' DA CHIMERISTA", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Elementalista", NOME: "ABILITA' DA ELEMENTALISTA", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Entropista", NOME: "ABILITA' DA ENTROPISTA",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Furia", NOME: "ABILITA' DA FURIA",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Guardiano", NOME: "ABILITA' DA GUARDIANO",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Lama Oscura", NOME: "ABILITA' DA LAMA OSCURA",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Maestro d'Armi", NOME: "ABILITA' DA MAESTRO D'ARMI",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Oratore", NOME: "ABILITA' DA ORATORE",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Sapiente", NOME: "ABILITA' DA SAPIENTE",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Spiritista", NOME: "ABILITA' DA SPIRITISTA",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Tiratore", NOME: "ABILITA' DA TIRATORE",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Abilita'", CAPACITA: "", MAX_LA: "1", CLASSE: "Viandante", NOME: "ABILITA' DA VIANDANTE",  OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Abilita' generica di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Arcanista", NOME: "Beneficio di classe: Arcanista", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Artefice", NOME: "Beneficio di classe: Artefice", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Canaglia", NOME: "Beneficio di classe: Canaglia", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Chimerista", NOME: "Beneficio di classe: Chimerista", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Elementalista", NOME: "Beneficio di classe: Elementalista", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Entropista", NOME: "Beneficio di classe: Entropista", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Furia", NOME: "Beneficio di classe: Furia", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Guardiano", NOME: "Beneficio di classe: Guardiano", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Lama Oscura", NOME: "Beneficio di classe: Lama Oscura", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Maestro d'Armi", NOME: "Beneficio di classe: Maestro d'Armi", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Oratore", NOME: "Beneficio di classe: Oratore", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Sapiente", NOME: "Beneficio di classe: Sapiente", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Spiritista", NOME: "Beneficio di classe: Spiritista", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Tiratore", NOME: "Beneficio di classe: Tiratore", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Beneficio", CAPACITA: "", MAX_LA: "", CLASSE: "Viandante", NOME: "Beneficio di classe: Viandante", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "", TESTO: "Beneficio generico di classe. Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Eroica", CAPACITA: "", MAX_LA: "1", CLASSE: "", NOME: "ABILITA' EROICA", OFFENSIVO: "", COSTO: "", BERSAGLIO: "", DURATA: "", REQUISITI: "Requisiti: devi aver padroneggiato almeno una classe. ", TESTO: "Generica abilita' eroica ottenuta al raggiungimento del lv 10 in una classe.  Si puo' modificare come meglio si desidera dal menu' Modifica", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Incantesimo", CAPACITA: "x", MAX_LA: "1", CLASSE: "Elementalista", NOME: "Incantesimo Elementale", OFFENSIVO: "", COSTO: "10", BERSAGLIO: "Incantatore", DURATA: "Istantanea", REQUISITI: "MAGIA ELEMENTALE", TESTO: "<i>Testo dell'incantesimo</i>", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Incantesimo", CAPACITA: "x", MAX_LA: "1", CLASSE: "Entropista", NOME: "Incantesimo Entropico", OFFENSIVO: "", COSTO: "10", BERSAGLIO: "Incantatore", DURATA: "SceIstantaneana", REQUISITI: "MAGIA ENTROPICA", TESTO: "<i>Testo dell'incantesimo</i>", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" },
        { TIPO: "Incantesimo", CAPACITA: "x", MAX_LA: "1", CLASSE: "Spiritista", NOME: "Incantesimo Spirituale", OFFENSIVO: "", COSTO: "10", BERSAGLIO: "Incantatore", DURATA: "Istantanea", REQUISITI: "MAGIA SPIRITUALE", TESTO: "<i>Testo dell'incantesimo</i>", MOD_PV: "0", MOD_PM: "0", MOD_PI: "0", MOD_INIZ: "0", MOD_DIF: "0", MOD_DIFM: "0", COMP_MIS: "0", COMP_DIS: "0", COMP_SCU: "0", COMP_ARM: "0" }
    ],
    bestiary: [
        {
            NOME: "Lupo",
            IMG:"data:image/png;base64,/9j/4AAQSkZJRgABAQEAkACQAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAB6AHoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6pooooAKjkmijdEkkRWc4UMcbj6D1qSqGuaRY65pk2n6pAs9rKMMp4I9weoI9RQA/+0rUap/Z7yFLsx+aqMCN69Mqehx3HUVcr5P8bwXfgzxJaNp3iptXtoZW8gC4LzWvI+RwDt9vfH8NeteD/izaXq20Wshbd5flEgPBPqM9R7dR784Vx2PVqKhtbqC7TfbSpKo67TnH19KmpiCiiigAoritI8WIfiBeeHJ8L5sP2u2JcHPJyo9cgb/pmu1oAKKZFLHLv8t1bYxRsHoR1FPoAKKKKAA9Kx9J8S6Rqt5PZ2V7G17AxWW2kBjlXHqjANj3xitivOfjJ4R/t3SY73StNuLnXoGAge2dEbH+2WZeB2wcg9O9AHo1FfOOmeOPHPgO4gt/E9pcXNpJwEvTliQPmEcw6np13D6V7b4S8Y6N4qtw+lXQM4UNJbSfLLH9V7j3GR70Aat7pWn3zh72wtLhx0aaFXI/MV8tfFbwo/hHxv8Auoz/AGJdt50Cj7seTyv4Nx9CvrX1jXF/FnwwPE3hK5ihjD39qDPb4HzMR1QfUD8wPSlJXRUXZ3PIPDXiO5014G+074U+XYzENGP9lhyF/HafevXtA8YpcAJO/nj2AEwHrsHDj3Tn/Z7183aCZHQRo4DjI5OOP8/zFdG8lwLfYjkTJhhzzkdwe1c0K2vLLc662GsueOx9P288VzAk1vIksTjcro2Qw9Qao65qFvYWbG5uI4FZSWd2xsQfeb8Bx9SPWvGLHxhri2QW2j+z6kSFa5UbvPx13x42l/8AbHNTXpuNQiabW5nnbGXRnLDj1A/QLxW/Ojjsec+JfENy/jlfEtmpt3jnRrdANuI1wqqfqoHy/wC9X1ZFqdrJo8Wpq5+ySQrOrY5KkZHHrz0r5M1aM3dwghicu8g8qJBkkZr1zxd4jk0XwZaaQ6+TePZxwG3VgfssYTaSzf3zgr7YP4vmA2fgnrA1iPxPPjaZdUa42E/d3ovH/jtelZ5x3r59/Z31ax0v/hIptQvIbaJ1jlJlcLwC/QdzyentXaeFfG1zr/xMubcRzRaSunFoYyuWJ8xcOw/hJBPH0HWmmI9PoqsJ5mJC2xX08xwM/lml82f/AJ4D/vv/AOtTAsUUUUAcn8T/AAqni7wlc2AA+1Rnz7ZvSRc4H4jI/Gvku0ubvT7yJ45JILpGzHMjMrBh/wCgkV9wV80/HLw2NC8VNqK2+/StTPmnbx5c38f58N+J/u1L01KSvozS8I/GnU7CWODxRbfbLP7v2mIBZlPuPuv+GD9a73X/ABd/aH2K68HTi4cwyJLMyNshVtpyykDLjbwD0z0Oa8Q8FeHJfF2qrb3WYdNgIM9yOcg9AP8AbJ/qa+hrCxtdPsYrOwgS3toRtUDr+fc+9En2FyuO543daNaLPdz3Fsbi4LNNI7HJzjczFfuqKsWVrHHDETGiZAOwDgGtnxrrHh+wtprKe4dEeULcRWSb3PPAc9EycdTWXCUuGW4W38gYwkZfeR7k9zWbRrEt+cQmM7V9qz7i4lnmWCGN5E9AeM+9WbqN/scNxnYkkuyL/ppgEkj2Hr9KbZ3ItXy4PI7UgNLRrdNKD3CBBeHkSnnZ9K8+8c3v2h2jjkLp96WQ9XNdbf373C+XGCid89TXGahaz3zm2Fs8ab/3kh7/AP1sYoRLKXh7yo9OluyAXeTZGPpW9YRyRu95HPqAuZ/9ZJbyOM+2QKz7LSb2BcQ2gcZOxxKAQP6VYm1K5h2WFvBDbTOQm/fv8v3q0xNG0tvIkfnjUdTR8bihnJ/nUya1qoRR/a970/vmsXXZ57G4zzNDxjHJz71RTWLjaOX6elVzk2PrmikdgilmICgZJ9BXNx+L7S41iLTrG0u7mV4/OMihFRE9W3MCPoRmqEdLXP8AjnSrDXNBl07UEDtJ80OPvK46OPYZ59s1bvLy5VWw0MK8cgGRvy4x+tZ0RkbccyNuGXdzlnPoT/QYApXHYwvDWg2Xh/TIdO02PFvAOXJ5kf8A56H/ADwK4nXvGN3rszW3hbz5LOK4ENybeMmd0zglP7gHr1PbFeqLGM5I/On/AIflWVSDmrJ2LU1F6nmt9oN7qHhy/wBB0vToLOzu2ik86dNjqUkUuMDLc7B15yxra0rwRGiIdWuDcgf8so/3cf49z+ddioHGQKS4njHyYJXO0knAHFEKfJBRk7ic7u5x9/oEmq6glwZBbWcKeXCcc47lE7dsZ/Kobzw/plvbPJPE4QfxvmaRz7Dpn8K6q0nt7uHfHPHMwzl4zx16Ux7UPMHPz4+UZpgeJ3kcU1+qaXZ3oUk/J5jlz9f4B+A/GpdRSSxmjimIMpiDlAc7OT+ten65Pb2ltIX5c/5xXkWp3X2rUJpz95z+gpSKKGsaw9lb+UiSSTSdAmen4ViWYuYL8Xd/FcwYH7sPGcDPersniOC1laOCN53+7vHGD7UH7bqUmY7aTd93MsmU/I0dALJv45It7So49Qc02Mx+WvToKlOlwXcDQXdmlpeRj78QGD78dazk0qcKv76Pp6mgD7I615t4d8J2vgvxHqxsnVbLUdkkSFeYsFsoPUDPH4V6TWX4h0ldWswiyGG4jO6KUDO0+hHcH0rZmRnajfW1havcXs6RwoMl3PGK4y/+KegWEavM80cb5aMyROnmj/Y457VyvxA8LeKtcmtdK+0WkJeZY2RpWCyDDEOSV+7047n/AGq6LWfhNfa54S0bR9X1SGW405z5d5HGQyxkYKFc/Px3yvT8ajU0VuoX/wATba08PQ63Ppl2NNnfZFLgEOeeOD14PWmWHxMtLrQJNcFt/wAS2KUQyyCQF4iem9O1X4vhFbt4afRX1OeCzaQSNFCoMbMvRgDyue4zWHqHgLwp4P8ADk1lPb3V5f3qqHtkuGxIyk7X+UZGDyB+HQGk246jjFSdo7jdS+LmmJpn2yySS5h83yf3Q534zjn29q4PXvHWs+Jrh7DR8wxSIeEJ8yTjpk4x+Aog8IXFnHJNb6a6JbDMiIQ7xgr99wOfxxXR+BtEtjd2msgXJZIiqGdAAXzjIPUjHqO9YKpOo9DsnRpUYXerO88GadJonhuws7ojzoYwsmOme/61pXN84RihAUD6VmzXBK/O+BWTqtwHiESyYJO6RBJsOz3710WZw3MvxHqKTwO5R3c5XngY/wA/jXAPDO9yvILHsc8Ank/WtvxHffapFgtQY4IztTYcfiKoWZeDJPzt6nmokUMj0Ymcv5YEo43k81W2T6dcEu77M8E84ret7+KSXE2MjulF7HHdI6AJMj/zpDKBv5JkXlH9xTV2bR8grPmQ2oxHwR2PpU0d+/lr+6PQUCPrWiiitzIrXtja3yxi7gSXy3EiFhyjAggg9QcgVZoooAqapeJY2ckzkDapOT0AHU/569O9fP3inxhLc6nIPD0JvtWud6RzMV2rt6omerfdz6n/AICtesapYyeMNQnsnkli0S2l2XEkb4Ny6nmFfRRzvbqScA/LkeC/tBy3cPj3RNE06whtJYLRfsxtFKMdzkKQQeg2fUc1jUhz/FsdWHqKnot2RfDX/hIb3xVdPfy3NsI4il0JIyCQe3PvXqlzdR2sOTwiDAA9Ko6Ja35htrWV/tmt3Kqsju4AdlXrkcBVXd0/9mroZvhfLfYl1DX51uP7ltAixfiG3E/mK0pwUEY1qjm7nA674ngtMb54xJ2iJwa5S/12fUYXSe5gEZPKAE/1rI+JvgbW9F1fVXnWO8s9P8pmvYUC/JKcJuXs2RXMaLbi+TyBkuOpzxzVTmzNI7axuvuxmQPE5/dkHj6VvwJFcw/IcOODjtXlt5Bc6cGQFwgO4emRXaeGNUN7bCQ8SISjj1rE1Eug6O+zAmSo9K1iC9Xy87LkffjPbFSa9J9n1C3l/gm+Q/UdK5HUYMalK8ZK8np1oEzrdXBdHeE/OOQarRXknlJ+77CodN1EXSeVJxOB+D1opbqVHPagZ9eUUUVsZBRRRQAiqFGFAAznivO/iF4Du9a8Q2ev6NLbDUYYRbslzkLsy3KkAkNh2r0WigDE8JaINF0qOObY9643TyrzlvQE87R0H4nqTW3UVxMsSNktuxnCqXP5DmvOb74kzWzy20tlHb3MbbDJcbkVj6hf/sqANj4jLp2k+ANf81FJu4HQmT5mllZcKST1xx9AvHSvlDwvCg1hkHA8sg+/Nd98SfHE+tiWAzpNj5AF+4n0A5H1Ned6PdfYbw3PlmTgoB7/AOcVEho6nXoEMT8bg+/P5VheHpDDeNGhxkZ47/5zU11qs81mYyFyTyRWVaz+Rfwyemf6VJRt+J5ybW3QnpJx+VZM0nmS7/XrUmu3Aury3SM/J9+q+zMo981SJY1gQVcHawreg1ObyI8nnaO3tWQwzyBVuKNPLT6CiwXPtqiiirEFFFFABVe/Fy1nKti0SXJUiN5QSqn1IHX6VYooA8q1n4YazqK+bJ4xvpbktvYSIVjJ9grfL+Rrz3xR4G8aaervLbTX8YHM1vOZz+R+Y/itfS9UtbZk0a/dGKutvIQwOCDtPNKw7nxObWdriSOaCSNoztcSDBz+NP8AJCY4xjoKuqS0k5YknPeq0/8AF9adtBS3IWyNvTJqBUzKxCev8/8A9VRR/wCvm+oq9H92pDYqPCfMV+uOKsIn71D+NPTvUn9z/PeqSCQxOOfStFbYbRx2qn/9etmP/Vr9BTsK5//Z",
            LIVELLO: 1,
            TIPO: "Bestia",
            DESCRIZIONE: "Doggo",
            TRATTI: "peloso, mordace, affamato",
            DES: 8,
            INT: 6,
            VIG: 8,
            VOL: 6,
            PV: 40,
            PM: 40,
            INIZ: 6,
            DIF: "+1",
            DMAG: "+1",
            ELEM: {
                "fisico": "",
                "aria": "",
                "fulmine": "",
                "ombra": "",
                "terra": "",
                "fuoco": "",
                "ghiaccio": "",
                "luce": "",
                "veleno": ""
            },
            ATTACCHI:[
                {
                    "nome":"Morso",
                    "raggio":"M",
                    "TP":"[DES+VIG]",
                    "TD":"[TM+5]",
                    "tipo":"fisici"
                }
            ],
            INCANTESIMI:[
                {
                    "nome":"Osso Rotante",
                    "offensivo":"1",
                    "TP":"[DES+VIG]",
                    "costo":"10 PM",
                    "bersagli":"Una creatura",
                    "durata":"Istantanea",
                    "descrizione":"Ti tira un osso ni' capo. <b>[TM+10]</b> danni."
                }
            ],
            AZIONI:[
                {
                    "nome":"Fossa",
                    "azione":"1",
                    "descrizione":"Scava una fossa e si ripara da tutti gli attacchi per il prossimo turno"
                }
            ],
            REGOLE:[
                {
                    "nome":"Fiuto",
                    "descrizione":"Impossibile da cogliere di sorpresa"
                }
            ]
        }
    ],
	wiki: [
		{
			NOME: "Articolo",
			DESCRIZIONE: "Descrizione"
		}
	],
}

//check se il browser supporta il sistema di salvataggio in locale: se si', si inizializza il DB e le sue funzioni
if (!window.indexedDB) {
    console.log("Il tuo browser non supporta indexedDB: effettuare i salvataggi tramite l'export dati.");
    document.getElementById("manageCache").style.display = "none";
} else {
    FUDB.version = 3;
    FUDB.tabList=[
        "chars",
        "libraries",
        "chosenSet",
		"EULA"
    ]
    //si dichiarano tutte le funzioni di interazione col database
    //funzione di apertura, inizializza
    FUDB.open = function(onSuccessFn=null) {
        var request = window.indexedDB.open("FUDB", this.version);
        request.onupgradeneeded = function(event) {
            var db = event.target.result;

            FUDB.tabList.forEach(function(tab){
                if (!db.objectStoreNames.contains(tab)) { db.createObjectStore(tab, { keyPath: "id" }); }
            })

            console.log("Upgrade effettuato.")
        }
        request.onsuccess = function(event) {
            FUDB.db = event.target.result;
            console.log("DB aperto.");
			
			if(onSuccessFn != null){
				onSuccessFn()
			}
        }
        request.onerror = function(event) {
            console.log("Si � verificato un errore nell'apertura del DB");
        }
    };

    //opzionale, funzione per cancellare completamente il database
    FUDB.reset = function() {
        window.indexedDB.deleteDatabase("FUDB");
    }

    class tabManager{
        constructor(name) {
            this.tabName=name;
        }

        add(item) {
            var request = FUDB.db.transaction(this.tabName, "readwrite").objectStore(this.tabName).add({
                "id": item.id,
                "data": item.data
            });
            request.onsuccess = function(e) {
                console.log("Valore inserito correttamente!");
            }
            request.onerror = function(e) {
                console.log("Si � verificato un errore nell'inserimento di un oggetto in db. ID: "+item.id);
            }
        }

        update(item) {
            var request = FUDB.db.transaction(this.tabName, "readwrite").objectStore(this.tabName).put({
                "id": item.id,
                "data": item.data
            });
            request.onsuccess = function(e) {
                console.log("Oggetto salvato correttamente!");
            }
            request.onerror = function(e) {
                console.log("Si � verificato un errore nell'inserimento di un oggetto in db. ID: "+item.id);
            }
        }

        get(idRecord, onSuccessFn, onErrFn = null) {
            var request = FUDB.db.transaction(this.tabName, "readonly").objectStore(this.tabName).get(idRecord)
            request.onSuccessFn = onSuccessFn;
            request.onErrFn = onErrFn;

            request.onsuccess = function(e) {
                if (typeof e.target.result !== 'undefined') {
                    this.onSuccessFn(e.target.result);
                } else {
                    this.onErrFn();
                }
            }
            request.onerror = function(e) {
                console.log("Nessun oggetto '" + idRecord + "' trovato.");
                if (this.onErrFn) {
                    this.onErrFn();
                }
            }
        }

        keys(onSuccessFn){
            var request = FUDB.db.transaction(this.tabName, "readonly").objectStore(this.tabName).getAllKeys();
            request.onSuccessFn = onSuccessFn;

            request.onsuccess = function(e) {
                if(e.target.result.length>0){
                    console.log("Chiavi trovate in '"+e.target.source.name+"'.");
                }

                this.onSuccessFn(e.target.result);
            }
            request.onerror = function(e) {
                console.log("Si � verificato un errore nel reperire le chiavi della tabella "+this.tabName);
            }
        }

        delete(idRecord, onSuccessFn) {
            var request = FUDB.db.transaction(this.tabName, "readwrite").objectStore(this.tabName).delete(idRecord);
            request.onSuccessFn = onSuccessFn;

            request.onsuccess = function(e) {
                console.log("Oggetto '"+idRecord+"' eliminato");
                this.onSuccessFn();
            }
            request.onerror = function(e) {
                console.log("Si � verificato un errore durante l'eliminazione dell'oggetto '"+idRecord+"'");
            }
        }
    }

    FUDB.chars=new tabManager("chars");
    FUDB.libraries=new tabManager("libraries");
    FUDB.chosenSet=new tabManager("chosenSet");
    FUDB.EULA=new tabManager("EULA");
}

//funzione per consentire all'utente di interagire con l'opzione di reset cache, chiedendo due conferme prima di procedere
function resetCache() {
    if (window.confirm("Si conferma di voler procedere con la cancellazione di tutti i dati salvati localmente?")) {
        if (window.confirm("ATTENZIONE! Questo portera' alla rimozione irrecuperabile di TUTTI i dati salvati in cache. Vuoi comunque procedere?")) {
            FUDB.reset();
        }
    }
}

//inizializza un nuovo personaggio o, se viene impostato uno specifico nome, carica quel personaggio dalla memoria nella scheda
function startUpCharacter() {
    characterInfo = createNewCharacter();
    updateSheet();
}

//inizializza una nuova struttura dati per il PG. Eventuali modifiche successive alla struttura devono tenere in considerazione che 
//gran parte del programma assume questa specifica struttura per i dati del PG
function createNewCharacter() {
    let newPC = {};

    //memorizza se deve fare autosalvataggio oppure no per questo personaggio
    newPC.autosave=false;

    //nome di default memorizzato e visualizzato nella scheda
    newPC.name = "...";

    //immagine del PG da visualizzare in scheda
    newPC.img = "";

    //colore base della palette usata per la scheda pg
    newPC.sheetColor = "";

    //classi del pg: struttura come un oggetto con proprieta' "nome della classe:livello"
    newPC.levels = {};

    //statistiche del PG, con valore base (default) e temporaneo (per effetti e simili) - NON INCLUDE gli status, tracciati a parte
    newPC.des = { base: 6, temp: 6 };
    newPC.int = { base: 6, temp: 6 };
    newPC.vig = { base: 6, temp: 6 };
    newPC.vol = { base: 6, temp: 6 };

    //status che affliggono il PG. Vengono usati nel calcolo del valore effettivo delle varie statistiche
    newPC.status = {
        slow: false,
        confused: false,
        weak: false,
        shaken: false,
        enraged: false,
        poisoned: false
    }

    //tratti del pg
    newPC.traits = { identity: "...", theme: "...", origin: "..." };

    //legami del PG, tracciati in un array non ordinato (il popolamento della scheda considera la posizione dei singoli legami all'interno
    //dell'array)
    newPC.bonds = [];

    //equipaggiamento, quattro slot che ospitano un oggetto che rappresenta... l'oggetto (struttura dell'oggetto viene direttamente dalla 
    //variabile "data", non vengono fatte assunzioni sulla struttura dell'oggetto stesso a questo livello)
    newPC.equip = {
        main: null,
        secondary: null,
        armor: null,
        accessory: null,
        bonusAccessory: null
    }

    //inventario, array che contiene gli oggetti dell'inventario (struttura dell'oggetto viene direttamente dalla 
    //variabile "data", non vengono fatte assunzioni sulla struttura dell'oggetto stesso a questo livello
    newPC.inventory = [];

    //punti fabula iniziali
    newPC.fabula = { current: 3 };

    //punteggi correnti e massimi. PV e PM massimi dipendono da livello, statistiche e oggetti, quindi vengono ricalcolati da una 
    //funzione apposita ogni volta che viene lanciato l'aggiornamento della scheda (ricalcolati anche nel characterInfo)
    newPC.hp = { current: 0, max: 0, mod: 0 };
    newPC.mp = { current: 0, max: 0, mod: 0 };
    newPC.ip = { current: 0, max: 6, mod: 0 };
    newPC.zenit = { current: 0 };

    //modificatori manuali
    newPC.initMod = 0;
    newPC.pDefMod = 0;
    newPC.mDefMod = 0;

    //array delle abilita' ed incantesimi associate al personaggio. Non sono suddivise a questo livello tra incantesimi, abilita' normali
    //e abilita' eroiche. Inoltre, l'array non fa assunzioni sulla struttura dell'oggetto "abilita'", che viene ripreso tal quale 
    //dalla variabile "data"
    newPC.skills = [];

    newPC.martial = {
        melee: false,
        range: false,
        armor: false,
        shield: false
    }
	
	newPC.peculiarity = {
        pecName: "Nome peculiarita': ...",
        pecDesc: "Descrizione: ..."
    }
	
	newPC.zeroPowerProgress = 0
	
	newPC.zeroPower = {
        zeroName: "Nome potere: ...",
        zeroTrigger: "Innesco: ...",
        zeroEffect: "Effetto: ...",
    }

    newPC.notes=[];

    //la funzione restituisce l'oggetto PG
    return newPC;
}

//si associano a tutti gli elementi preesistenti nell'HTML gli eventi che ognuno di essi deve avere quando ci si interagisce. Vengono
//associati perlopiu' tutti qui per evitare di inserire JS direttamente nell'HTML (alcuni eventi potrebbero comunque essere assegnati
//altrove, soprattutto per elementi che non hanno ID o per oggetti creati dinamicamente, come le descrizioni abilita' ed oggetti)
function setupEvents() {
    //evento chiusura popup
    document.getElementById("closePopup").addEventListener("click", function() {
        document.getElementById("popup").style.display = "none";
        setModal();
    });
    document.getElementById("closePopup").appendChild(fetchSvgIcon("times"));


	if(typeof Capacitor !== 'undefined'){  
        document.getElementById("shareLobby").appendChild(fetchSvgIcon("share"));
    } else {
        document.getElementById("shareLobby").appendChild(fetchSvgIcon("copy"));
    }
    
    //evento tiro in char Roll20, se esiste
    document.getElementById("popupContent").addEventListener("click", 
        function(e) { 
            if(e.target){
                if(e.target.className=="tip"){
                    let roll="/r "+e.target.innerHTML.replace("[", "").replace("]", "");
					waitForCallback=3
					document.getElementById("rollResult").innerHTML=""
                    sendInChat(roll);
                }
            } 
        }
    );
	
	let rollResult=document.createElement("div")
	rollResult.id="rollResult"
	rollResult.innerHTML=""
	document.getElementById("popup").appendChild(rollResult)

    //eventi legati all'impostazione dell'editor nelle diverse modalita'
    document.getElementById("selectCharacterMode").addEventListener("click", function(e){selectToolkitMode("charSheet");});
    document.getElementById("selectLibraryMode").addEventListener("click", function(e){selectToolkitMode("library");});
    document.getElementById("selectBestiaryMode").addEventListener("click", 
        function(e){
            populateSelect(document.getElementById("monsterList"), data.bestiary);
            selectToolkitMode("bestiary");
        }
    );


    document.getElementById("selectListToEdit").addEventListener("change", 
        function(e){
            document.getElementById("selectListToEdit").firstElementChild.setAttribute("hidden","");
            populateEditorSelect();
            document.getElementById("confirmObjectToEdit").disabled=false;
            document.getElementById("duplicateObject").disabled=false;
            document.getElementById("deleteObject").disabled=false;
        }
    );
    document.getElementById("confirmObjectToEdit").addEventListener("click", 
        function(e){
            if(document.getElementById("confirmObjectToEdit").innerHTML=="Modifica"){
                document.getElementById("selectListToEdit").disabled = true;
                document.getElementById("listToEdit").disabled = true;
                openEditor(
                    document.getElementById("listToEdit")[document.getElementById("listToEdit").selectedIndex].refObj, 
                    editLibrary, 
                    document.getElementById("libraryEditor")
                );
                document.getElementById("confirmObjectToEdit").innerHTML="Annulla";

                let list=document.getElementById("selectListToEdit").value;
                let obj=document.getElementById("listToEdit")[document.getElementById("listToEdit").selectedIndex].refObj;

                if(list=="classes" || list=="items"){
                    let imgSelector=document.createElement("div");
                    imgSelector.className="imgSelector";
                    let img=document.createElement("img");
                    img.id="newImgPreview";
                    let imgLoader=document.createElement("input");
                    imgLoader.setAttribute("type", "file");
                    let imgHeader=document.createElement("h3");
                    imgHeader.innerHTML="Immagine Entita'";
                    imgHeader.style.marginBlockStart="0";

                    img.src=data.img[list][
                        Object.keys(data.img[list]).find(k => k.toLowerCase() === obj.NOME.toLowerCase())
                    ];

                    imgLoader.addEventListener("change", 
                        function(e) { 
                            encodeImage(
                                this,
                                function(result){
                                    img.src=result
                                }
                            ) 
                        }
                    );

                    imgSelector.appendChild(imgHeader);
                    imgSelector.appendChild(img);
                    imgSelector.appendChild(imgLoader);
                    
                    document.getElementById("libraryEditor").children[1].prepend(imgSelector)
                }
            } else if(document.getElementById("confirmObjectToEdit").innerHTML=="Annulla"){
                resetEditorMenu();
            }
        }
    );
    document.getElementById("duplicateObject").addEventListener("click", 
        function(e){
            let item=document.getElementById("listToEdit")[document.getElementById("listToEdit").selectedIndex];
            let img=null;
            let nom="";

            if(document.getElementById("newImgPreview")){
                img=document.getElementById("newImgPreview").src
            }

            if (window.confirm("Si vuole duplicare l'entita' '"+document.getElementById("listToEdit").value+"'?")){
                if(item.refObj.hasOwnProperty("arr") && item.refObj.hasOwnProperty("idx")){
                    nom=progressiveNaming(item.text, item.refObj.arr);
                    item.refObj.arr.push(nom)
                } else {
                    let newItem=JSON.parse(JSON.stringify(item.refObj));
                    let arrOfNames=data[document.getElementById("selectListToEdit").value].map(function (obj) {
                            return obj.NOME;
                        }
                    );
                    nom=progressiveNaming(item.refObj.NOME, arrOfNames);
                    newItem.NOME=nom
                    data[document.getElementById("selectListToEdit").value].push(newItem)
                }

                if(img){
                    data.img[document.getElementById("selectListToEdit").value][nom]= img;
                }
                
                resetEditorMenu();
                setLibraryToBeSaved(true);
                populateEditorSelect();
            }
        }
    );
    document.getElementById("deleteObject").addEventListener("click", 
        function(e){
            let item=document.getElementById("listToEdit")[document.getElementById("listToEdit").selectedIndex];

            if (window.confirm("Si vuole eliminare l'entita' '"+document.getElementById("listToEdit").value+"'?")){
                if(item.refObj.hasOwnProperty("arr") && item.refObj.hasOwnProperty("idx")){
                    item.refObj.arr.splice(item.refObj.idx, 1);
                } else {
                    let objToDelete=item.refObj;
                    let whereIsObj=data[document.getElementById("selectListToEdit").value];
                    for (let i = 0; i < whereIsObj.length; i++) {
                        if (objToDelete.NOME === whereIsObj[i].NOME) {
                            whereIsObj.splice(i, 1);
                            break;
                        }
                    }
                }

                resetEditorMenu();
                setLibraryToBeSaved(true);
                populateEditorSelect();
            }
        }
    );

    //eventi dei tasti editor mostri
    document.getElementById("putMonsterInEncounter").addEventListener("click", 
        function(e){
            /*document.getElementById("encounterMonsters").appendChild(
                showMonster(
                    document.getElementById("monsterList")[document.getElementById("monsterList").selectedIndex].refObj,
                    ["head", "stats", "defsShort"]
                )
            );*/
        }
    );

    document.getElementById("confirmMonsterToEdit").addEventListener("click", 
        function(e){
            document.getElementById("bestiaryEditor").innerHTML="";
            document.getElementById("bestiaryEditor").appendChild(
                showMonster(
                    document.getElementById("monsterList")[document.getElementById("monsterList").selectedIndex].refObj,
                    ["head", "desc", "traits", "stats", "defs", "atks", "spells", "actions", "rules"]
                )
            );
        }
    );
    document.getElementById("duplicateMonster").addEventListener("click", 
        function(e){

        }
    );
    document.getElementById("deleteMonster").addEventListener("click", 
        function(e){
            
        }
    );
    
    //eventi del menu contestuale
    document.getElementById("contextMenu").children[0].addEventListener("click", function(e){sendInChat();setModal()});

    document.getElementById("contextMenu").children[1].addEventListener("click", function(e){equip("main");setModal()});
    document.getElementById("contextMenu").children[2].addEventListener("click", function(e){equip("secondary");setModal()});
    document.getElementById("contextMenu").children[3].addEventListener("click", function(e){equip("armor");setModal()});
    document.getElementById("contextMenu").children[4].addEventListener("click", function(e){equip("accessory");setModal()});
    document.getElementById("contextMenu").children[5].addEventListener("click", function(e){equip("bonusAccessory");setModal()});
    
    document.getElementById("contextMenu").children[6].addEventListener("click", function(e){dropItem("before");setModal()});
    document.getElementById("contextMenu").children[7].addEventListener("click", function(e){dropItem("after");setModal()});
    
    document.getElementById("backItems").addEventListener("click", function(e){switchContextListPage(-1)});
    document.getElementById("forwardItems").addEventListener("click", function(e){switchContextListPage(1)});

    //eventi per caricare l'immagine del personaggio
    document.getElementById("loadPCImg").addEventListener("change", 
        function(e) { 
            encodeImage(
                this, 
                function(result){
                    characterInfo.img = result;
                    refreshProfileImage();
                }
            ) 
        }
    );

    //eventi per gli elementi della finestra modale (mostra/nascondi lista oggetti e abilita')
    document.getElementById("levelRecap").appendChild(expandIcon(true, document.getElementById("levelDetail"))); //appende l'icona per mostrare il dettaglio delle classi del PG
    document.getElementById("combatStats").firstElementChild.appendChild(expandIcon(false))
    document.getElementById("traits").firstElementChild.appendChild(expandIcon(false))
    document.getElementById("bonds").firstElementChild.appendChild(expandIcon(false))
    document.getElementById("equip").firstElementChild.appendChild(expandIcon(false))
    document.getElementById("inventory").firstElementChild.appendChild(expandIcon(false))
    document.getElementById("abilities").firstElementChild.appendChild(expandIcon(false))
    document.getElementById("equipAb").firstElementChild.appendChild(expandIcon(false))
    document.getElementById("spells").firstElementChild.appendChild(expandIcon(false))
    document.getElementById("peculiarity").firstElementChild.appendChild(expandIcon(true))
    document.getElementById("zeroPower").firstElementChild.appendChild(expandIcon(true))
    document.getElementById("notes").firstElementChild.appendChild(expandIcon(false))
    document.getElementById("goldAndIP").appendChild(expandIcon(false, document.getElementById("inventoryList"))); //si aggiunge l'icona per chiudere l'inventario alla barra contenente i punteggi di inventario e il denaro
	
    document.getElementById("manageCache").parentNode.previousElementSibling.appendChild(expandIcon(false)); //RIFERIMENTO POSIZIONALE
    document.getElementById("libraryManagement").parentNode.previousElementSibling.appendChild(expandIcon(false)); //RIFERIMENTO POSIZIONALE

    document.getElementById("availableItems").previousElementSibling.appendChild(expandIcon()); //RIFERIMENTO POSIZIONALE
    document.getElementById("availableAbilities").previousElementSibling.appendChild(expandIcon()); //RIFERIMENTO POSIZIONALE
    document.getElementById("wikiEntries").previousElementSibling.appendChild(expandIcon()); //RIFERIMENTO POSIZIONALE
    document.getElementById("loadPCImg").parentNode.previousElementSibling.appendChild(expandIcon(false)); //RIFERIMENTO POSIZIONALE
    document.getElementById("colorPicker").parentNode.previousElementSibling.appendChild(expandIcon(false)); //RIFERIMENTO POSIZIONALE
    document.getElementById("colorPicker").addEventListener("change",
        function(e) {
            characterInfo.sheetColor = e.target.value;
            editPalette();
        }
    );

    document.getElementById("desIcon").appendChild(fetchSvgIcon("running"));
    document.getElementById("intIcon").appendChild(fetchSvgIcon("bolt"));
    document.getElementById("vigIcon").appendChild(fetchSvgIcon("bone"));
    document.getElementById("volIcon").appendChild(fetchSvgIcon("book"));

    document.getElementById("desIcon").firstChild.popupContent=createRoller({type: "stats"});
    document.getElementById("intIcon").firstChild.popupContent=createRoller({type: "stats"});
    document.getElementById("vigIcon").firstChild.popupContent=createRoller({type: "stats"});
    document.getElementById("volIcon").firstChild.popupContent=createRoller({type: "stats"});
    
    document.getElementById("desTag").popupContent=createRoller({type: "stats"});
    document.getElementById("intTag").popupContent=createRoller({type: "stats"});
    document.getElementById("vigTag").popupContent=createRoller({type: "stats"});
    document.getElementById("volTag").popupContent=createRoller({type: "stats"});
	
    document.getElementById("rollForInitiative").popupContent=createRoller({type: "stats"});

    document.getElementById("desIcon").addEventListener("click", showPopup);
    document.getElementById("intIcon").addEventListener("click", showPopup);
    document.getElementById("vigIcon").addEventListener("click", showPopup);
    document.getElementById("volIcon").addEventListener("click", showPopup);

    document.getElementById("desTag").addEventListener("click", showPopup);
    document.getElementById("intTag").addEventListener("click", showPopup);
    document.getElementById("vigTag").addEventListener("click", showPopup);
    document.getElementById("volTag").addEventListener("click", showPopup);

    //eventi per la finestra modale e per l'icona hamburger del compendio
    document.getElementById("modalBckgr").addEventListener("click", function(e) { setModal(); });

    document.getElementById("openCompendium").appendChild(fetchSvgIcon("archive"));
    document.getElementById("openGraphics").appendChild(fetchSvgIcon("pen"));
    document.getElementById("openMenu").appendChild(fetchSvgIcon("bars"));
    document.getElementById("openClocks").appendChild(fetchSvgIcon("clock"));
    document.getElementById("openLobby").appendChild(fetchSvgIcon("users"));
    document.getElementById("openChat").appendChild(fetchSvgIcon("comment"));
    document.getElementById("closeMenu").appendChild(fetchSvgIcon("times"));
    document.getElementById("closeLobby").appendChild(fetchSvgIcon("times"));
    document.getElementById("closeChat").appendChild(fetchSvgIcon("chevron-right"));
    document.getElementById("sendChatMsg").appendChild(fetchSvgIcon("paper-plane"));
    document.getElementById("closeModal").appendChild(fetchSvgIcon("times"));
    document.getElementById("closeEditor").appendChild(fetchSvgIcon("times"));

    document.getElementById("openCompendium").addEventListener("click", function(e) { setModal(); });
    document.getElementById("openGraphics").addEventListener("click", function(e) { setModal("graphFU"); });
    document.getElementById("openMenu").addEventListener("click", function(e) { setModal("FUMenu"); });
    document.getElementById("openClocks").addEventListener("click", function(e) { setModal("FUClocks"); });
    document.getElementById("openLobby").addEventListener("click", function(e) { setModal("FULobby"); });
    document.getElementById("openChat").addEventListener("click", 
		function(e) { 
			setModal("FUChat"); 
			document.getElementById("chatLog").scrollTo(0, document.getElementById("chatLog").scrollHeight);
			document.getElementById("openChat").classList.remove("chatNotification");
		});
	
    document.getElementById("closeMenu").addEventListener("click", function(e) { setModal(); });
    document.getElementById("closeLobby").addEventListener("click", function(e) { setModal(); });
    document.getElementById("closeChat").addEventListener("click", function(e) { setModal(); document.getElementById("openChat").classList.remove("chatNotification")});
    document.getElementById("sendChatMsg").addEventListener("click", function(e) { sendMessage(); });
	
	//bypass per fare invio nella textarea senza attivare evento di invio messaggio
	let holdShift=false
	
    document.getElementById("msgToSend").addEventListener("keydown", function(e) {
        if (e.code == "ShiftLeft" || e.code == "ShiftRight") { holdShift=true }
    });
	
    document.getElementById("msgToSend").addEventListener("keyup", function(e) {
		signalWriting()
        if ((e.code == "Enter" || e.code == "NumpadEnter" || e.keyCode === 13) && !holdShift) { sendMessage() } //si attiva solo se viene premuto uno dei tasti invio
        if (e.code == "ShiftLeft" || e.code == "ShiftRight") { holdShift=false }
    });
	
    document.getElementById("closeModal").addEventListener("click", function(e) { setModal(); });
    document.getElementById("closeEditor").addEventListener("click", function(e) { setModal(); });

    //eventi per la gestione del salvataggio
    document.getElementById("resetBtn").addEventListener("click", resetCache);

    //personaggio
    document.getElementById("saveBtn").addEventListener("click", saveCharacter);
    document.getElementById("loadBtn").addEventListener("click", fetchCharFromMemory);
    document.getElementById("deleteBtn").addEventListener("click", deleteCharacter);
	
    document.getElementById("shareChar").addEventListener("click", function(){
		if(p2p.peer){
			let listOfChars=document.getElementById("listOfChars");
			if (listOfChars.value) {
				//si presuppone un solo personaggio per ogni nome
				if(window.confirm("Confermi di voler condividere la scheda di '"+listOfChars.value+"'?")){
					FUDB.chars.get(listOfChars.value,
						function(result) { //se si trova il personaggio, viene eseguita la funzione onSuccessFn di caricamento dati
							console.log("Condivisione in corso...");
							shareCharacter(result.data, usListChar.value)
							console.log("Condivisione completata.");
						},
						function() { //se non si trova il personaggio, viene restituito un messaggio di errore
							console.log("Nessun personaggio da condividere.");
						}
					);
				}
			} else {
				console.log("Nessun personaggio da condividere.");
			}
		} else {
			alert("Nessuna lobby attiva")
		}
	});
	
    document.getElementById("exportChar").addEventListener("click", download);
    document.getElementById("autosaveFlag").addEventListener("click", 
        function(e){
            if(typeof characterInfo.autosave !== 'undefined'){
                characterInfo.autosave=document.getElementById("autosaveFlag").checked
            }
        }
    );

    //libreria
    document.getElementById("loadLib").addEventListener("click", function(e){fetchLibraryFromMemory()});
    document.getElementById("removeLib").addEventListener("click", deleteLibrary);
	
    document.getElementById("shareLib").addEventListener("click", function(){
		if(p2p.peer){
			let libName=document.getElementById("listOfLibraries").value;
			
			if (libName!=null) {
				//si presuppone una sola libreria per ogni nome
				if(window.confirm("Confermi di voler condividere la libreria '"+libName+"'?")){
					FUDB.libraries.get(libName,
						function(result) { //se si trova la libreria, viene eseguita la funzione onSuccessFn di caricamento dati
							console.log("Condivisione in corso...");
							shareLibrary(result.data, null, usListLib.value)
							console.log("Condivisione completata.");
						},
						function() { //se non si trova il personaggio, viene restituito un messaggio di errore
							console.log("Nessuna libreria da condividere.");
						}
					)
				}
			} else {
				console.log("Nessuna libreria da condividere.");
			}
		} else {
			alert("Nessuna lobby attiva")
		}
	});
	
    document.getElementById("broadcastLib").addEventListener("click", function(){
		if(p2p.peer){
			let libName=document.getElementById("listOfLibraries").value;
			
			if (libName!=null) {
				//si presuppone una sola libreria per ogni nome
				if(window.confirm("Confermi di voler condividere la libreria '"+libName+"'?")){
					FUDB.libraries.get(libName,
						function(result) { //se si trova la libreria, viene eseguita la funzione onSuccessFn di caricamento dati
							console.log("Condivisione in corso...");
							broadcastLibrary(result.data)
							console.log("Condivisione completata.");
						},
						function() { //se non si trova il personaggio, viene restituito un messaggio di errore
							console.log("Nessuna libreria da condividere.");
						}
					)
				}
			} else {
				console.log("Nessuna libreria da condividere.");
			}
		} else {
			alert("Nessuna lobby attiva")
		}
	});

    document.getElementById("shareLobby").addEventListener("click", function(){
        shareLobby()
    });
	
    document.getElementById("kickUser").addEventListener("click", function(){
		if(p2p.peer && p2p.master){
			let userID=document.getElementById("usListKick").value;
			
			if (p2p.connList.filter(c=>c.peer===userID).length>0) {
				//si presuppone una sola libreria per ogni nome
				if(window.confirm("Confermi di voler espellere '"+p2p.connList.filter(c=>c.peer===userID)[0].userName+"'?")){
					kickUser(userID)
				}
			} else {
				console.log("Nessun utente valido � stato indicato.");
			}
		} else {
			alert("Nessuna lobby attiva")
		}
	});
	
    document.getElementById("exportLib").addEventListener("click", downloadLibrary);
    document.getElementById("setLib").addEventListener("click", saveDefaultLibrary);
    document.getElementById("saveLib").addEventListener("click", saveLibraryPrompt);

    //evento import da file dei dati PG
    document.getElementById("charLoader").addEventListener("change", upload);
    document.getElementById("libraryLoader").addEventListener("change", uploadLibrary);

    //evento di form cambio nome
    document.getElementById("name").addEventListener("click", addName);

    //evento di form cambio peculiarita'
    document.getElementById("pecName").addEventListener("click", (e)=>{editPeculiarity(e, "Nome peculiarita': ...", "pecName")});
    document.getElementById("pecDesc").addEventListener("click", (e)=>{editPeculiarity(e, "Descrizione: ...", "pecDesc")});
	
    //evento di form cambio potere Zero
    document.getElementById("zeroClock").appendChild(zeroPowerClock())
    document.getElementById("zeroName").addEventListener("click", (e)=>{editZeroPower(e, "Nome potere: ...", "zeroName")});
    document.getElementById("zeroTrigger").addEventListener("click", (e)=>{editZeroPower(e, "Innesco: ...", "zeroTrigger")});
    document.getElementById("zeroEffect").addEventListener("click", (e)=>{editZeroPower(e, "Effetto: ...", "zeroEffect")});
	
    //evento di form modificatori combat
    document.getElementById("rollForInitiative").addEventListener("click", 
		(e)=>{
			showPopup(e)
			document.getElementById("pz1").value="des"
			document.getElementById("pz2").value="int"
			document.getElementById("pz3").value=calculateInitiative(characterInfo)
		}
	);
	
    document.getElementById("initiative").addEventListener("dblclick", addInitMod);
    document.getElementById("defense").addEventListener("dblclick", addPDefMod);
    document.getElementById("magDefense").addEventListener("dblclick", addMDefMod);

    //evento di form modificatori punti inventario
    document.getElementById("ip_max").addEventListener("click", addIpMod);

    //eventi gestione classi PG
    document.getElementById("addNewClass").addEventListener("click", addClass);
	document.getElementById("addNewClass").style.width="100%";
	let classAdder=fetchSvgIcon("plus")
	classAdder.style.margin="auto";
    document.getElementById("addNewClass").appendChild(classAdder);

    //eventi per le statistiche: ad ognuna si assegnano eventi che modificano in modo appropriato i corrispondenti valori memorizzati in
    //characterInfo
    function updateStat(e) {
        let trgt = e.target.statParam;
        if (trgt[1] == "base") {
			/*let newBaseValue=Number(e.target.value)
			
			e.target.value=characterInfo[trgt[0]].base
			let baseIdx=e.target.selectedIndex
			e.target.value=characterInfo[trgt[0]].temp
			let tempIdx=e.target.selectedIndex
			e.target.value=newBaseValue*/
			
			let baseIdx=Array.from(e.target.children).indexOf(e.target.querySelectorAll("[value='"+characterInfo[trgt[0]].base+"'")[0]);
			let tempIdx=Array.from(e.target.children).indexOf(e.target.querySelectorAll("[value='"+characterInfo[trgt[0]].temp+"'")[0]);
			
			characterInfo[trgt[0]].temp=e.target[Math.min(e.target.children.length-1, Math.max(0, e.target.selectedIndex-(baseIdx-tempIdx)))].value
			
            //characterInfo[trgt[0]].temp = Math.max(Math.min(characterInfo[trgt[0]].temp + (Number(e.target.value) - characterInfo[trgt[0]].base), 20), 6);
        }
        characterInfo[trgt[0]][trgt[1]] = Number(e.target.value);
        updateSheet();
    }

    let stats = ["des", "int", "vig", "vol"];

    stats.forEach(function(stat) {
        //si assume che l'ID degli elementi input contenenti il valore della statistica siano sempre nel formato "base/temp" + nome 
        //stat con prima lettera capitale (es. "baseDes")
        let capStat = stat.charAt(0).toUpperCase() + stat.slice(1)
        document.getElementById("base" + capStat).statParam = [stat, "base"];
        document.getElementById("temp" + capStat).statParam = [stat, "temp"];
        document.getElementById("base" + capStat).addEventListener("change", updateStat);
        document.getElementById("temp" + capStat).addEventListener("change", updateStat);
    });

    //eventi per la gestione degli status
    //evento che si attiva con l'evento change degli elementi checkbox degli status
    function updateStatus(e) {
        characterInfo.status[e.target.id] = e.target.checked; //si assume che la checkbox abbia un ID e che sia uguale al nome dell'omonimo status
        updateSheet();
    }

    document.getElementById("slow").addEventListener("change", updateStatus);
    document.getElementById("confused").addEventListener("change", updateStatus);
    document.getElementById("weak").addEventListener("change", updateStatus);
    document.getElementById("shaken").addEventListener("change", updateStatus);
    document.getElementById("enraged").addEventListener("change", updateStatus);
    document.getElementById("poisoned").addEventListener("change", updateStatus);

    //eventi tratti: al click dell'elemento contenente il nome, si attiva addTrait per modificare il valore, nel caso
    document.getElementById("identity").addEventListener("click", addTrait);
    document.getElementById("theme").addEventListener("click", addTrait);
    document.getElementById("origin").addEventListener("click", addTrait);

    //evento legami: per aggiungere un nuovo legame vuoto
    document.getElementById("addNewBond").addEventListener("click", addBond);
    document.getElementById("addNewBond").appendChild(fetchSvgIcon("plus"));
	
	//eventi slot equip: si indicano la lista di oggetti equipaggiabili nello slot su cui si � cliccato il menu contestuale
	document.getElementById("mainHand").addEventListener("contextmenu", 
		function(e){
			buildItemContextList("mainHand")
			buildContextMenu(document.getElementById("mainHand"), [e.clientX, e.clientY], {directEquip:true});
			e.preventDefault(e);
		}
	);
	document.getElementById("secondaryHand").addEventListener("contextmenu", 
		function(e){
			buildItemContextList("secondaryHand")
			buildContextMenu(document.getElementById("secondaryHand"), [e.clientX, e.clientY], {directEquip:true});
			e.preventDefault(e);
		}
	);
	document.getElementById("armor").addEventListener("contextmenu", 
		function(e){
			buildItemContextList("armor")
			buildContextMenu(document.getElementById("armor"), [e.clientX, e.clientY], {directEquip:true});
			e.preventDefault(e);
		}
	);
	document.getElementById("accessory").addEventListener("contextmenu", 
		function(e){
			buildItemContextList("accessory")
			buildContextMenu(document.getElementById("accessory"), [e.clientX, e.clientY], {directEquip:true});
			e.preventDefault(e);
		}
	);
	document.getElementById("bonusAccessory").addEventListener("contextmenu", 
		function(e){
			buildItemContextList("bonusAccessory")
			buildContextMenu(document.getElementById("bonusAccessory"), [e.clientX, e.clientY], {directEquip:true});
			e.preventDefault(e);
		}
	);

    //eventi equipaggiamento: si settano gli eventi che attivano le azioni per la ricezione degli oggetti draggati qui dall'inventario
    document.getElementById("mainHand").addEventListener("dragover", allowDrop);
    document.getElementById("secondaryHand").addEventListener("dragover", allowDrop);
    document.getElementById("armor").addEventListener("dragover", allowDrop);
    document.getElementById("accessory").addEventListener("dragover", allowDrop);
    document.getElementById("bonusAccessory").addEventListener("dragover", allowDrop);

    document.getElementById("mainHand").addEventListener("drop", function(e) { equip(this.id); });
    document.getElementById("secondaryHand").addEventListener("drop", function(e) { equip(this.id); });
    document.getElementById("armor").addEventListener("drop", function(e) { equip(this.id); });
    document.getElementById("accessory").addEventListener("drop", function(e) { equip(this.id); });
    document.getElementById("bonusAccessory").addEventListener("drop", function(e) { equip(this.id); });

    //si associa alla proprieta' "ref" lo slot equipaggiamento da ripulire con la funzione "unequip", che viene letto da questa come parametro
    document.getElementById("removeMain").appendChild(fetchSvgIcon("trash"));
    document.getElementById("removeSecondary").appendChild(fetchSvgIcon("trash"));
    document.getElementById("removeArmor").appendChild(fetchSvgIcon("trash"));
    document.getElementById("removeAccessory").appendChild(fetchSvgIcon("trash"));
    document.getElementById("removeBonusAccessory").appendChild(fetchSvgIcon("trash"));

    document.getElementById("removeMain").firstChild.slot = "main";
    document.getElementById("removeSecondary").firstChild.slot = "secondary";
    document.getElementById("removeArmor").firstChild.slot = "armor";
    document.getElementById("removeAccessory").firstChild.slot = "accessory";
    document.getElementById("removeBonusAccessory").firstChild.slot = "bonusAccessory";

    document.getElementById("removeMain").firstChild.addEventListener("click", unequip);
    document.getElementById("removeSecondary").firstChild.addEventListener("click", unequip);
    document.getElementById("removeArmor").firstChild.addEventListener("click", unequip);
    document.getElementById("removeAccessory").firstChild.addEventListener("click", unequip);
    document.getElementById("removeBonusAccessory").firstChild.addEventListener("click", unequip);

    //eventi per l'header di inventario
    document.getElementById("addInvContainer").addEventListener("click", function(e) { addInventoryContainer() });
    document.getElementById("addInvContainer").prepend(fetchSvgIcon("plus"));

    //evento per aggiungere le note
    document.getElementById("addNote").addEventListener("click", function(e) { addNewNote() });

    //evento su icona Punti Inventario: mostra con un popup l'elenco di oggetti che di default possono essere comprati con PI
    document.getElementById("ipIcon").appendChild(fetchSvgIcon("briefcase"));
    document.getElementById("ipIcon").firstChild.popupContent =
        "<div>" +
        "Elisir [3 PI]: Una creatura recupera 50 Punti Mente.<br>" +
        "Rimedio [3 PI]: Una creatura recupera 50 Punti Vita.<br>" +
        "Tonico [2 PI]: Una creatura guarisce da uno status.<br>" +
        "Scheggia Elementale [2 PI]: Una creatura subisce 10 danni da (scegliere tra: aria, fulmine, fuoco, ghiaccio, terra).<br>" +
        "Tenda Magica [4 PI]: Permette al gruppo di riposare nelle terre selvagge.<br>" +
        "</div>";
    document.getElementById("ipIcon").firstChild.addEventListener("click", showPopup);
    document.getElementById("znIcon").appendChild(fetchSvgIcon("coins"));

    //eventi punti e punteggi: si modificano i punti vita, mente, fabula e i soldi. La funzione usata assume che l'elemento che attiva
    //l'evento abbia un ID con lo stesso nome del punteggio omonimo

    //si creano i tracker stilosi, qualora non siano gia' stati creati
    if (!document.getElementById("fabula")) {
        document.getElementById("scores").appendChild(createTracker("fabula"));
    }
    if (!document.getElementById("hp")) {
        document.getElementById("scores").appendChild(createTracker("hp"));
    }
    if (!document.getElementById("mp")) {
        document.getElementById("scores").appendChild(createTracker("mp"));
    }
	
    document.getElementById("ip").addEventListener("change", ()=>{updateScore(characterInfo.ip, document.getElementById("ip").value); updateSheet()});
    document.getElementById("zenit").addEventListener("change", ()=>{updateScore(characterInfo.zenit, document.getElementById("zenit").value); updateSheet()});

    //le icone accanto ai PV e PM, se cliccate, rifullano il rispettivo punteggio del PG
    document.getElementById("book").addEventListener("click", function() {
        characterInfo.fabula.current++;
        document.getElementById("fabula").value = characterInfo.fabula.current;
    });
}

//restituisce una struttura per tirare dadi in chat
function createRoller(params={}){
	let rollerContent=document.createElement("div");
	rollerContent.id="rollerPopup"
	
	let pz1=document.createElement("select")
	let pz2=document.createElement("select")
	let pz3=document.createElement("input")
	
	pz1.id="pz1"
	pz2.id="pz2"
	pz3.id="pz3"
	
	pz1.innerHTML=
		"<option value='6'>d6</option>   \
		<option value='8'>d8</option>   \
		<option value='10'>d10</option>   \
		<option value='12'>d12</option>	\
		<option value='20'>d20</option>"
	
	if(typeof params.type!=undefined){
		if(params.type=="stats"){
			pz1.innerHTML=
				"<option value='des'>DES</option>   \
				<option value='int'>INT</option>   \
				<option value='vig'>VIG</option>   \
				<option value='vol'>VOL</option>"
		}
	}
		
	pz2.innerHTML=pz1.innerHTML
	
	pz3.type="number"
	
	rollerContent.appendChild(pz1)
	rollerContent.appendChild(pz2)
	rollerContent.appendChild(pz3)

	let buttonForChat=document.createElement("button");
	buttonForChat.innerHTML="Tira";
	buttonForChat.addEventListener("click", 
		function(e){
			waitForCallback=3
			document.getElementById("rollResult").innerHTML=""
			
			let v1=document.getElementById("pz1").value
			let v2=document.getElementById("pz2").value
			let v3=document.getElementById("pz3").value
			
			if(typeof params.type!=undefined){
				if(params.type=="stats"){
					v1=getTotalEffectiveStat(document.getElementById("pz1").value)
					v2=getTotalEffectiveStat(document.getElementById("pz2").value)
				}
			}
			
			sendInChat("/r 1d"+v1+"+1d"+v2+(v3>=0 && v3!=""?"+":"")+v3)
		}
	);
	rollerContent.appendChild(buttonForChat)
	
	return rollerContent
}

//funzione che mostra il popup (se nascosto) e ne cambia la posizione per riflettere il punto in cui � stato cliccato il mouse. Il
//contenuto del popup dipende dalla proprieta' "popupContent" dell'elemento cliccato a cui l'evento � associato
function showPopup(e) {
    if(e.target.hasOwnProperty("popupContent")){
        let popup = document.getElementById("popup");  
		document.getElementById("popupContent").innerHTML="";

        if(e.target.popupContent instanceof HTMLElement){
            document.getElementById("popupContent").appendChild(e.target.popupContent);
        } else {
            document.getElementById("popupContent").innerHTML = (e.target.popupContent ? e.target.popupContent : "Niente");
        }

        popup.style.display = "block";

        let elContainer=null;
        if(document.getElementById("FUToolkit")){
            elContainer=document.getElementById("FUToolkit");
        } else {
            elContainer=document.body;
        }
        
        let coords=[
            e.target.x?e.target.x:e.clientX + e.offsetX + (document.getElementById("floatingtoolbar")?elContainer.scrollLeft:0),
            e.target.y?e.target.y:e.clientY + e.offsetY + (document.getElementById("floatingtoolbar")?elContainer.scrollTop:0)
        ]

        popup.style.top="30%";
        popup.style.height="auto";
        popup.style.width="fit-content";
        popup.style.minWidth="auto";
        setModal("popup");
    }
}

function turnOffPopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("sheetWrapper").removeEventListener("click", assignContainer);
}

//come createInput, ma solo per testo
function createTextInput(callback, callbackOnEsc) {
    return createInput(callback, callbackOnEsc, "text");
}

//si setta l'input e l'icona per consentire la modifica di un qualsiasi valore in base al parametro fornito, indicando una funzione da eseguire con l'interazione
function createInput(callback, callbackOnEsc, type) {
    let newInput = document.createElement("input");
    newInput.type = type;
    newInput.setAttribute("newInput", true)
	
    //evento per confermare il testo senza cliccare l'icona
    newInput.addEventListener("keydown", function(f) {
        if (f.code == "Enter" || f.code == "NumpadEnter" || f.code == "Tab" || f.keyCode === 13) { 
			//si attiva solo se viene premuto uno dei tasti invio o tab
			document.activeElement.blur();
		} else if (f.code == "Escape") { callbackOnEsc(); }
    });
	
    //evento per confermare il testo se si esce dall'input
    newInput.addEventListener("blur", function(f) {
		callback(f)
    });
	
	//ripulisce il contenuto se vi si clicca dentro; controlla la presenza della proprietà "new" (VA RIMOSSA SE L'INPUT VIENE POPOLATO SUCCESSIVAMENTE CON UN VALORE ESISTENTE - DA ATTIVARE SOLO CON INPUT NUOVO/DI DEFAULT
    newInput.addEventListener("click", function(e){
		if(newInput.getAttribute("newInput")){
			newInput.value="";
			newInput.removeAttribute("newInput")
		}
	});

    let confirmButton = fetchSvgIcon("check");
    confirmButton.addEventListener("click", callback);

    return [newInput, confirmButton];
}

//si rimpiazza temporaneamente il nome stesso nella scheda con la box di modifica
function addName(e) {
    let newBox = createTextInput(function(e) { updateName(newBox[0].value, document.getElementById("name")) }, updateSheet);
    newBox.className = "inRow";
    newBox[0].value = e.target.innerHTML;
	if(e.target.innerHTML != "..."){
		newBox[0].removeAttribute("newInput")
	}
    e.target.innerHTML = "";
    e.target.appendChild(newBox[0]);
    e.target.appendChild(newBox[1]);
}

//funzione per modificare la peculiarit�
function editPeculiarity(e, defaultTxt, attribute) {
    let newBox = createTextInput(function(e) { updateValue(newBox[0].value, document.getElementById(attribute), defaultTxt, ["peculiarity", attribute]) }, updateSheet);
    newBox.className = "inRow";
    newBox[0].value = e.target.innerHTML;
	if(e.target.innerHTML != "..."){
		newBox[0].removeAttribute("newInput")
	}
    e.target.innerHTML = "";
    e.target.appendChild(newBox[0]);
    e.target.appendChild(newBox[1]);
}

//funzione per modificare il potere zero
function editZeroPower(e, defaultTxt, attribute) {
    let newBox = createTextInput(function(e) { updateValue(newBox[0].value, document.getElementById(attribute), defaultTxt, ["zeroPower", attribute]) }, updateSheet);
    newBox.className = "inRow";
    newBox[0].value = e.target.innerHTML;
	if(e.target.innerHTML != "..."){
		newBox[0].removeAttribute("newInput")
	}
    e.target.innerHTML = "";
    e.target.appendChild(newBox[0]);
    e.target.appendChild(newBox[1]);
}

function updateValue(newValue, targetEl, defaultValue="...", path=[]) {
    //check: se il nome � nullo o composto da spazi, si sostituisce con "..."
    if (newValue.trim() == "") {
        newValue = defaultValue;
    }
	
	let trg=characterInfo
	let lastStep=""
	
    //si imposta il nuovo nome nei dati PG in memoria e sulla scheda
	if(path.length>0){
		for(let i=0;i<path.length;i++){
			if(lastStep!=""){
				if(trg[lastStep]){
					trg=trg[lastStep]
				}
			}
			lastStep=path[i]
		}
		trg[lastStep] = newValue;
	}

    targetEl.innerHTML = newValue;
}

function addInitMod(e) {
    addMod(e.target, "initMod");
}

function addPDefMod(e) {
    addMod(e.target, "pDefMod");
}

function addMDefMod(e) {
    addMod(e.target, "mDefMod");
}

function addIpMod(e) {
    addMod(e.target, "ip.mod");
}

//si gestisce il modificatore manuale del parametro passato
function addMod(trg, whichStat) {
    let path = []
	
	let varToChange=null
	let lastProp=""
	
	if(typeof whichStat==="string"){
		path=whichStat.split(".")
		
		if (path.length == 1) {
			varToChange = characterInfo
			lastProp=whichStat
			
		} else {
			varToChange = characterInfo[path[0]]
			lastProp=path[1]
		}
	} else {
		varToChange = whichStat
		lastProp="mod"
	}

    let newBox = createInput(function(e) {
            varToChange[lastProp] = Number(newBox[0].value);
            trg.classList.remove("inRow");
            updateSheet()
			updateClocks()
        }, 
        updateSheet,
        "number"
    );

	newBox[0].value = varToChange[lastProp]
	newBox[0].removeAttribute("newInput")
    newBox[0].style.width = "5em";
    trg.innerHTML = "Mod.: ";
    trg.appendChild(newBox[0]);
    trg.appendChild(newBox[1]);
}

//si aggiunge una coppia di elementi temporanei per scegliere tra le classi non ancora scelte una classe da aggiungere al PG
function addClass(e) {
    let newRow = document.createElement("div");
    newRow.innerHTML = "<div>Seleziona una classe...</div>";

    let list = document.createElement("select");

    //variabile per contare quante classi non sono state ancora portate al livello massimo consentito
    let notMastered = 0

    //si itera tra tutte le classi definite all'interno della variabile "data" per popolare la combobox
    data.classes.forEach(function(className) {
        if (!characterInfo.levels[className]) { //se la classe ancora non � stata selezionata, si aggiunge alla select
            let el = document.createElement("option");
            el.value = className;
            el.innerHTML = className;
            list.appendChild(el);
        } else if (characterInfo.levels[className] < data.maxLv) { //se la classe invece � gia' stata aggiunta in passato e non ha ancora raggiunto il lv massimo consentito, si conta come non padroneggiata
            notMastered++;
        }
    });

    //se il numero totale di classi non padroneggiate � inferiore a 3, si consente di andare avanti e mostrare la select per scegliere
    //una nuova classe, altrimenti si esce (non � consentito avere piu' di tre classi non padroneggiate allo stesso tempo)
    if (notMastered < data.maxClasses) {
        let confirmButton = fetchSvgIcon("check");
        confirmButton.addEventListener("click", function(e) { populateClass(list) });

        newRow.appendChild(list);
        newRow.appendChild(confirmButton);

        document.getElementById("addNewClass").style.display = "none"; //si fa sparire temporaneamente il tasto per l'inserimento di classe, almeno finch� non viene completata la selezione in populateClass
        document.getElementById("levelDetail").appendChild(newRow);
    }
}

//Vedi funzione addName, ma per i tratti
function addTrait(e) {
    let newBox = createTextInput(function(f) { populateTrait(newBox[0], e.target) }, updateSheet);
    newBox[0].value = e.target.innerHTML;
	if(e.target.innerHTML != "..."){
		newBox[0].removeAttribute("newInput")
	}
    e.target.innerHTML = "";
    e.target.appendChild(newBox[0]);
    e.target.appendChild(newBox[1]);
}

//Vedi funzione addName, ma per i legami
function addBond(e) {
    let toBeId = "bond_" + characterInfo.bonds.length;
    if (!document.getElementById(toBeId)) {
        let newRow = document.createElement("div");
        let newBox = createTextInput(function(e) { populateBond(newBox[0], newRow) }, updateSheet);
        newBox[0].value = "Inserisci un nome...";
        newBox[0].id = toBeId;
        newBox[0].bondRef = toBeId;
        newBox[1].bondRef = toBeId;

        newRow.appendChild(newBox[0]);
        newRow.appendChild(newBox[1]);

        document.getElementById("bondsList").appendChild(newRow);
    }
}

//crea la lista completa nel compendio degli oggetti nella variabile "data", usando buildItem per mostrarli in modo strutturato 
function addItem() {
    let itemContainers = {};
    let targetContainer = null;
    let fullItemList = document.createElement("div");
    fullItemList.className = "inColumn";
    fullItemList.style.width = "100%";

    //si iterano tutti gli oggetti in "data" e si crea una lista per consentire la selezione degli oggetti da aggiungere all'inventario
    data.items.forEach(function(sourceEl) {
        //si clona l'oggetto per generare una copia da gestire nell'inventario
        let el = JSON.parse(JSON.stringify(sourceEl));

        //si definisce la testata rappresentante la categoria oggetto sotto la quale l'oggetto va messo, creandola se non esiste
        if (!itemContainers.hasOwnProperty(el.CATEGORIA)) { //se skillContainers non contiene gia' la classe dell'abilita' esaminata, si crea un nuovo raggruppamento sotto cui appendere le finestre abilita' strutturate
            itemContainers[el.CATEGORIA] = createItemHeader(el.CATEGORIA);
            fullItemList.appendChild(itemContainers[el.CATEGORIA]); //si appende la testata classe nella lista in creazione
        }
        targetContainer = itemContainers[el.CATEGORIA];

        let newEntry = document.createElement("div");
        newEntry.className = "inRow";

        //si crea l'icona per inserire l'oggetto in inventario (alternativa al doppio click)
        let confirmButton = fetchSvgIcon("angle-right");
        confirmButton.style.fontSize = "x-large";
        confirmButton.title = "Aggiungi alla scheda";

        //si appende l'oggetto strutturato al div
        let it = buildItem(el);
        it.style.width = "100%";
        newEntry.appendChild(it);

        //si assegnano a newEntry degli attributi tag da usare poi con i filtri
        newEntry.setAttribute("RARITA", el.RARITA);
        newEntry.setAttribute("RAGGIO", el.RAGGIO);
        newEntry.setAttribute("NOME", el.NOME);
        newEntry.setAttribute("CATEGORIA", el.CATEGORIA);
        newEntry.setAttribute("MARZIALE", el.MARZIALE);
        newEntry.setAttribute("TIPO_DANNO", el.TIPO_DANNO);
        newEntry.setAttribute("MANI", el.MANI);

        //si assegna il parametro per far funzionare il caricamento in inventario (si indica l'oggetto da popolare)
        newEntry.passedItem = el;
        confirmButton.passedItem = el;

        //funzione per caricare l'oggetto in inventario
        function pushItem(e) {
            characterInfo.inventory.push(this.passedItem);
            populateItem(this.passedItem);
            resetModalContent();
        }

        //eventi per la popolazione in inventario
        newEntry.addEventListener("dblclick", pushItem);
        confirmButton.addEventListener("click", pushItem);

        //si compila la lista, passo passo
        newEntry.appendChild(confirmButton);
        targetContainer.appendChild(newEntry);
    })

    document.getElementById("availableItems").appendChild(fullItemList);
}

//crea nel compendio una lista di abilita' che il personaggio puo' selezionare in base alle sue caratteristiche, classi e abilita' esistenti
function addSkill() {
    let skillContainers = {};
    let targetContainer = null;
    //si itera per ogni classe del PG le abilita' nella variabile "data" riferite a quella classe
    if (Object.keys(characterInfo.levels).length > 0) {
        let fullSkillList = document.createElement("div");
        fullSkillList.className = "inColumn";
        fullSkillList.style.width = "100%";

        //si contano tutte le abilita' eroiche gia' aggiunte al personaggio e le classi che sono state padroneggiate (sono di lv 10)
        let countMasteries = 0;
        let denyHeroics = false;
        Object.keys(characterInfo.levels).forEach(function(cls) {
            if (characterInfo.levels[cls] == data.maxLv) {
                countMasteries++;
            }
        });

        characterInfo.skills.forEach(function(skl) {
            if (skl.TIPO == "Eroica") {
                countMasteries--;
            }
        });

        //se le classi di livello massimo sono piu' delle abilita' eroiche gia' selezionate, allora si consentono a queste ultime di apparire
        if (countMasteries <= 0) {
            denyHeroics = true;
        }

        //si cicla su tutte le skill esistenti in memoria per stilare la lista di abilita' accessibili al personaggio, in base ai requisiti delle stesse e alle caratteristiche del personaggio
        data.abilities.forEach(function(el) {
            let skip = false;
            el = JSON.parse(JSON.stringify(el)); //si clona l'oggetto per poterlo poi modificare senza impattare il dato originale

            //check sul livello attuale dell'abilita' vs il livello massimo che puo' avere - se � gia' al massimo, non viene visualizzata
            if (hasAbility(characterInfo, el.NOME)) {
                let skillIndex = hasAbility(characterInfo, el.NOME);

                if (Number(characterInfo.skills[skillIndex].MAX_LA) <= Number(characterInfo.skills[skillIndex].LA)) {
                    skip = true;
                }
            }

            //check sul numero di abilita' possedute che gia' insistono su quel requisito. Se gia' si hanno sufficienti abilita' che richiedono quel requisito, si salta
            let reqSklIndex = hasAbility(characterInfo, el.REQUISITI);
            if (reqSklIndex && !skip && Number(characterInfo.skills[reqSklIndex].MAX_LA) > 1) { //si assume che TUTTE le abilita' con MAX_LA>1 debbano essere prese piu' volte per sbloccare incantesimi aggiuntivi
                let boundedSkillsNbr = 0;

                for (let i = 0; i < characterInfo.skills.length; i++) {
                    if (characterInfo.skills[i].REQUISITI == el.REQUISITI) {
                        boundedSkillsNbr+=characterInfo.skills[i].LA*characterInfo.skills[i].SUBTIPO;
                    }
                }

                if (boundedSkillsNbr >= Number(characterInfo.skills[reqSklIndex].LA) + (hasAbility(characterInfo, "INCANTESIMI AGGIUNTIVI (" + (el.CLASSE.toUpperCase()) + ")") ? 2 : 0)) {
                    skip = true;
                }
            }

            //per abilita' ed incantesimi si controlla che il personaggio abbia livelli nella loro classe, mentre per abilita' eroiche si verifica la condizione definita prima del loop
            if (!skip) {
                if (el.TIPO == "Abilita'" && hasLevels(characterInfo, el.CLASSE)) {
                    if (el.REQUISITI != "") {
                        if (!hasAbility(characterInfo, el.REQUISITI)) {
                            skip = true;
                        }
                    }
                } else if (el.TIPO == "Incantesimo" && (hasLevels(characterInfo, el.CLASSE) || hasAbility(characterInfo, "INCANTESIMI AGGIUNTIVI (" + (el.CLASSE.toUpperCase()) + ")")) || (hasAbility(characterInfo, "COMETA") && el.REQUISITI == "COMETA") || (hasAbility(characterInfo, "VULCANO") && el.REQUISITI == "VULCANO")) {
                    let count = 0;

                    if (hasAbility(characterInfo, el.REQUISITI)) {
                        count += hasAbility(characterInfo, el.REQUISITI).LA;
                    }

                    if (hasAbility(characterInfo, "INCANTESIMI AGGIUNTIVI (" + (el.CLASSE.toUpperCase()) + ")")) {
                        count = count + 2;
                    }

                    if (characterInfo.skills.filter(skl => skl.REQUISITI == el.REQUISITI).length >= count) {
                        skip = true;
                    }

                } else if (el.TIPO == "Eroica" && (hasLevels(characterInfo, el.CLASSE)==data.maxLv || el.CLASSE=="")) {
                    if (denyHeroics)
                        skip = true;
                } else {
                    skip = true;
                }
            }

            //se non � stato trovato motivo di skip, allora si aggiunge nella lista l'abilita' esaminata
            if (!skip) {
                //si definisce la testata rappresentante la classe sotto la quale l'abilita' va messa, creandola se non esiste
                if (!skillContainers.hasOwnProperty(el.CLASSE)) { //se skillContainers non contiene gia' la classe dell'abilita' esaminata, si crea un nuovo raggruppamento sotto cui appendere le finestre abilita' strutturate
                    skillContainers[el.CLASSE] = createClassHeader(el.CLASSE);
                    fullSkillList.appendChild(skillContainers[el.CLASSE]); //si appende la testata classe nella lista in creazione
                }
                targetContainer = skillContainers[el.CLASSE];

                let newEntry = document.createElement("div");
                newEntry.className = "inRow";

                //si crea l'icona per inserire l'oggetto in inventario (alternativa al doppio click)
                let confirmButton = fetchSvgIcon("angle-right");
                confirmButton.title = "Aggiungi alla scheda";

                let abl = buildAbility(el);
                abl.style.width = "100%";
                newEntry.appendChild(abl);

                newEntry.passedSkill = el;
                confirmButton.passedSkill = el;

                //funzione per caricare l'abilita'
                function pushSkill(e) {
                    let check = hasAbility(characterInfo, this.passedSkill.NOME);
                    if (check) {
                        if (characterInfo.skills[check].LA < Number(characterInfo.skills[check].MAX_LA)) {
                            characterInfo.skills[check].LA++;
                        }
                    } else {
                        this.passedSkill.LA = 1;
                        characterInfo.skills.push(this.passedSkill);
                    }
                    updateSheet();
                    resetModalContent();
                }

                newEntry.addEventListener("dblclick", pushSkill);
                confirmButton.addEventListener("click", pushSkill);

                newEntry.appendChild(confirmButton);
                targetContainer.appendChild(newEntry);
            }
        })

        if (fullSkillList.innerHTML != "") {
            document.getElementById("availableAbilities").appendChild(fullSkillList);
        }
    } else {
        document.getElementById("availableAbilities").innerHTML = "<i style='margin:1em;'>Aggiungi una classe al personaggio per selezionare le abilita'.</i>";
    }
}

//crea nel compendio una lista di wiki entries, come memo di regole o altro (definito in libreria)
function addWiki(){
	if(data.wiki.length>0){
		//si iterano tutti gli oggetti in "data" e si crea una lista per consentire la selezione degli oggetti da aggiungere all'inventario
		data.wiki.forEach(function(sourceEl) {
			let newEntry=document.createElement("div")
			let title=document.createElement("div")
			let content=document.createElement("div")
			
			newEntry.style.margin="0 0 0.5em 0"
			newEntry.style.filter="brightness(0.9) grayscale(1)"
			
			title.className="compendiumHeader"
			title.style.fontSize="large"
			title.style.fontWeight="bold"
			title.style.fontStyle="italic"
			
			title.innerHTML=sourceEl.NOME
			title.appendChild(expandIcon(true, content))
			
			content.innerHTML=sourceEl.DESCRIZIONE
			content.style.display="none"
			content.style.padding="0.5em"
			content.style.textAlign="left"
			content.className="infoBlock"
			
			newEntry.appendChild(title)
			newEntry.appendChild(content)
			document.getElementById("wikiEntries").appendChild(newEntry)
		})
		
		document.getElementById("wikiEntries").parentNode.style.removeProperty("display")
	} else {
		document.getElementById("wikiEntries").parentNode.style.display="none"
	}
}

//funzione per l'aggiornamento del nome PG (questo nome viene anche usato come chiave univoca per salvare su IndexedDB i dati PG)
function updateName(newName, targetEl) {
	updateValue(newName, targetEl, "...", ["name"])
}

//una volta selezionata la classe desiderata, si crea l'elemento in scheda e si inserisce all'interno dei dati PG in memoria.
//Questa funzione viene usata anche da updateSheet per popolare la scheda con i dati PG in memoria
function populateClass(cls = null) {
    let selectedClass = null;

    //se la funzione � stata invocata da evento, allora si inizializza nei dati in memoria i dati della classe e dei benefici correlati
    if (cls instanceof HTMLElement) {
        selectedClass = cls.value;
        //se la classe viene creata per la prima volta e non popolata da memoria - quindi � originata da evento
        if (!characterInfo.levels[selectedClass]) {
            characterInfo.levels[selectedClass] = 1;

            //aggiunge le abilita' "beneficio" di base della classe appena aggiunta ai dati del PG in memoria
            let baseSkill = null;
            for (let i = 0; i < data.abilities.length; i++) {
                if (selectedClass == data.abilities[i].CLASSE && data.abilities[i].TIPO == "Beneficio") {
                    baseSkill = data.abilities[i];
                    break;
                }
            }

            //se non ha il beneficio tra le abilita', lo si aggiunge
            if (!hasAbility(characterInfo, baseSkill.NOME)) {
                characterInfo.skills.push(baseSkill);
            }
        }
        updateSheet(); //si lancia l'aggiornamento per popolare la scheda
    } else { //la classe scelta � gia' settata in memoria, quindi viene popolata la scheda con gli elementi corrispondenti
        selectedClass = cls.name;

        let newClass = document.createElement("div");
        newClass.className = "classDetail";

        //si aggiunge l'icona della classe
        newClass.appendChild(fetchClassIcon(selectedClass));

        //header col nome della classe
        let classHeader = document.createElement("span");
        classHeader.innerHTML = selectedClass
        newClass.appendChild(classHeader);

        //indicatore del livello della classe, per gestire il livello su scheda e in memoria
        let newInput = document.createElement("input");
        newInput.id = selectedClass + "Lvl";
        newInput.type = "number";
        newInput.min = 1;
        newInput.max = data.maxLv;
        newInput.value = cls.value;

        //quando il valore del livello di classe viene cambiato, un evento viene attivato per modificarlo in memoria (e riaggiornare la scheda)
        newInput.refClass = selectedClass;
        newInput.addEventListener("change", function(f) {
            characterInfo.levels[f.target.refClass] = Number(f.target.value);
            updateSheet();
        });
        newClass.appendChild(newInput);

        //creazione del tasto di rimozione della classe
        let removalButton = fetchSvgIcon("times");
        removalButton.refClass = selectedClass;
        removalButton.addEventListener("click", removeClass);

        newClass.appendChild(removalButton);
        document.getElementById("levelDetail").appendChild(newClass);
        document.getElementById("addNewClass").style.removeProperty("display");
    }
}

function removeClass(ev, cls = ev.target.refClass) {
    delete characterInfo.levels[cls];

    //rimuove tutte le abilita' legate alla classe appena rimossa. Non si usa un forEach per poter fare lo splice in modo piu' controllato
    for (let i = 0; i < characterInfo.skills.length; i++) {
        if (characterInfo.skills[i].CLASSE == cls) {
            characterInfo.skills.splice(i, 1);
            i--;
        }
    }

    //si lancia l'update della scheda, in modo da rimuovere anche dalla visualizzazione la classe appena rimossa
    updateSheet();
}

//aggiunge il tratto alla scheda senza passare da updateSheet, per fare piu' velocemente ed essere piu' leggero
function populateTrait(traitContainer, targetEl) {
    let traitValue = null;

    //se la chiamata viene da un evento ok, senno' si salta
    if (traitContainer instanceof HTMLElement) {
        traitValue = traitContainer.value;
    } else {
        return;
    }

    //si carica il valore inserito in memoria, e si rimpiazza la box di inserimento con il valore appena inserito
    characterInfo.traits[targetEl.id] = traitValue;
    targetEl.innerHTML = (traitValue.trim() == "" ? "..." : traitValue);
}

//questa funzione inserisce il legame in scheda, con delle combobox ad indicare la natura dei tre potenziali sentimenti
function populateBond(bondContainer, tokenRow = null) {
    let bondName = null;
    let bondRef = null;

    if (bondContainer instanceof HTMLElement) {
        bondName = bondContainer.value;
        bondRef = bondContainer.bondRef;
    } else {
        bondName = bondContainer.name;
        bondRef = "bond_" + bondContainer.index;
    }

    //se il nome del legame non � vuoto o composto da spazi, si crea il legame in scheda
    if (bondName.trim() != "") {
        let newBond = document.createElement("div");
        newBond.className = "inRow";
		
		let bondStrength=0
		
		if(characterInfo.bonds[bondContainer.index]){
			bondStrength=characterInfo.bonds[bondContainer.index].feelings.filter(b=>b!=0).length
		}
		
        newBond.innerHTML = "<div>" + bondName + (bondStrength>0?" ["+bondStrength+"]":"") + "</div>"

        //questa funzione generale viene declinata sulle tre serie di possibili sentimenti da collegare al legame
        function createCombo(e, idx, tags) { //e serve a passare il legame di riferimento (usato dagli eventi di change), idx indica l'indice del sentimento nel legame e tags indica i valori del sentimento
            let newSelect = document.createElement("select");
            newSelect.id = bondRef + "_" + idx;

            //si costruiscono le tre opzioni
            let opt0 = document.createElement("option");
            let opt1 = document.createElement("option");
            let opt2 = document.createElement("option");
            opt0.value = 0;
            opt1.value = 1;
            opt2.value = 2;
            opt0.text = tags[0];
            opt1.text = tags[1];
            opt2.text = tags[2];
            newSelect.appendChild(opt0);
            newSelect.appendChild(opt1);
            newSelect.appendChild(opt2);

            //evento che aggiorna i dati PG in memoria se la select viene modificata
            newSelect.addEventListener("change", function(f) {
                let path = f.target.id.split("_")
                characterInfo.bonds[path[1]].feelings[path[2]] = Number(f.target.value);
				updateSheet()
            });

            //se esistono dei valori preesistenti, la select assume quel valore (usato da updateSheet)
            if (bondContainer.feelings) {
                newSelect.selectedIndex = bondContainer.feelings[idx];
            }
            return newSelect;
        }

        //si popolano i tre possibili sentimenti non le reciproche varianti
        newBond.appendChild(createCombo(bondContainer, 0, ["", "Ammirazione", "Inferiorita'"]));
        newBond.appendChild(createCombo(bondContainer, 1, ["", "Lealta'", "Sfiducia"]));
        newBond.appendChild(createCombo(bondContainer, 2, ["", "Affetto", "Odio"]));

        let removalButton = fetchSvgIcon("times");
        removalButton.bondRef = bondRef;
        removalButton.addEventListener("click", function(f) {
            newBond.parentNode.removeChild(newBond);
            delete characterInfo.bonds[Number(f.target.bondRef.substr(5))];
        });

        newBond.appendChild(removalButton);

        //se non esistono sentimenti collegati,vuol dire che � un legame nuovo: pertanto, si inizializzano i valori e si caricano nel PG in memoria
        if (!bondContainer.feelings) {
            let bondObject = {
                name: bondName,
                feelings: [0, 0, 0]
            };

            characterInfo.bonds[Number(bondRef.substr(5))] = bondObject;
        }

        if (tokenRow) {
            tokenRow.innerHTML = ""
        }
        document.getElementById("bondsList").appendChild(newBond);
    }
}

//manda del testo nella chat di Roll20, se aperto in Roll20
function sendInChat(txt=""){
    let chatBox=document.getElementById("textchat-input");
	
	if(txt==""){
		if(document.querySelectorAll("[lastDragged]")[0].textForChat){
			txt=document.querySelectorAll("[lastDragged]")[0].textForChat.value;
		} else {
			txt=document.querySelectorAll("[lastDragged]")[0].querySelectorAll("[class='infoBlock']")[0].textForChat.value;
		}
	}

    if(chatBox){
        chatBox.querySelectorAll("[title='Text Chat Input']")[0].value=txt;
        chatBox.querySelectorAll(".btn")[0].click();
    } else {
        return sendMessage(txt)
    }
	
	return null
}

//funzione per costruire il menu contestuale
function buildContextMenu(caller, coords, whatToShow={}){
    let isSomethingVisible=false;

    if(whatToShow.hasOwnProperty("equipButton")){
        document.getElementById("contextMenu").querySelectorAll("[equipButton]").forEach(function(btn) {
			btn.style.removeProperty("display")
            isSomethingVisible=true;
        });
    } else {
        document.getElementById("contextMenu").querySelectorAll("[equipButton]").forEach(function(btn) {
            btn.style.display="none";
        });
    }
    
    if(whatToShow.hasOwnProperty("invManage")){
        document.getElementById("contextMenu").querySelectorAll("[invManage]").forEach(function(btn) {
            btn.style.removeProperty("display")
            isSomethingVisible=true;
        });
    } else {
        document.getElementById("contextMenu").querySelectorAll("[invManage]").forEach(function(btn) {
            btn.style.display="none";
        });
    }
    
    if(whatToShow.hasOwnProperty("directEquip")){
        document.getElementById("contextMenu").querySelectorAll("[directEquip]").forEach(function(btn) {
            btn.style.removeProperty("display")
            isSomethingVisible=true;
        });
    } else {
        document.getElementById("contextMenu").querySelectorAll("[directEquip]").forEach(function(btn) {
            btn.style.display="none";
        });
    }

    if(whatToShow.hasOwnProperty("containerMng")){
        document.getElementById("contextMenu").querySelectorAll("[containerMng]").forEach(function(btn) {
            btn.style.removeProperty("display")
            isSomethingVisible=true;
        });
    } else {
        document.getElementById("contextMenu").querySelectorAll("[containerMng]").forEach(function(btn) {
            btn.style.display="none";
        });
    }
    
    if(whatToShow.hasOwnProperty("chatInter")){
        document.getElementById("contextMenu").querySelectorAll("[chatInter]").forEach(function(btn) {
            btn.style.removeProperty("display")
            isSomethingVisible=true;
        });
    }
    
    if(!isSomethingVisible){
        return;
    } 

    setModal("contextMenu");
    caller.setAttribute("lastDragged", "x");  //deve andare dopo setModal, altrimenti viene rimosso
    let contextMenu=document.getElementById("contextMenu");

    let elContainer=null;
    if(document.getElementById("FUToolkit")){
        elContainer=document.getElementById("FUToolkit");
    } else {
        elContainer=document.body;
    }
    
    contextMenu.style.left = (coords[0] - Math.max(0, contextMenu.offsetWidth + coords[0] - elContainer.clientWidth))+"px";
    contextMenu.style.top = (coords[1] - Math.max(0, contextMenu.offsetHeight + coords[1] - elContainer.clientHeight))+"px";
}

//si crea l'oggetto oggetto e lo si aggiunge in inventario
function populateItem(item) {
    //si associa all'elemento in inventario tutti gli attributi ed eventi per abilitare il drag n drop sull'equipaggiamento
    let newEntry = document.createElement("div");
    newEntry.setAttribute("draggable", "true");
    newEntry.associatedItem = item;
    newEntry.className = "item";
    newEntry.addEventListener("dragstart", startEquip);

    newEntry.addEventListener("contextmenu", 
        function(e){
            buildContextMenu(this, [e.clientX, e.clientY], {chatInter:true, equipButton:true, invManage:true, containerMng:true});
            e.preventDefault(e);
        }
    );

    //setup tasto eliminazione oggetto dall'inventario
    let popupMenu = document.createElement("div");
    popupMenu.classList.add("popupMenu");

    let editButton = fetchSvgIcon("edit");
    editButton.classList.add("editIcon");
    editButton.refObj = item;
    editButton.addEventListener("click", function(f) {
        openEditor(f.target.refObj, editCharSheet);
        setModal("editorFU");
    });

    let removalButton = fetchSvgIcon("trash");
    removalButton.classList.add("closeIcon");
    removalButton.itemToRemove = item;
    removalButton.addEventListener("click", function(f) {
        if (window.confirm("Confermi di voler cancellare questo oggetto?")) {
            removeFromInventory(f.target.itemToRemove); //si passa l'oggetto da rimuovere alla funzione apposita
            updateSheet();
        }
    });

    //si crea la tag per segnalare se l'oggetto � eventualmente equipaggiato
    if (item.equipped) {
        let equipTag = document.createElement("span");
        equipTag.className = "equipIcon";
        equipTag.innerHTML = "E";
        newEntry.appendChild(equipTag);
    }

    newEntry.appendChild(buildItemForSheet(item));
    popupMenu.appendChild(editButton);
    popupMenu.appendChild(removalButton);
    newEntry.appendChild(popupMenu);

    //eventi per il drag n drop
    newEntry.addEventListener("dragenter", function(e) { newEntry.classList.add("onHover") })
    newEntry.addEventListener("dragleave",
        function(e) {
            if (newEntry.classList.contains("onHover")) {
                newEntry.classList.remove("onHover");
            }
        }
    );
    newEntry.addEventListener("drop", dropItem);

    document.getElementById("inventoryList").appendChild(newEntry);

    return newEntry;
}

//funzione che attiva tutti gli eventi legati al drop di un oggetto da qualche parte
function dropItem(param) {
    //spostamento nell'inventario, riordinamento
    let inv = characterInfo.inventory;
    let itemDropped = document.querySelectorAll("[lastDragged]")[0];
    let itemDroppedIndex = inv.indexOf(itemDropped.associatedItem);
    let targetEl = null;

    if(param=="before" && itemDropped.previousSibling){
        targetEl=itemDropped.previousSibling
		targetEl.parentNode.insertBefore(itemDropped, targetEl)
    } else if(param=="after" && itemDropped.nextSibling){
        targetEl=itemDropped.nextSibling;
		itemDropped.nextSibling.parentNode.insertBefore(targetEl, itemDropped)
    } else {
        targetEl=this;
    }

    let toBeIndex = inv.indexOf(targetEl.associatedItem)

    inv.splice(toBeIndex, 0, itemDropped.associatedItem);
    inv.splice(itemDroppedIndex + (toBeIndex > itemDroppedIndex ? 0 : 1), 1);

    //associazione al contenitore di riferimento
    if (itemDropped.associatedItem.container != targetEl.associatedItem.container || !itemDropped.associatedItem.container) {
        itemDropped.associatedItem.container = targetEl.associatedItem.container
    }

    itemDropped.removeAttribute("lastDragged");
}

//funzione per assegnare un contenitore ad un oggetto
function assignContainer(container, itemDropped, targetEl) {
    if (itemDropped) {
        if (itemDropped.associatedItem.container != container || !itemDropped.associatedItem.container) {
            itemDropped.removeAttribute("lastDragged");
            targetEl.appendChild(itemDropped);
            itemDropped.associatedItem.container = container
        }
    }
}

//crea un oggetto abilita' e lo inserisce in un contenitore indicato
function populateSkill(skill) {
    let targetContainer = null;

    //se la skill viene inserita in uno specifico contenitore, allora viene aggiunta li'. Altrimenti, di default viene messa in abilityList
    if (skill.targetContainer) {
        targetContainer = skill.targetContainer;
    } else {
        targetContainer = document.getElementById("abilityList");
    }

    let newEntry = buildAbilityForSheet(skill);
    newEntry.setAttribute("draggable", "true");
    newEntry.className = "ability";

    /*newEntry.addEventListener("contextmenu", 
        function(e){
            buildContextMenu(this, [e.clientX, e.clientY], {chatInter:true});
            e.preventDefault(e);
        }
    );*/
    
    //si predispone il menu popup per la skill
    let popupMenu = document.createElement("div");
    popupMenu.classList.add("popupMenu");

    //se l'abilita' non � un beneficio (che sono legati alla classe e non possono essere rimossi), si aggiunge anche l'icona per l'eliminazione della skill
    if (skill.TIPO != "Beneficio") {
        if(newEntry.refObj.LA<newEntry.refObj.MAX_LA){
            let addButton = fetchSvgIcon("plus");
            addButton.classList.add("plusIcon");
            addButton.refObj = newEntry.refObj;
            addButton.addEventListener("click", function(f) {
                newEntry.refObj.LA++;
                updateSheet();
            });
            popupMenu.appendChild(addButton);
        }

        let removalButton = null;
        
        if(newEntry.refObj.LA<=1){
            removalButton=fetchSvgIcon("trash");
            removalButton.addEventListener("click", function(f) {
                if (window.confirm("Confermi di voler cancellare questa abilita'?")) {
                    removeSkill(f.target.skillToRemove.NOME);
                    updateSheet();
                }
            });
        } else {
            removalButton=fetchSvgIcon("minus");
            removalButton.addEventListener("click", function(f) {
                removeSkill(f.target.skillToRemove.NOME);
                updateSheet();
            });
        }

        removalButton.classList.add("closeIcon");
        removalButton.skillToRemove = skill;

        popupMenu.appendChild(removalButton);
    }

    //si mette un'icona per la modifica della skill
    let editButton = fetchSvgIcon("edit");
    editButton.classList.add("editIcon");
    editButton.refObj = newEntry.refObj;
    editButton.addEventListener("click", function(f) {
        openEditor(f.target.refObj, editCharSheet);
        setModal("editorFU");
    });

    popupMenu.appendChild(editButton);
    
    newEntry.appendChild(popupMenu);
    targetContainer.appendChild(newEntry);

    return newEntry;
}

function editLibrary(editorContent){
    if(uploadEditorValues(editorContent)){
        alert("Entita' '"+editorContent.refObj.NOME+"' modificata.")
        setLibraryToBeSaved(true);
        populateEditorSelect();
    } else {
        alert("Nessuna modifica all'entita' '"+editorContent.refObj.NOME+"' rilevata.")
    }
    resetEditorMenu();
}

function resetEditorMenu(){
    document.getElementById("libraryEditor").innerHTML="<i style='margin:1em;'>Seleziona un'entita' per modificarla.</i>"
    document.getElementById("selectListToEdit").disabled = false;
    document.getElementById("listToEdit").disabled = false;
    document.getElementById("confirmObjectToEdit").innerHTML="Modifica";
}

function editCharSheet(editorContent){
    uploadEditorValues(editorContent);
    setModal();
    updateSheet();
}

//dato il nome di abilita' da rimuovere, toglie l'abilita' e tutte le altre che hanno come requisito l'abilita' rimossa, in modo ricorsivo
function removeSkill(skillName) {
    for (let i = 0; i < characterInfo.skills.length; i++) {
        //se la skill ha un livello abilita' (LA) maggiore di uno, allora l'eliminazione non avviene e si riduce invece di 1 il livello abilita'
        if (skillName === characterInfo.skills[i].NOME) {
            if (characterInfo.skills[i].LA > 1) {
                characterInfo.skills[i].LA--;
            } else {
                characterInfo.skills.splice(i, 1);

                //si controllano tutte le altre abilita' e, se � stata appena rimossa l'abilita' requisito, vengono rimosse anche queste in modo iterativo
                let j = 0;
                while (j < characterInfo.skills.length) {
                    if (skillName == characterInfo.skills[j].REQUISITI) {
                        removeSkill(characterInfo.skills[j].NOME);
                    } else {
                        j++;
                    }
                }
            }
            break;
        }
    }
}

//restituisce il livello totale del PG in base alle classi che ha
function characterLevel(chr) {
    let totLvl = 0;
    Object.keys(chr.levels).forEach(function(cls) {
        totLvl += Number(chr.levels[cls]);
    });

    return totLvl;
}

//calcola il modificatore di iniziativa, iterando tra tutti gli oggetti equipaggiati e i modificatori delle abilita' possedute
function calculateInitiative(chr) {
    let value = 0 + chr.initMod;

    //bonus da oggetti
    Object.keys(chr.equip).forEach(function(item) {
        if (chr.equip[item]) {
            value += Number(chr.equip[item].MOD_INIZ);
        }
    });

    //bonus da abilita'
    chr.skills.forEach(function(skl) {
        value += Number(skl.MOD_INIZ);
    })

    //bonus da abilita' su oggetti
    Object.keys(chr.equip).forEach(function(it) {
        if(chr.equip[it]){
            if(chr.equip[it].AB_OGGETTO){
                for(let x=0;x<chr.equip[it].AB_OGGETTO.length;x++){
                    let skl=data.abilities.filter(ab => ab.NOME==chr.equip[it].AB_OGGETTO[x].name)[0]
                    value += Number(skl.MOD_INIZ);
                }
            }
        }
    })

    return value;
}

//calcola il valore di difesa fisica in base ad oggetti e modificatori abilita'
function calculateDefense(chr) {
    let value = Number(document.getElementById("tempDes").value);
    let baseDef = null;
    let modDef = chr.pDefMod;

    //bonus da oggetti
    Object.keys(chr.equip).forEach(function(item) {
        if (chr.equip[item]) {
            //se il tipo difesa dell'oggetto � "BASE", allora il numero in MOD_DIF � il valore base di difesa, altrimenti � un bonus rispetto al valore di DES base
            //solo l'ultimo oggetto con TIPO_DIF="BASE" esaminato dal ciclo viene preso in considerazione, se ce ne sono piu' di uno equipaggiati
            if (chr.equip[item].TIPO_DIF == "BASE") {
                baseDef = Number(chr.equip[item].MOD_DIF);
            } else if (chr.equip[item].TIPO_DIF == "MOD") {
                modDef += Number(chr.equip[item].MOD_DIF);
            }
        }
    });

    //bonus da abilita' - si assume che non ci siano skill che definiscono una difesa base, a differenza dell'equip
    chr.skills.forEach(function(skl) {
        modDef += Number(skl.MOD_DIF);
    });

    //bonus da abilita' su oggetti
    Object.keys(chr.equip).forEach(function(it) {
        if(chr.equip[it]){
            if(chr.equip[it].AB_OGGETTO){
                for(let x=0;x<chr.equip[it].AB_OGGETTO.length;x++){
                    let skl=data.abilities.filter(ab => ab.NOME==chr.equip[it].AB_OGGETTO[x].name)[0]
                    modDef += Number(skl.MOD_DIF);
                }
            }
        }
    })

    return (baseDef ? baseDef : value) + modDef;
}

//calcola il valore di difesa magica in base ad oggetti e modificatori abilita'
function calculateMagicDefense(chr) {
    let value = Number(document.getElementById("tempInt").value);
    let baseDef = null;
    let modDef = chr.mDefMod;

    Object.keys(chr.equip).forEach(function(item) {
        if (chr.equip[item]) {
            //se il tipo difesa dell'oggetto � "BASE", allora il numero in MOD_DIF � il valore base di difesa, altrimenti � un bonus rispetto al valore di INT base
            //solo l'ultimo oggetto con TIPO_DIF_MAG="BASE" esaminato dal ciclo viene preso in considerazione, se ce ne sono piu' di uno equipaggiati
            if (chr.equip[item].TIPO_DIF_MAG == "BASE") {
                baseDef = Number(chr.equip[item].MOD_DIFM);
            } else if (chr.equip[item].TIPO_DIF_MAG == "MOD") {
                modDef += Number(chr.equip[item].MOD_DIFM);
            }
        }
    });

    //calculate bonus from abilities
    chr.skills.forEach(function(skl) {
        modDef += Number(skl.MOD_DIFM);
    });

    //bonus da abilita' su oggetti
    Object.keys(chr.equip).forEach(function(it) {
        if(chr.equip[it]){
            if(chr.equip[it].AB_OGGETTO){
                for(let x=0;x<chr.equip[it].AB_OGGETTO.length;x++){
                    let skl=data.abilities.filter(ab => ab.NOME==chr.equip[it].AB_OGGETTO[x].name)[0]
                    modDef += Number(skl.MOD_DIFM);
                }
            }
        }
    })

    return (baseDef ? baseDef : value) + modDef;
}

//calcola i PV massimi del PG
function maxHp(chr) {
    let value = characterLevel(chr) + chr.vig.base * 5;

    //bonus da abilita'
    let skillBonus = 0;
    chr.skills.forEach(function(skl) {
        if (skl.MOD_PV.indexOf("|") == -1) {
            skillBonus += Number(skl.MOD_PV)*(skl.LA?skl.LA:1); //se MOD_PV � un numero e non una formula del tipo (20:10|40)
        } else {
            let formula = skl.MOD_PV.split("|");
            if (characterLevel(chr) >= Number(formula[0].split(":")[0])) {
                skillBonus += Number(formula[1])*(skl.LA?skl.LA:1);
            } else {
                skillBonus += Number(formula[0].split(":")[1])*(skl.LA?skl.LA:1);
            }
        }
    })

    //bonus da abilita' su oggetti
    let itemSklBonus = 0;
    Object.keys(chr.equip).forEach(function(it) {
        if(chr.equip[it]){
            if(chr.equip[it].AB_OGGETTO){
                for(let x=0;x<chr.equip[it].AB_OGGETTO.length;x++){
                    let skl=data.abilities.filter(ab => ab.NOME==chr.equip[it].AB_OGGETTO[x].name)[0]

                    if (skl.MOD_PV.indexOf("|") == -1) {
                        itemSklBonus += Number(skl.MOD_PV)*(skl.LA?skl.LA:1); //se MOD_PV � un numero e non una formula del tipo (20:10|40)
                    } else {
                        let formula = skl.MOD_PV.split("|");
                        if (characterLevel(chr) >= Number(formula[0].split(":")[0])) {
                            itemSklBonus += Number(formula[1])*(skl.LA?skl.LA:1);
                        } else {
                            itemSklBonus += Number(formula[0].split(":")[1])*(skl.LA?skl.LA:1);
                        }
                    }
                }
            }
        }
    })

    value += skillBonus+itemSklBonus;

    return value;
}

//calcola i PM massimi del PG
function maxMp(chr) {
    let value = characterLevel(chr) + chr.vol.base * 5;

    //bonus da abilita'
    let skillBonus = 0;
    chr.skills.forEach(function(skl) {
        if (skl.MOD_PM.indexOf("|") == -1) {
            skillBonus += Number(skl.MOD_PM)*(skl.LA?skl.LA:1); //se MOD_PM � un numero e non una formula del tipo (20:10|40)
        } else {
            let formula = skl.MOD_PM.split("|");
            if (characterLevel(chr) >= Number(formula[0].split(":")[0])) {
                skillBonus += Number(formula[1])*(skl.LA?skl.LA:1);
            } else {
                skillBonus += Number(formula[0].split(":")[1])*(skl.LA?skl.LA:1);
            }
        }
    })

    //bonus da abilita' su oggetti
    let itemSklBonus = 0;
    Object.keys(chr.equip).forEach(function(it) {
        if(chr.equip[it]){
            if(chr.equip[it].AB_OGGETTO){
                for(let x=0;x<chr.equip[it].AB_OGGETTO.length;x++){
                    let skl=data.abilities.filter(ab => ab.NOME==chr.equip[it].AB_OGGETTO[x].name)[0]

                    if (skl.MOD_PM.indexOf("|") == -1) {
                        skillBonus += Number(skl.MOD_PM)*(skl.LA?skl.LA:1); //se MOD_PM � un numero e non una formula del tipo (20:10|40)
                    } else {
                        let formula = skl.MOD_PM.split("|");
                        if (characterLevel(chr) >= Number(formula[0].split(":")[0])) {
                            skillBonus += Number(formula[1])*(skl.LA?skl.LA:1);
                        } else {
                            skillBonus += Number(formula[0].split(":")[1])*(skl.LA?skl.LA:1);
                        }
                    }
                }
            }
        }
    })

    value += skillBonus+itemSklBonus;

    return value;
}

//calcola i PI massimi del PG
function maxIp(chr) {
    let value = 6 + chr.ip.mod;

    //bonus da abilita'
    let skillBonus = 0;
    chr.skills.forEach(function(skl) {
        if (skl.MOD_PI.indexOf("|") == -1) {
            skillBonus += Number(skl.MOD_PI)*(skl.LA?skl.LA:1); //se MOD_PM � un numero e non una formula del tipo (20:10|40)
        } else {
            let formula = skl.MOD_PI.split("|");
            if (characterLevel(chr) >= Number(formula[0].split(":")[0])) {
                skillBonus += Number(formula[1])*(skl.LA?skl.LA:1);
            } else {
                skillBonus += Number(formula[0].split(":")[1])*(skl.LA?skl.LA:1);
            }
        }
    })

    //bonus da abilita' su oggetti
    let itemSklBonus = 0;
    Object.keys(chr.equip).forEach(function(it) {
        if(chr.equip[it]){
            if(chr.equip[it].AB_OGGETTO){
                for(let x=0;x<chr.equip[it].AB_OGGETTO.length;x++){
                    let skl=data.abilities.filter(ab => ab.NOME==chr.equip[it].AB_OGGETTO[x].name)[0]

                    if (skl.MOD_PI.indexOf("|") == -1) {
                        skillBonus += Number(skl.MOD_PI)*(skl.LA?skl.LA:1); //se MOD_PM � un numero e non una formula del tipo (20:10|40)
                    } else {
                        let formula = skl.MOD_PI.split("|");
                        if (characterLevel(chr) >= Number(formula[0].split(":")[0])) {
                            skillBonus += Number(formula[1])*(skl.LA?skl.LA:1);
                        } else {
                            skillBonus += Number(formula[0].split(":")[1])*(skl.LA?skl.LA:1);
                        }
                    }
                }
            }
        }
    })

    value += skillBonus+itemSklBonus;

    return value;
}

//controlla se il PG ha un'abilita' col nome fornito, e se ce l'ha restituisce l'indice a cui si trova nelle sue "skills"
function hasAbility(chr, abilityName) {
    for (let i = 0; i < chr.skills.length; i++) {
        if (chr.skills[i].NOME == abilityName) {
            return i;
        }
    }
    return false;
}

//controlla se il PG ha una certa classe fornita, e se ce l'ha restituisce i livelli posseduti in questa
function hasLevels(chr, className) {
    if (chr.levels[className]) {
        return chr.levels[className];
    }
    return false;
}

//verifica la competenza del PG nell'oggetto passato come argomento
function hasCompetency(item) {
    let result = true;
    if (item.MARZIALE == "M") {
        if (item.RAGGIO == "Mischia" && !characterInfo.martial.melee) {
            result = false;
        } else if (item.RAGGIO == "Distanza" && !characterInfo.martial.range) {
            result = false;
        } else if (item.CATEGORIA == "Armatura" && !characterInfo.martial.armor) {
            result = false;
        } else if (item.CATEGORIA == "Scudo" && !characterInfo.martial.shield) {
            result = false;
        }
    }
    return result;
}

function updateScore(score, newValue) {
    score.current = Math.max(0, Math.min(Number(newValue), (score.max ? Number(score.max) + Number(score.mod) : Infinity)));
    checkOnCrisis()
	return score.current
}

function refreshTracker(tracker, newValue){
	updateScore(tracker.refObj, newValue)
	
	tracker.viewer.innerHTML=tracker.refObj.current
	tracker.input.value=tracker.refObj.current
	
	shareClocks()
}

//indica i punti da recuperare di un punteggio del pg. Se non viene definito un ammontare, viene curato completamente
function gainScore(name, amount = null) {
	let score=characterInfo[name]
	
    if (amount) {
        updateScore(score, (Number(score.current) + amount))
    } else if (score.max) {
        updateScore(score, Number.POSITIVE_INFINITY)
    }
	updateSheet()
}

//cura il pg di un certo quantitativo di PV. Non essendo indicato un ammontare, li rifulla completamente
function heal() {
    gainScore("hp");
}

//cura il pg di un certo quantitativo di PM. Non essendo indicato un ammontare, li rifulla completamente
function refresh() {
    gainScore("mp");
}

//verifica se il personaggio � in crisi (PV<=meta' PV max) e cambia le classi di alcuni elementi per visualizzarlo in scheda
function checkOnCrisis() {
    if (characterInfo.hp.current <= Math.floor(characterInfo.hp.max / 2) && characterInfo.hp.current > 0) {
        document.getElementById("heart").classList.add("crisisIcon");
    } else if (document.getElementById("heart").classList.contains("crisisIcon")) {
        document.getElementById("heart").classList.remove("crisisIcon");
    }
}

//funzione per calcolare il valore effettivo delle statistiche, dopo modifiche temporanee e status
function getTotalEffectiveStat(stat){
	let statusEffect=0
	let baselineStat=characterInfo[stat].temp
	
	if(stat==="des"){
		statusEffect=(characterInfo.status.slow ? 2 : 0) + (characterInfo.status.enraged ? 2 : 0)
	} else if(stat==="int"){
		statusEffect=(characterInfo.status.confused ? 2 : 0) + (characterInfo.status.enraged ? 2 : 0)
	} else if(stat==="vig"){
		statusEffect=(characterInfo.status.weak ? 2 : 0) + (characterInfo.status.poisoned ? 2 : 0)
	} else if(stat==="vol"){
		statusEffect=(characterInfo.status.shaken ? 2 : 0) + (characterInfo.status.poisoned ? 2 : 0)
	}
	
	if(statusEffect>0 && characterInfo[stat].temp==20){
		baselineStat=14
	}
	
	return Math.max(6, baselineStat - statusEffect);
}

//funzione per aggiungere le abilita' conferite da oggetti alla scheda
function addItemAbilities(it){
    let skl=[]

    if(it.AB_OGGETTO){
        for(let x=0;x<it.AB_OGGETTO.length;x++){
            skl=data.abilities.filter(ab => ab.NOME==it.AB_OGGETTO[x].name)

            if(skl.length>0){
                let newSkl=JSON.parse(JSON.stringify(skl[0]));
                newSkl.LA=it.AB_OGGETTO[x].la
                document.getElementById("equipAbilities").appendChild(buildAbilityForSheet(newSkl))
            }
        }
    }
}

//questa funzione si occupa di prendere le informazioni in memoria del PG e popola la scheda di conseguenza
function updateSheet(chr = characterInfo) {
    //effettua autosalvataggio se il flag � attivo
    if(chr.autosave){
        saveCharacter(true);
    }

    //aggiorna palette scheda
    if (characterInfo.sheetColor != "") {
        editPalette();
    } else {
        editPalette("#fddc71");
    }
	
	document.getElementById("addNewClass").style.removeProperty("display")

    //nome
    document.getElementById("name").innerHTML = chr.name;

    //livello totale PG
    document.getElementById("charTotLevel").innerHTML = characterLevel(chr);

    //dettaglio classi
    const firstElementChild = document.getElementById("addNewClass");
    document.getElementById("levelDetail").innerHTML = '';
    document.getElementById("levelDetail").append(firstElementChild);
    Object.keys(chr.levels).forEach(function(cls) {
        let newClass = {};
        newClass.name = cls;
        newClass.value = chr.levels[cls];
        populateClass(newClass);
    });

    //statistiche
    document.getElementById("baseDes").value = chr.des.base;
    document.getElementById("baseInt").value = chr.int.base;
    document.getElementById("baseVig").value = chr.vig.base;
    document.getElementById("baseVol").value = chr.vol.base;

    //status attivi
    Object.keys(chr.status).forEach(function(status) {
        document.getElementById(status).checked = chr.status[status];
    });

    //statistiche effettive, applicando in questo step l'effetto degli status sul PG	
	document.getElementById("tempDes").value = getTotalEffectiveStat("des")
    document.getElementById("tempInt").value = getTotalEffectiveStat("int")
    document.getElementById("tempVig").value = getTotalEffectiveStat("vig")
    document.getElementById("tempVol").value = getTotalEffectiveStat("vol")

    //tratti
    document.getElementById("identity").innerHTML = chr.traits.identity;
    document.getElementById("theme").innerHTML = chr.traits.theme;
    document.getElementById("origin").innerHTML = chr.traits.origin;

    //legami
    document.getElementById("bondsList").innerHTML = "";

    //si ripulisce la variabile dei legami da eventuali valori vuoti
    let i = 0;
    while (i < chr.bonds.length) {
        if (chr.bonds[i]) {
            i++;
        } else {
            chr.bonds.splice(i, 1);
        }
    }

    //una volta fatta pulizia, si itera nuovamente per popolare la scheda
    chr.bonds.forEach(function(bond, index) {
        bond.index = index;
        populateBond(bond);
    })

    //inventario - anche qui si usano gli oggetti strutturati per popolare la lista, e si tracciano gli oggetti da mettere nell'equipaggiamento
    document.getElementById("inventoryList").innerHTML = "";

    //si eliminano dal menu contestuale tutti i riferimenti a contenitori preesistenti
    document.getElementById("contextMenu").querySelectorAll("[containerMng]").forEach(function(btn) {
        btn.parentNode.removeChild(btn);
    });

    //check per vedere se il personaggio puo' equipaggiare due accessori o no
    if(hasAbility(characterInfo, "ALLA MODA")){
        document.getElementById("accessory2").style.removeProperty("display")
		document.getElementById("contextMenu").children[5].children[0].style.removeProperty("display")
    } else {
        document.getElementById("accessory2").style.display="none";1/0
		document.getElementById("contextMenu").children[5].children[0].display="none"
        unequip("bonusAccessory", false);
    }

    chr.inventory.forEach(function(el) {
        let newItem = populateItem(el);
        if (el.equipped) {
            chr.equip[el.equipped] = el;
        }

        //se l'oggetto ha un contenitore a cui appartiene, si ricrea il contenitore e lo si mette li' dentro
        if (el.container) {
            let otherContainers = document.querySelectorAll("[containerName='" + el.container + "']");
            let newContainer = null;

            if (otherContainers.length == 0) {
                newContainer = addInventoryContainer(el.container);
            } else {
                newContainer = otherContainers[0];
            }

            newContainer.appendChild(newItem);
        }
    })

    //equipaggiamento - si appendono le finestrelle strutturate degli oggetti nei div correlati
    //aggiungendo le abilita' dell'oggetto nell'apposito container della scheda
    if (!chr.equip.main) { //se non c'� un'arma assegnata alla mano principale, viene equipaggiata l'arma in indice 0 (Colpo Senz'Armi) della variabile "data", parametro "default"
        chr.equip.main = JSON.parse(JSON.stringify(data.default[0]));
    }
    document.getElementById("equipAbilities").innerHTML = "";

    document.getElementById("mainHand").innerHTML = "";
    document.getElementById("mainHand").appendChild(buildItemForSheet(chr.equip.main));
    addItemAbilities(chr.equip.main)

    document.getElementById("secondaryHand").innerHTML = "";
    if (!chr.equip.secondary) { //vedi sopra, si equipaggia il Colpo Senz'Armi
        document.getElementById("secondaryHand").innerHTML = "Nessuna";
        document.getElementById("removeSecondary").style.display="none"
    } else {
        document.getElementById("secondaryHand").appendChild(buildItemForSheet(chr.equip.secondary));
		document.getElementById("removeSecondary").style.removeProperty("display")
        addItemAbilities(chr.equip.secondary)
    }

    if (!chr.equip.armor) { //vedi sopra, si equipaggia l'oggetto 1 - armatura "Nessuna"
        chr.equip.armor = JSON.parse(JSON.stringify(data.default[1]));
    }
    document.getElementById("armor").innerHTML = "";
    document.getElementById("armor").appendChild(buildItemForSheet(chr.equip.armor));
    addItemAbilities(chr.equip.armor)

    if (!chr.equip.accessory) {
        document.getElementById("accessory").innerHTML = "Nessuno";
		document.getElementById("removeAccessory").style.display="none"
    } else {
        document.getElementById("accessory").innerHTML = "";
        document.getElementById("accessory").appendChild(buildItemForSheet(chr.equip.accessory));
		document.getElementById("removeAccessory").style.removeProperty("display")
        addItemAbilities(chr.equip.accessory)
    }
    
    if (!chr.equip.bonusAccessory) {
        document.getElementById("bonusAccessory").innerHTML = "Nessuno";
		document.getElementById("removeBonusAccessory").style.display="none"
    } else {
        document.getElementById("bonusAccessory").innerHTML = "";
        document.getElementById("bonusAccessory").appendChild(buildItemForSheet(chr.equip.bonusAccessory));
		document.getElementById("removeBonusAccessory").style.removeProperty("display")
        addItemAbilities(chr.equip.bonusAccessory)
    }

    //se sono state aggiunte abilita' legate agli oggetti, si visualizza il contenitore dedicato
    if(document.getElementById("equipAbilities").innerHTML != ""){
        document.getElementById("equipAb").style.removeProperty("display")
    } else {
        document.getElementById("equipAb").style.display="none"
    }

    //si popolano le note
    document.getElementById("noteList").innerHTML="";
    chr.notes.forEach(function(el) {
        addNewNote(el);
    });
	
	//peculiarit�
	Object.keys(chr.peculiarity).forEach((pr)=> {
		document.getElementById(pr).innerHTML = chr.peculiarity[pr];
    })
	
	//poteri zero
	Object.keys(chr.zeroPower).forEach((pr)=> {
		document.getElementById(pr).innerHTML = chr.zeroPower[pr];
    })
	
	//refresh clock potere zero
    document.getElementById("zeroClock").innerHTML=""
    document.getElementById("zeroClock").appendChild(zeroPowerClock())
	
    //si ricalcolano i punti vita, mente e inventario massimi con le funzioni apposite
    chr.hp.max = maxHp(chr);
    chr.mp.max = maxMp(chr);
    chr.ip.max = maxIp(chr);

    document.getElementById("ip").max = chr.ip.max;
    document.getElementById("ip_max").innerHTML = "Max PI: <span>" + chr.ip.max + "</span>";
    document.getElementById("ip").value = chr.ip.current;

    document.getElementById("zenit").value = chr.zenit.current;

    document.getElementById("scores").innerHTML = "";
    document.getElementById("scores").appendChild(createTracker("fabula"));
    document.getElementById("scores").appendChild(createTracker("hp"));
    document.getElementById("scores").appendChild(createTracker("mp"));

    checkOnCrisis();

    //statistiche di combattimento, calcolate con le funzioni apposite
    document.getElementById("initiative").innerHTML = calculateInitiative(chr);
    document.getElementById("defense").innerHTML = calculateDefense(chr);
    document.getElementById("magDefense").innerHTML = calculateMagicDefense(chr);

    //abilita' possedute
    let checkOnSkillNumber = {};
    let memoText = "";

    //immagine personaggio
    refreshProfileImage();

    //se il personaggio ha delle skill, si itera tra queste e si popola la lista di abilita' (o degli incantesimi)
    if (chr.skills) {
        document.getElementById("abilityList").innerHTML = "";
        document.getElementById("spellList").innerHTML = "";

        let skillContainers = {};
        let spellContainers = {};

        //si resettano le competenze marziali prima di verificare le skill possedute dal pg
        chr.martial = {
            melee: false,
            range: false,
            armor: false,
            shield: false
        }

        //si ciclano tra le skill e si categorizzano per classe di appartenenza
        chr.skills.forEach(function(el) {
            //si definisce la testata rappresentante la classe sotto la quale l'abilita' va messa, creandola se non esiste
            if (el.CAPACITA == "") { //se non � un incantesimo o una abilita' similare
                if (!skillContainers.hasOwnProperty(el.CLASSE)) { //se skillContainers non contiene gia' la classe dell'abilita' esaminata, si crea un nuovo raggruppamento sotto cui appendere le finestre abilita' strutturate
                    skillContainers[el.CLASSE] = createClassHeader(el.CLASSE);
                    document.getElementById("abilityList").appendChild(skillContainers[el.CLASSE]); //si appende la testata classe in abilityList
                }
                el.targetContainer = skillContainers[el.CLASSE];

                //si tiene conto del numero di skill possedute per gestire il memoText che informa di quante abilita' si possiedono rispetto a quante se ne dovrebbero possedere, per classe
                if (!checkOnSkillNumber[el.CLASSE]) {
                    checkOnSkillNumber[el.CLASSE] = el.LA;
                } else {
                    checkOnSkillNumber[el.CLASSE] += el.LA;
                }
            } else { //se � un incantesimo
                if (!spellContainers.hasOwnProperty(el.CLASSE)) { //se skillContainers non contiene gia' la classe dell'abilita' esaminata, si crea un nuovo raggruppamento sotto cui appendere le finestre abilita' strutturate
                    spellContainers[el.CLASSE] = createClassHeader(el.CLASSE);
                    document.getElementById("spellList").appendChild(spellContainers[el.CLASSE]); //???
                }
                el.targetContainer = spellContainers[el.CLASSE];
            }

            //si verifica se l'abilita' aggiunta fornisce competenze marziali di qualche tipo: se si', si aggiorna di conseguenza i dati in memoria
            if (el.COMP_MIS == "1") {
                chr.martial.melee = true;
            }

            if (el.COMP_DIS == "1") {
                chr.martial.range = true;
            }

            if (el.COMP_ARM == "1") {
                chr.martial.armor = true;
            }

            if (el.COMP_SCU == "1") {
                chr.martial.shield = true;
            }

            //si appende l'abilita' strutturata sotto il container di classe definito sopra (el.targetContainer)
            populateSkill(el);
        })

        //si controlla la competenza marziale fornita da abilita' su oggetti
        Object.keys(chr.equip).forEach(function(it) {
            if(chr.equip[it]){
                if(chr.equip[it].AB_OGGETTO){
                    for(let x=0;x<chr.equip[it].AB_OGGETTO.length;x++){
                        let skl=data.abilities.filter(ab => ab.NOME==chr.equip[it].AB_OGGETTO[x].name)[0]
                        
                        if (skl.COMP_MIS == "1") {
                            chr.martial.melee = true;
                        }
            
                        if (skl.COMP_DIS == "1") {
                            chr.martial.range = true;
                        }
            
                        if (skl.COMP_ARM == "1") {
                            chr.martial.armor = true;
                        }
            
                        if (skl.COMP_SCU == "1") {
                            chr.martial.shield = true;
                        }
                    }
                }
            }
        })

        //si iterano le classi possedute per determinare i punti disponibili per selezionare le abilita', costruendo un messaggio qualora il numero di abilita' scelte e i livelli nella classe corrispondente non siano uguali
        Object.keys(chr.levels).forEach(function(cls) {
            let compareVal = 0;
            if (checkOnSkillNumber[cls]) {
                compareVal = checkOnSkillNumber[cls];
            }

            //i livelli sono piu' delle abilita' scelte
            if (chr.levels[cls] > compareVal) {
                if (memoText == "") {
                    memoText = "Mancano da selezionare abilita': "
                } else {
                    memoText += ", ";
                }
                memoText += cls + ": " + (chr.levels[cls] - compareVal) + " punti";
            }

            //i livelli sono meno delle abilita' scelte
            if (chr.levels[cls] < compareVal) {
                if (memoText == "") {
                    memoText = "Skill in eccesso per: "
                } else {
                    memoText += ", ";
                }
                memoText += cls + ": " + (compareVal - chr.levels[cls]) + " punti";
            }
        });
        document.getElementById("memoAbilities").innerHTML = memoText;
    }
}

//template per la creazione di header di classe
function createClassHeader(className) {
    let body = document.createElement("div");
    let header = document.createElement("div");
    let classHead = document.createElement("span");

    header.appendChild(fetchClassIcon(className));
    header.className = "inRow";
    classHead.innerHTML = className;

    header.appendChild(classHead);
    body.appendChild(header);
    body.setAttribute("categoryWrapper", "skill");
    return body;
}

//template per la creazione di header per categoria degli oggetti
function createItemHeader(itemCat) {
    let body = document.createElement("div");
    let header = document.createElement("div");
    let itemHead = document.createElement("span");

    header.className = "inRow";
    itemHead.innerHTML = itemCat;

    header.appendChild(itemHead);
    body.appendChild(header);
    body.setAttribute("categoryWrapper", "item");
    return body;
}

//funzione per consentire il drop dell'oggetto dall'inventario all'equipaggiamento
function allowDrop(ev) {
    ev.preventDefault();
}

//identifica i dati da trasferire dell'oggetto col drag n drop da inventario
function startEquip(ev) {
    //si resettano draggate precedenti
    let drag = document.querySelectorAll("[lastDragged]");
    for (let i = 0; i < drag.length; i++) {
        drag[i].removeAttribute("lastDragged");
        if (drag[i].classList.contains("equipDenied")) {
            drag[i].classList.remove("equipDenied");
        }
    };

    //si identifica l'elemento draggato con un attributo, perch� l'implementazione del drag n drop fa cacare
    ev.target.setAttribute("lastDragged", "x");
}


function switchContextListPage(num){
	buildItemContextList(document.getElementById("listForEquip").getAttribute("slot"), Number(document.getElementById("listForEquip").getAttribute("lotPage"))+num)
}


//costruisce la lista di oggetti equipaggiabili nello slot, per un certo lotto di articoli
function buildItemContextList(slot, lot=0){
	let equippables=getEquippableItemsList(slot)
	
	if(equippables.length==0){
		document.getElementById("listForEquip").removeAttribute("slot")
		document.getElementById("listForEquip").removeAttribute("lotPage")
		document.getElementById("listForEquip").style.display="none"
		document.getElementById("backItems").style.display="none"
		document.getElementById("forwardItems").style.display="none"
		document.getElementById("listForEquip").parentNode.firstElementChild.style.display="none"
	} else {
		document.getElementById("listForEquip").setAttribute("slot", slot)
		document.getElementById("listForEquip").setAttribute("lotPage", lot)
		document.getElementById("listForEquip").style.removeProperty("display")
		document.getElementById("backItems").style.removeProperty("display")
		document.getElementById("forwardItems").style.removeProperty("display")
		document.getElementById("listForEquip").parentNode.firstElementChild.style.removeProperty("display")
		document.getElementById("listForEquip").innerHTML=""
		
		let maxItems=4
		
		let a=Math.min(equippables.length, maxItems*(Math.max(0,lot)+1))
		let da=Math.min(maxItems*Math.max(0,lot), a)
		
		for(let i=da;i<a;i++){
			let it=document.createElement("span")
			it.className="interactable"
			it.innerHTML=equippables[i].NOME
			it.prepend(fetchItemIcon(equippables[i].NOME))
			it.refObj=equippables[i]
			it.addEventListener("click", ()=>{equip(slot, it.refObj); setModal()})
			document.getElementById("listForEquip").appendChild(it)
		}
		
		if(da>0){
			document.getElementById("backItems").style.removeProperty("visibility")
		} else {
			document.getElementById("backItems").style.visibility="hidden"
		}
		
		if(a==equippables.length){
			document.getElementById("forwardItems").style.visibility="hidden"
		} else {
			document.getElementById("forwardItems").style.removeProperty("visibility")
		}
	}
}

//ottiene la lista degli oggetti in inventario equipaggiabili in un determinato slot
function getEquippableItemsList(slot){
	let inv=characterInfo.inventory
	let equippables=inv.filter(it=>checkEquippable(slot, it)===true)
	
	return equippables
}

//controlla che l'oggetto sia equipaggibile nello slot indicato
function checkEquippable(slot, item){
    //si verifica se l'arma � marziale e, nel caso, se il personaggio ha competenza in quel tipo di arma
    let skip = !hasCompetency(item);

    if (!skip) {
        //se l'oggetto � gia' equipaggiato, si disequipaggia prima
        //in base allo slot che ha lanciato questo evento, si assegna l'oggetto allo slot giusto
        if (slot == "armor") { //equip corpo
            if (item.MANI == "Corpo" && item.CATEGORIA == "Armatura") {
				return true
            }
        } else if (slot == "accessory" || slot == "bonusAccessory") { //equip accessorio
            if (item.MANI == "Corpo" && item.CATEGORIA == "Accessorio") {
				return true
            }
        } else if (slot == "secondaryHand" || slot == "secondary") { //equip mano secondaria
            let verify = false;

            if (item.MANI == "Sec") {
                verify = true;
            } else if (item.MANI == "Due" && (hasAbility(characterInfo, "STRETTA DELLA SCIMMIA") && ["Flagello", "Lancia", "Pesante", "Spada"].includes(item.CATEGORIA))) {
                if (hasAbility(characterInfo, "AMBIDESTRISMO")) {
                    if (characterInfo.equip.main.MANI == "Due") {
                        if (["Flagello", "Lancia", "Pesante", "Spada"].includes(characterInfo.equip.main.CATEGORIA)) {
                            verify = true;
                        }
                    } else {
                        verify = true;
                    }
                } else {
                    if (item.CATEGORIA == characterInfo.equip.main.CATEGORIA) {
                        verify = true;
                    }
                }
            } else if (item.MANI == "Una") {
                if (characterInfo.equip.main) {
                    if (characterInfo.equip.main.MANI == "Due") {
                        if (hasAbility(characterInfo, "STRETTA DELLA SCIMMIA")) {
                            if (hasAbility(characterInfo, "AMBIDESTRISMO")) {
                                if (["Flagello", "Lancia", "Pesante", "Spada"].includes(characterInfo.equip.main.CATEGORIA)) {
                                    verify = true;
                                }
                            } else {
                                if (item.CATEGORIA == characterInfo.equip.main.CATEGORIA) {
                                    verify = true;
                                }
                            }
                        }
                    } else {
                        if (hasAbility(characterInfo, "AMBIDESTRISMO")) {
                            verify = true;
                        } else if (item.CATEGORIA == characterInfo.equip.main.CATEGORIA) {
                            verify = true;
                        }
                    }
                }
            }

            return verify
        } else if ((slot == "mainHand" || slot == "main") && (item.MANI == "Una" || item.MANI == "Due" || (item.MANI == "Sec" && hasAbility(characterInfo, "DOPPIO SCUDO")))) { //equip mano principale
            return true
        }
	} else {
		return false
	}
}

//assegna l'oggetto all'equipaggiamento, in base alle sue caratteristiche e allo stato dell'equipaggiamento e delle abilita' del PG
function equip(s, it = null) {
    let slot = null;
    let item = null;

    //se non esiste elemento draggato, si sta provando ad equipaggiare un oggetto via codice
    //si passa il riferimento all'oggetto e si usa per fare tutti i passaggi successivi (l'oggetto in inventario � lo stesso che viene equipaggiato, non c'� cloning!)
    if (it) {
        item = it;
    } else {
        item = document.querySelectorAll("[lastDragged]")[0].associatedItem;
    }
	
	if(s.indexOf("Hand")>-1){
		slot=s.replace("Hand", "")
	} else {
		slot=s
	}
	
	if(checkEquippable(slot, item)){
		unequip(slot, false);
		unequipWithItem(item);
		characterInfo.equip[slot] = item;
		item.equipped = slot;
		
		//controllo per disequipaggiare se la mano secondaria � incompatibile con la mano primaria
		if(slot == "mainHand" || slot == "main"){
			if (item.MANI == "Una") {
				if (characterInfo.equip.secondary) {
					if (item.CATEGORIA != characterInfo.equip.secondary.CATEGORIA && !hasAbility(characterInfo, "AMBIDESTRISMO") && characterInfo.equip.secondary.MANI !="Sec") {
						unequip("secondary", false);
					}
				}
			} else if (item.MANI == "Due") {
				//se c'� un oggetto nella mano secondaria, si verifica se le abilita' possedute consentono a quell'oggetto di rimanere equipaggiato
				if (characterInfo.equip.secondary) {
					let checkIfUnequipSec = true;

					if (hasAbility(characterInfo, "STRETTA DELLA SCIMMIA") && ["Flagello", "Lancia", "Pesante", "Spada"].includes(item.CATEGORIA)) {
						if (hasAbility(characterInfo, "AMBIDESTRISMO")) {
							if (["Flagello", "Lancia", "Pesante", "Spada"].includes(characterInfo.equip.secondary.CATEGORIA)) {
								checkIfUnequipSec = false;
							}
						} else {
							if (item.CATEGORIA == characterInfo.equip.secondary.CATEGORIA) {
								checkIfUnequipSec = false;
							}
						}
					}

					if (checkIfUnequipSec) {
						unequip("secondary", false);
					}
				}
			}
		}
		
        updateSheet();
    } else {
        document.querySelectorAll("[lastDragged]")[0].classList.add("equipDenied");
    }
}

//rimuove l'oggetto dallo slot indicato
function unequip(ev, update = true) {
    let slot = null;

    if (ev.target) {
        slot = ev.target.slot;
    } else {
        slot = ev;
    }

    //si rimuove lo stato di equipaggiato all'oggetto eventualmente gia' presente nello slot
    if (characterInfo.equip[slot]) {
        if (characterInfo.equip[slot].equipped) {
            delete characterInfo.equip[slot].equipped
        }
    }

    //si svuota lo slot equipaggiamento
    characterInfo.equip[slot] = null;

    //si puo' evitare l'aggiornamento della scheda dichiarandolo esplicitamente
    if (update) {
        updateSheet();
    }
}

function unequipWithItem(item) {
    if (item.equipped) {
        unequip(item.equipped, false);
    }
}

//funzione che rimuove l'oggetto dall'inventario e dall'equipaggiamento, se equipaggiato
function removeFromInventory(item) {
    //prima si rimuove l'oggetto dall'equipaggiamento
    unequipWithItem(item)

    //poi si rimuove dall'inventario
    for (let i = 0; i < characterInfo.inventory.length; i++) {
        if (item === characterInfo.inventory[i]) {
            characterInfo.inventory.splice(i, 1);
            break;
        }
    }
}

//funzione per aggiungere contenitori nell'inventario
function addInventoryContainer(existingContainer = null) {
    let container = document.createElement("div");
    container.className = "itemContainer";
    container.style.borderWidth = "3px";

    let header = document.createElement("div");
    let body = document.createElement("div");
    body.style.display = "none";

    //menu popup del contenitore
    let popupContainer = document.createElement("div");
    popupContainer.classList.add("popupContainer");

    let emptyButton = fetchSvgIcon("backspace");
    emptyButton.refObj = body;
    emptyButton.addEventListener("click", function(f) {
        if (window.confirm("Si � sicuri di voler svuotare completamente il contenitore e cancellarlo?")) {
            for (let i = 0; i < f.target.refObj.children.length; i++) {
                delete f.target.refObj.children[i].associatedItem.container;
            }
            updateSheet();
        }
    });

    popupContainer.appendChild(emptyButton);
    container.appendChild(popupContainer);
    container.appendChild(header);
    container.appendChild(body);

    container.addEventListener("dragover", function(f) { f.preventDefault(); });

    document.getElementById("inventoryList").prepend(container);

    if (!existingContainer) {
        let newBox = createTextInput(function(f) { renameItemContainer(newBox[0].value, header, body), updateSheet });

        header.appendChild(newBox[0]);
        header.appendChild(newBox[1]);
		newBox[0].removeAttribute("newInput")
    } else {
        renameItemContainer(existingContainer, header, body)
    }
	
    body.setAttribute("containerName", existingContainer);

    return body;
}

//si crea una nota qualsiasi per tenere traccia sulla scheda di cose
function addNewNote(refObj=null) {
    let note = document.createElement("div");
    note.className = "item";
    note.style.borderWidth = "3px";

    let header = document.createElement("div");
    header.className = "inRow";
    
    let body = document.createElement("div");

    body.className = "itemContainer";
    body.style.flexDirection="column";
    body.style.display = "none";

    note.appendChild(header);
    note.appendChild(body);
    
    if(refObj==null){
        let newBox = createTextInput(function(f) { 
            characterInfo.notes.push(
                {
                    title: newBox[0].value, 
                    content: ""
                }
            );
            updateSheet()
        });

        header.appendChild(newBox[0]);
        header.appendChild(newBox[1]);
    } else {
        note.refObj=refObj;

        let title=document.createElement("div");
        title.innerHTML=refObj.title;
        title.addEventListener("dblclick", 
            function (e) {
                let prevVal= title.innerHTML;
                header.innerHTML="";
                let newBox = createTextInput(
                    function(e) {
                        refObj.title=newBox[0].value;
                        updateSheet();
                    },
                    updateSheet
                );
                newBox[0].value = prevVal;
				newBox[0].removeAttribute("newInput")

                header.appendChild(newBox[0]);
                header.appendChild(newBox[1]);
            }
        )

        header.appendChild(title);
        let expander=document.createElement("div");
        expander.appendChild(expandIcon(true, body));
        header.appendChild(expander);

        let bodyContent = document.createElement("textarea");
        bodyContent.addEventListener("input", function(e){
            this.style.height = "";
            this.style.height = Math.max(Math.min(200,bodyContent.scrollHeight), 100) + "px";
            refObj.content=this.value;
            if(characterInfo.autosave){
                saveCharacter(true);
            }
        });
        bodyContent.style.width="100%";
        bodyContent.style.height=Math.max(Math.min(200,bodyContent.scrollHeight), 100) + "px";
        bodyContent.style.resize="vertical";
        bodyContent.style.overflow="auto";
        bodyContent.innerHTML=refObj.content;
        body.appendChild(bodyContent);

        let popupMenu = document.createElement("div");
        popupMenu.classList.add("popupMenu");
    
        let removalButton = null;
        
        removalButton=fetchSvgIcon("trash");
        removalButton.addEventListener("click", function(f) {
            if (window.confirm("Confermi di voler cancellare questa nota?")) {
                characterInfo.notes.splice(characterInfo.notes.indexOf(refObj), 1)
                updateSheet();
            }
        });

        removalButton.classList.add("closeIcon");

        popupMenu.appendChild(removalButton);
        note.appendChild(popupMenu);
    }

    document.getElementById("noteList").appendChild(note);
}

//funzione per abilitare la rinominazione del contenitore oggetti. Viene attivato anche quando il contenitore viene creato
function renameItemContainer(name, header, targetEl) {
    //si controlla che il nome inserito non sia vuoto e che non ci siano altri contenitori con lo stesso nome
    if (name.trim() != "" && document.querySelectorAll("[containerName=\"" + name + "\"]").length == 0) {
        let icon = fetchSvgIcon("box");
        icon.style.margin = "5px";

        let newName = document.createElement("div")
        newName.style.margin = "auto";
        newName.style.display = "flex";
        newName.style.alignItems = "center";
        newName.style.justifyContent = "center";
        newName.innerHTML = name;
        targetEl.setAttribute("containerName", name);

        //in caso di doppio click sul nome, si cancella il contenuto dell'header e si predispone l'attivazione di questa funzione, in modo ricorsivo
        newName.addEventListener("dblclick",
            function(e) {
                let prevVal = header.textContent;
                header.innerHTML = "";
                let newBox = createTextInput(
                    function(e) {
                        //se si rinomina il contenitore, vanno aggiornati anche tutti gli oggetti in esso contenuti
                        for (let i = 0; i < targetEl.children.length; i++) {
                            targetEl.children[i].associatedItem.container = newBox[0].value;
                        }

                        renameItemContainer(newBox[0].value, header, targetEl)
                    },
                    updateSheet
                );
                newBox[0].value = prevVal;
				newBox[0].removeAttribute("newInput")
                header.appendChild(newBox[0]);
                header.appendChild(newBox[1]);
            }
        );

        //si aggiungono gli eventi drag n drop sul contenitore principale
        targetEl.parentNode.removeEventListener("drop", assignContainer);
        targetEl.parentNode.addEventListener("drop", function(e) { assignContainer(name, document.querySelectorAll("[lastDragged]")[0], targetEl) });

        //si aggiungono gli eventi nel menu contestuale per assegnare gli oggetti tramite menu
        let newContextMenuRow= document.createElement("div");
        newContextMenuRow.innerHTML="<span>Sposta in '"+name+"'</span>";
        newContextMenuRow.setAttribute("containerMng", "");
        newContextMenuRow.addEventListener("click", function(e) { assignContainer(name, document.querySelectorAll("[lastDragged]")[0], targetEl); setModal() });
        document.getElementById("contextMenu").appendChild(newContextMenuRow);

        //si resetta il contenuto dell'header prima di aggiungere elementi
        header.innerHTML = "";

        newName.prepend(icon);
        header.appendChild(newName);
        header.appendChild(expandIcon());
    }
}

//crea l'icona per visualizzare i container immediatamente seguenti all'elemento padre dove viene collocata questa icona
function expandIcon(alreadyClosed = true, trg = null) {
    let expandIcon = fetchSvgIcon("chevron-down");

    if (!alreadyClosed) {
        expandIcon.style.transform = "rotate(180deg)";
    }

    expandIcon.addEventListener("click", function(ev) {
        let target = null;
        if (!trg) {
            target = ev.target.parentNode.nextElementSibling; //RIFERIMENTO POSIZIONALE
        } else {
            target = trg;
        }
        if (target.style.display == "none") {
            target.style.removeProperty("display")
            ev.target.style.transform = "rotate(180deg)";
        } else {
            target.style.display = "none";
            ev.target.style.transform = "rotate(0deg)";
        }
    });
    return expandIcon;
}

//funzione che definisce la struttura della finestra oggetti strutturati usata nella scheda
function buildItem(i) {
    let frame = document.createElement("div");
    let header = document.createElement("div");
    let body = document.createElement("div");

    header.appendChild(fetchItemIcon(i.NOME));

    let name = document.createElement("span");
    name.innerHTML = i.NOME;
    header.appendChild(name);
    header.appendChild(expandIcon(true, body));
    header.style.display = "flex";
    header.style.alignItems = "center";

    body.innerHTML = "";

    let isMartial = (i.MARZIALE != "" ? "[<span style='color: transparent;text-shadow: 0 0 0 " + (hasCompetency(i) ? "black" : "red") + ";'>🛡️</span>" + ']' : "");

    //il testo e contenuto della finestra varia a seconda delle caratteristiche e della natura dell'oggetto
    if (i.CATEGORIA == "Armatura" || i.CATEGORIA == "Scudo") {
        body.innerHTML += "<div style='border-bottom: solid 1px black;'>" + i.CATEGORIA + isMartial + " - " + i.COSTO + "Z</div>";
        body.innerHTML += "<div>Difesa: " + ((i.TIPO_DIF != "BASE" && i.MOD_DIF.charAt(0) != "-") ? "+" : "") + i.MOD_DIF + ", Dif. Magica: " + ((i.TIPO_DIF != "BASE" && i.MOD_DIFM.charAt(0) != "-") ? "+" : "") + i.MOD_DIFM + ", Iniziativa: " + i.MOD_INIZ + "</div>";
    } else if (i.CATEGORIA != "Accessorio") {
        body.innerHTML += "<div style='border-bottom: solid 1px black;'>" + i.CATEGORIA + " (" + i.RAGGIO + ")" + isMartial + ", Mani: " + i.MANI + " - " + i.COSTO + "Z</div>";
        body.innerHTML += "<div class='inRow' style='border-bottom: solid 1px black;'><span class='interactable'>TP: <span class='tp'>" + i.PRECISIONE + "</span></span><span class='interactable'><span class='td'>" + i.DANNO + "</span> " + i.TIPO_DANNO + "</span></div>";
    }

    body.innerHTML += "<div>Qualita': " + encodeHTML(i.QUALITA) + "</div>";
    body.style.display = "none";
    body.style.flexDirection = "column";
    body.className = "infoBlock";
    body.textForChat={
        get value(){
            let text= "\n**"+i.NOME+"**";

            for(let x=0;x<body.children.length;x++){
                text+="\n"+ body.children[x].textContent;
            }

            return text;
        }
    }

    frame.refObj = i;
    frame.appendChild(header);
    frame.appendChild(body);

    frame.className = "item";

    //si assegna il riferimento all'oggetto usato per costruire questo frame
    frame.slot = i;
    return frame;
}

function buildItemForSheet(i) {
    //si applica ad ogni elemento con le classi "chiave" eventi ed attributi appropriati
    let newItem=buildItem(i);
    applySpecialNotation(newItem);
    return newItem
}

//funzione che definisce la struttura della finestra abilita' strutturate usata nella scheda
function buildAbility(a) {
    let frame = document.createElement("div");
    let header = document.createElement("div");
    let body = document.createElement("div");

    //si mette un prefisso in caso di incantesimi o abilita' eroiche
    header.innerHTML = (a.TIPO == "Eroica" ? "[Eroica] " : "") + (a.TIPO == "Incantesimo" ? "Incantesimo: " : "") + (a.OFFENSIVO == "x" ? '[⚡] ' : "") + a.NOME;

    header.appendChild(expandIcon(true, body));
    header.style.display = "flex";
    header.style.alignItems = "center";

    body.innerHTML = "";

    //si riportano LA massimi e correnti dell'abilita'
    body.innerHTML += "<div style='border-bottom: solid 1px black;'> " + (Number(a.MAX_LA) > 1 ? "LA massimo: " + a.MAX_LA + (a.LA ? ", LA attuale: " + a.LA : "") : "") + "</div>";

    //il testo cambia a seconda della natura dell'abilita'
	let dat="";
	if(a.COSTO.trim()!=""){
		dat += "Costo: " + a.COSTO + ", ";
	}
	if(a.BERSAGLIO.trim()!=""){
		dat += dat!=""?", ":"";
		dat += "Bersaglio: " + a.BERSAGLIO + ", ";
	}
	if(a.DURATA.trim()!=""){
		dat += dat!=""?", ":"";
		dat += "Durata: " + a.DURATA;
	}

	if(dat!=""){
		body.innerHTML += "<div style='border-bottom: solid 1px black;'>";
		body.innerHTML += dat;
		body.innerHTML += "</div>";
	}

    //si mostrano eventuali requisiti
    if (a.REQUISITI != "") {
        body.innerHTML += "<div style='border-bottom: solid 1px black;'>Requisiti: " + a.REQUISITI + "</div>";
    }

    body.innerHTML += "<div> " + encodeHTML(a.TESTO) + "</div>";
    body.style.display = "none";
    body.style.flexDirection = "column";
    body.className = "infoBlock"
    body.textForChat={
        get value(){
            let text= "\n**"+header.textContent+"**";

            for(let x=0;x<body.children.length;x++){
                text+="\n"+ body.children[x].textContent;
            }

            return text;
        }
    }

    frame.refObj = a;
    frame.appendChild(header);
    frame.appendChild(body);

    frame.className = "ability";
    return frame;
}

function buildAbilityForSheet(a) {
    //si applica ad ogni elemento con le classi "chiave" eventi ed attributi appropriati
    let newSkill=buildAbility(a);
    applySpecialNotation(newSkill);
    newSkill.addEventListener("contextmenu", 
        function(e){
            buildContextMenu(this, [e.clientX, e.clientY], {chatInter:true});
            e.preventDefault(e);
        }
    );
    return newSkill
}

//applica ad ogni elemento con le classi "chiave" (Tiro di Precisione, Tiro Danno, Livello Abilita'...) eventi ed attributi appropriati
function applySpecialNotation(html) {
    //Tiri di Precisione
    for (let tp of html.getElementsByClassName("tp")) {
        let values = tp.textContent.replace("[", "").replace("]", "|").split("|")[0].split("+");
        tp.popupContent = "<span class='tip'>[d" + getTotalEffectiveStat(values[0].trim().toLowerCase()) + " + d" + getTotalEffectiveStat(values[1].trim().toLowerCase()) + "]";

        if (tp.textContent.split("]").length > 1) {
            tp.popupContent += tp.textContent.split("]")[1].trim();
        }

        tp.popupContent += "</span>";

        tp.addEventListener("click", showPopup);
    }

    //Tiri di Danno
    for (let td of html.getElementsByClassName("td")) {
        //aggiungere eventi onclick, se serve
    }

    //Livello Abilita'
    for (let la of html.getElementsByClassName("la")) {
        if (html.refObj.LA) {
            la.innerHTML = la.innerHTML.replace("LA", "<span style='color:green;font-weight:bolder'>" + html.refObj.LA + "</span>")
        }
    }
}

//fornisce dai dati locali un elemento img contenente l'immagine dell'oggetto passato come nome alla funzione
function fetchItemIcon(item) {
    return fetchIcon(item, "items");
}

//fornisce dai dati locali un elemento img contenente l'immagine della classe passata come nome alla funzione
function fetchClassIcon(cls) {
    return fetchIcon(cls, "classes");
}

//fornisce dai dati locali un elemento img contenente l'immagine della classe passata come nome alla funzione
function fetchSvgIcon(svg) {
    return fetchIcon(svg, "svg", "svg");
}

//si recupera l'icona col nome indicato nella cartella indicata, con un fallback in caso di mancato reperimento
function fetchIcon(target, folder, type = "jpg") {
    let icon = document.createElement("img");
    icon.className = "icon";
    icon.src = fallbackImgB64

    if (type == "svg") {
        if (systemData.svg[target]) {
            icon.src = "data:image/svg+xml;charset=UTF-8," + systemData.svg[target];
        } else {
            icon.src = fallbackImgB64;
        }
        icon.className = "falt";
        icon.draggable = false;
		
		icon.addEventListener("mousedown", async function(){
				icon.classList.add("clicked")
				await sleep(100);
				icon.classList.remove("clicked")
			}
		)
		
    } else {
        let img = data.img[folder][
            Object.keys(data.img[folder]).find(k => k.toLowerCase() === target.toLowerCase())
        ];
        if (img) {
            icon.src = img;
        } else {
            icon.src = fallbackImgB64;
        }
    }

    return icon;
}

//funzione che attiva o disattiva la finestra modale e il compendio
function setModal(targetModal = "compendiumFU") {
    if(document.getElementById("popup").style.display != "none"){
        document.getElementById("popup").style.display = "none"
		if(document.getElementById("rollResult")){
			document.getElementById("rollResult").innerHTML=""
		}
    }
    if (document.getElementById("modalBckgr").style.display == "none") {
        if (targetModal == "compendiumFU") {
            resetModalContent();
        }
        document.getElementById("modalBckgr").style.removeProperty("display");
        document.getElementById(targetModal).style.removeProperty("display");
    } else {

        let windows = document.querySelectorAll("[modal]");
        for (let i = 0; i < windows.length; i++) {
            windows[i].style.display = "none";
        };
    }
    
    if(document.querySelectorAll("[lastDragged]").length>0){
        document.querySelectorAll("[lastDragged]")[0].removeAttribute("lastDragged");
    }
}

//funzione che resetta il contenuto della finestra modale (compendio), ricreandolo per aggiornarlo (soprattutto nel caso delle abilita')
function resetModalContent() {
    let filters = document.getElementById("availableItems").firstElementChild;
    document.getElementById("availableItems").innerHTML = "";
    document.getElementById("availableAbilities").innerHTML = "";
    document.getElementById("wikiEntries").innerHTML = "";

    document.getElementById("availableItems").appendChild(filters);

    addItem();
    addSkill();
    addWiki();
    applyItemFilter();
}

//funzione di supporto per la funzione sotto
function createRelatedNumberInput(selEl=null){
    let strength = document.createElement("input");
    strength.type="number"
    strength.min="1"
    
    if(selEl){
        strength.max=selEl.max
        strength.value=Math.min(selEl.la, strength.max)
    } else {
        strength.value=1
    }

    return strength
}

//funzione per generare lista di opzioni nell'editor per abilita' conferite dagli oggetti
function generateListOptions(list, selEl=null){
    let wrapper = document.createElement("div");
    wrapper.style.display="flex"
    wrapper.style.flexDirection="row"
    wrapper.style.alignItems="center"
    wrapper.style.justifyContent="center"

    let newOpt = document.createElement("select");
    newOpt.style.maxWidth="50%";
	
    let bitOption = document.createElement("option");

    let deleter=fetchSvgIcon("trash")

    deleter.addEventListener("click", function(e){
        deleter.parentNode.parentNode.removeChild(deleter.parentNode)
    })

    data[list].forEach(function(val) {
        let newOption = bitOption.cloneNode();
        newOption.value = val.NOME;
        newOption.text = val.NOME;
        newOpt.appendChild(newOption);
    });

    if(selEl){
        newOpt.value=selEl.name
        newOpt.refInput=createRelatedNumberInput(selEl)
    } else {
        newOpt.refInput=createRelatedNumberInput({
            name: newOpt[0].value,
            la: 1,
            max: data[list].filter(ref => ref.NOME==newOpt[0].value)[0].MAX_LA
        })
    }

    newOpt.addEventListener("change", function(e){
        let newInput=createRelatedNumberInput(
            {
                name: newOpt.value,
                la: newOpt.refInput.value,
                max: data[list].filter(ref => ref.NOME==newOpt.value)[0].MAX_LA
            }
        )
        newOpt.refInput.parentNode.insertBefore(newInput, newOpt.refInput)
        newOpt.refInput.parentNode.removeChild(newOpt.refInput)
        newOpt.refInput=newInput
    })

    wrapper.appendChild(newOpt)
    wrapper.appendChild(newOpt.refInput)
    wrapper.appendChild(deleter)

    return wrapper
}

//questa funzione popola l'editor con il contenuto dell'elemento passato, per poterlo modificare direttamente
function openEditor(obj, callbackFunction, targetContainer=null) {
    let editorContent = document.createElement("div");
    editorContent.style.position="relative";
    editorContent.style.margin="auto";
    editorContent.style.maxWidth= "80%";

    //se l'oggetto � un oggetto, lo si riconosce se possiede la proprieta' "RARITA", non posseduta dalle abilita'
    let setOfTags = null;

    if(obj.hasOwnProperty("EDITOR")){
        setOfTags = data.editorTags[obj.EDITOR];
    } else {
        if (obj.RARITA) {
            setOfTags = data.editorTags.OGGETTO;
        } else if (obj.CLASSE == "" || obj.CLASSE) {
            setOfTags = data.editorTags.ABILITA;
        } else if (obj.DESCRIZIONE) {
            setOfTags = data.editorTags.WIKI;
        }
    }

    //fallback per tutti queli elementi (tipo le classi) che possono essere editate ma non sono strutturati come oggetti, ma come array di descrizioni
    if(setOfTags===null){
        editorContent.descriptionRefs=obj;
        obj ={NOME: editorContent.descriptionRefs.arr[editorContent.descriptionRefs.idx]};
        setOfTags={
            NOME: { 
                label: "Nome", 
                tag: "input", 
                inputType: "text"
            }
        }
    }
    
    editorContent.refObj = obj;

    //si iterano tutte le proprieta' dell'oggetto e si compila l'editor con degli elementi appropriati per la modifica
    Object.keys(setOfTags).forEach(function(propName) {
        if(setOfTags.hasOwnProperty(propName)){
            let prop = setOfTags[propName];
            let bitContainer = document.createElement("div");
            bitContainer.className = "elementBits";

            let label = document.createElement("span");
            label.innerHTML = prop.label;
            let newBit = null

            if (prop.tag == "list") {
                newBit = document.createElement("div");
            } else {
                newBit = document.createElement(prop.tag);
            }

            //se l'elemento da creare � una select, si riempiono le varie opzioni, altrimenti si indica il tipo di input da assegnare all'elemento
            if (prop.tag == "select") {
                let bitOption = document.createElement("option");

                prop.values.forEach(function(val) {
                    let newOption = bitOption.cloneNode();
                    newOption.value = val;
                    newOption.text = val;
                    newBit.appendChild(newOption);
                });
            } else if (prop.tag == "input") {
                newBit.type = prop.inputType;
            } else if (prop.tag == "textarea") {
                newBit.style.height = "10em";
                newBit.style.width = "100%";
                newBit.style.resize = "none";
            } else if (prop.tag == "list") {
                newBit.style.display="flex"
                newBit.style.flexDirection="column"

                let adder=fetchSvgIcon("plus")
                adder.list=prop.values
                adder.style.width = "100%";
                adder.addEventListener("click", function(e){
                    adder.parentNode.appendChild(generateListOptions(adder.list))
                })
                newBit.appendChild(adder)

                //se esistono gia' abilita' associate all'oggetto, si mostrano quando si apre l'editor
                if(obj[propName]){
                    let totLv=0
                    let maxAb=Number.POSITIVE_INFINITY

                    if(obj["MAX_AB_OGGETTO"]){
                        maxAb=Number(obj["MAX_AB_OGGETTO"])
                    }

                    obj[propName].forEach(function(ab) {
                        ab.max=data.abilities.filter(ref => ref.NOME==ab.name)[0].MAX_LA
                        if(maxAb>totLv){
                            ab.max=Math.min(maxAb-totLv, ab.la)
                            ab.la=Math.min(ab.la, ab.max)
                            totLv+=ab.max

                            adder.parentNode.appendChild(generateListOptions(adder.list, ab))
                        }
                    });
                }
            }

            if (prop.tag != "list") {
                newBit.value = obj[propName];
            }

            newBit.setAttribute("property", propName);
            newBit.propType=prop.tag;

            bitContainer.appendChild(label);
            bitContainer.appendChild(newBit);
            editorContent.appendChild(bitContainer);
        }
    });

    //tasto per caricare i dati
    let button = document.createElement("div");
    button.className = "button";
    button.innerHTML = "Salva"
    button.style.position = "relative"
    button.addEventListener("click", function(e) {
        callbackFunction(editorContent)
    });
    
    if(targetContainer==null){
        targetContainer=document.getElementById("editorContent");
    }
    
    targetContainer.innerHTML = "";
    targetContainer.appendChild(editorContent);
    targetContainer.prepend(button);
}

//carica i valori dell'editor passato come argomento nell'oggetto di riferimento
function uploadEditorValues(editorFrame) {
    let refObj = editorFrame.refObj;
    let changed=false;

    editorFrame.querySelectorAll("[property]").forEach(function(prop) {
        if(editorFrame.descriptionRefs){
            if(prop.value!==editorFrame.descriptionRefs.arr[editorFrame.descriptionRefs.idx]){
                editorFrame.descriptionRefs.arr[editorFrame.descriptionRefs.idx]=prop.value;
                changed=true;
            }
        } else if(prop.propType=="list"){
            let newList=[]
            for(let i=0;i<prop.querySelectorAll("select").length;i++){
                newList.push({
                    name: prop.querySelectorAll("select")[i].value,
                    la: prop.querySelectorAll("select")[i].refInput.value,
                })
            }

            if (refObj[prop.getAttribute("property")]!=newList){
                refObj[prop.getAttribute("property")]=newList
                changed=true;
            }

            console.log(newList)
        } else {
            if(refObj[prop.getAttribute("property")] !== prop.value){
                changed=true;
            }
    
            refObj[prop.getAttribute("property")] = prop.value;
        }
    });

    if(document.getElementById("newImgPreview")){
        let newName="";
        if(editorFrame.descriptionRefs){
            newName=editorFrame.descriptionRefs.arr[editorFrame.descriptionRefs.idx].toLowerCase();
        } else {
            newName=refObj.NOME;
        }

        if(data.img[document.getElementById("selectListToEdit").value][newName]){
            if(data.img[document.getElementById("selectListToEdit").value][newName]!=document.getElementById("newImgPreview").src){
                data.img[document.getElementById("selectListToEdit").value][newName]=document.getElementById("newImgPreview").src;
                changed=true;
            }
        } else {
            data.img[document.getElementById("selectListToEdit").value][newName]=document.getElementById("newImgPreview").src;
            changed=true;
        }
    }

    return changed;
}

//crea i set di filtri da applicare alla lista di oggetti nel compendio
function itemFilters() {
    let filterContainer = document.createElement("div");
    filterContainer.className = "filterList";

    let filterName = document.createElement("div");
    let filterCategory = document.createElement("div");
    let filterRarity = document.createElement("div");
    let filterRange = document.createElement("div");
    let filterMartial = document.createElement("div");
    let filterHands = document.createElement("div");
    let filterDmgType = document.createElement("div");

    //si itera tra tutti gli oggetti in variabile "data" per identificare tutti i possibili valori di categoria, rarita', raggio, mani e tipo danno
    let possFilVal = {};

    //valori di default
    possFilVal.categoria = [""];
    possFilVal.rarita = [""];
    possFilVal.raggio = [""];
    possFilVal.mani = [""];
    possFilVal.tipo_danno = [""];

    //durante l'iterazione, si verifica se � gia' stato valutato quel valore: se no, si pusha nell'array della proprieta' esaminata
    data.items.forEach(function(it) {
        if (it.CATEGORIA) {
            if (!possFilVal.categoria.includes(it.CATEGORIA)) {
                possFilVal.categoria.push(it.CATEGORIA);
            }
        }
        if (it.RARITA) {
            if (!possFilVal.rarita.includes(it.RARITA)) {
                possFilVal.rarita.push(it.RARITA);
            }
        }
        if (it.RAGGIO) {
            if (!possFilVal.raggio.includes(it.RAGGIO)) {
                possFilVal.raggio.push(it.RAGGIO);
            }
        }
        if (it.MANI) {
            if (!possFilVal.mani.includes(it.MANI)) {
                possFilVal.mani.push(it.MANI);
            }
        }
        if (it.TIPO_DANNO) {
            if (!possFilVal.tipo_danno.includes(it.TIPO_DANNO)) {
                possFilVal.tipo_danno.push(it.TIPO_DANNO);
            }
        }
    });

    //filtro per il nome
    filterName.innerHTML = "<span style='margin-right:1em;'>Nome</span>";
    let inputFilterName = document.createElement("input");
    inputFilterName.id = "itemFilterName";
    inputFilterName.type = "text";
    inputFilterName.addEventListener("keyup", applyItemFilter);
    filterName.appendChild(inputFilterName);

    //filtro per la categoria
    filterCategory.innerHTML = "<span style='margin-right:1em;'>Categoria</span>";
    let inputFilterCategory = document.createElement("select");
    inputFilterCategory.id = "itemFilterCategory";
    possFilVal.categoria.forEach(function(val) {
        let opt = document.createElement("option");
        opt.value = val;
        opt.text = val;
        inputFilterCategory.appendChild(opt);
    });

    inputFilterCategory.addEventListener("change", applyItemFilter);
    filterCategory.appendChild(inputFilterCategory);

    //filtro per la rarita'
    filterRarity.innerHTML = "<span style='margin-right:1em;'>Rarit&#224;</span>";
    let inputFilterRarity = document.createElement("select");
    inputFilterRarity.id = "itemFilterRarity";

    possFilVal.rarita.forEach(function(val) {
        let opt = document.createElement("option");
        opt.value = val;
        opt.text = val;
        inputFilterRarity.appendChild(opt);
    });

    inputFilterRarity.addEventListener("change", applyItemFilter);
    filterRarity.appendChild(inputFilterRarity);

    //filtro per la gittata
    filterRange.innerHTML = "<span style='margin-right:1em;'>Raggio</span>";
    let inputFilterRange = document.createElement("select");
    inputFilterRange.id = "itemFilterRange";
    possFilVal.raggio.forEach(function(val) {
        let opt = document.createElement("option");
        opt.value = val;
        opt.text = val;
        inputFilterRange.appendChild(opt);
    });

    inputFilterRange.addEventListener("change", applyItemFilter);
    filterRange.appendChild(inputFilterRange);

    //filtro per oggetto marziale o no
    filterMartial.innerHTML = "<span style='margin-right:1em;'>Marziale</span>";
    let inputFilterMartial = document.createElement("input");
    inputFilterMartial.id = "itemFilterMartial";
    inputFilterMartial.type = "checkbox";
    inputFilterMartial.addEventListener("change", applyItemFilter);
    filterMartial.appendChild(inputFilterMartial);

    //filtro per numero di mani richieste
    filterHands.innerHTML = "<span style='margin-right:1em;'>Mani Richieste</span>";
    let inputFilterHands = document.createElement("select");
    inputFilterHands.id = "itemFilterHands";
    possFilVal.mani.forEach(function(val) {
        let opt = document.createElement("option");
        opt.value = val;
        opt.text = val;
        inputFilterHands.appendChild(opt);
    });

    inputFilterHands.addEventListener("change", applyItemFilter);
    filterHands.appendChild(inputFilterHands);

    //filtro per il tipo danno
    filterDmgType.innerHTML = "<span style='margin-right:1em;'>Tipo di Danno</span>";
    let inputFilterDmgType = document.createElement("select");
    inputFilterDmgType.id = "itemFilterDmgType";
    possFilVal.tipo_danno.forEach(function(val) {
        let opt = document.createElement("option");
        opt.value = val;
        opt.text = val;
        inputFilterDmgType.appendChild(opt);
    });

    inputFilterDmgType.addEventListener("change", applyItemFilter);
    filterDmgType.appendChild(inputFilterDmgType);

    //compilazione del blocco di filtri
    filterContainer.appendChild(filterName);
    filterContainer.appendChild(filterCategory);
    filterContainer.appendChild(filterRarity);
    filterContainer.appendChild(filterRange);
    filterContainer.appendChild(filterMartial);
    filterContainer.appendChild(filterHands);
    filterContainer.appendChild(filterDmgType);

    let whereToPut=document.getElementById("availableItems");

    if(whereToPut.firstChild){
        let oldFilters=whereToPut.firstChild
        whereToPut.insertBefore(filterContainer, oldFilters);
        whereToPut.removeChild(oldFilters);
    } else {
        whereToPut.appendChild(filterContainer);
    }
}

//applica i filtri selezionati alla lista oggetti e mostra solo quelli che rispecchiano i filtri
function applyItemFilter(e) {
    //si selezionano tutti gli elementi all'interno di availableItems aventi l'attributo "nome", che identifica sicuramente gli elementi da filtrare
    let itemCollection = document.getElementById("availableItems").querySelectorAll("[nome]");
    let filter = {};

    //si crea una proprieta' per ogni filtro che si vuole applicare
    filter.nome = document.getElementById("itemFilterName").value;
    filter.categoria = document.getElementById("itemFilterCategory").value;
    filter.rarita = document.getElementById("itemFilterRarity").value;
    filter.raggio = document.getElementById("itemFilterRange").value;
    filter.marziale = document.getElementById("itemFilterMartial").checked;
    filter.mani = document.getElementById("itemFilterHands").value;
    filter.tipo_danno = document.getElementById("itemFilterDmgType").value;


    for (let item of itemCollection) {
        let visualize = 1;

        Object.keys(filter).forEach(function(filterName) {
            let valueForItem = null;
            let filterValue = filter[filterName];

            //se l'attributo � assegnato, si prende la stringa in lowercase prima di passarla ai filtri, altrimenti si restituisce la stringa vuota
            if (!item.getAttribute(filterName)) {
                valueForItem = "";
            } else {
                valueForItem = item.getAttribute(filterName).toLowerCase();
            }

            //si applicano i filtri: la maggior parte di questi sono stringhe (derivanti dalle select e textbox), ma ci possono essere dei boolean da checkbox
            if (typeof filterValue == "string") {
                if (valueForItem.indexOf(filterValue.toLowerCase()) >= 0) {
                    visualize *= 1;
                } else {
                    visualize *= 0;
                }
            } else if (typeof filterValue == "boolean") {
				if(filterValue){
					if (valueForItem == (filterValue ? "m" : "")) {
						visualize *= 1;
					} else {
						visualize *= 0;
					}
                } else {
					visualize *= 1;
				}
            }
        });

        if (visualize == 1) {
            if (item.classList.contains("hidden")) {
                item.classList.remove("hidden");
            }
        } else {
            item.classList.add("hidden");
        }
    }

    //se i wrapper di categoria sono vuoti, si nascondono anche questi
    let allWrappers = document.getElementById("availableItems").querySelectorAll("[categoryWrapper='item']");
    for (let i = 0; i < allWrappers.length; i++) {
        if (allWrappers[i].querySelectorAll(".hidden[nome]").length == allWrappers[i].querySelectorAll("[nome]").length) { //si confrontano il numero degli elementi con attributo "nome" aventi la classe .hidden con il loro numero totale: se coincidono, allora il wrapper � vuoto e va nascosto
            allWrappers[i].classList.add("hidden");
        } else {
            if (allWrappers[i].classList.contains("hidden")) {
                allWrappers[i].classList.remove("hidden");
            }
        }
    };
}

//funzione che crea orologi da poi condividere eventualmente in lobby
function setupClock(p={}){
	let params=p
	
	if(params.description==null){
		params.description=document.getElementById("clockDescription").value.trim()!=""?document.getElementById("clockDescription").value.trim():null
	}
	
	let newClock=createNewClock(params)
	
	//tasto per eliminare l'orologio
	if(params.editable || params.editable==null){
		let icon = fetchSvgIcon("times")
		icon.style.position="absolute"
		icon.style.top="0"
		icon.style.right="0"
		icon.addEventListener("click", ()=>{
			clockList.splice(clockList.indexOf(newClock), 1)
			updateClocks()
		});
		newClock.appendChild(icon)
	}
	
	clockList.push(newClock)
	
	document.getElementById("clockDescription").value=""
	updateClocks()
	return newClock
}

//aggiorna gli orologi e li pinga
function updateClocks(){
	document.getElementById("clockList").innerHTML=""
	
	for(let i=0;i<clockList.length;i++){
		document.getElementById("clockList").appendChild(clockList[i])
	}
	shareClocks()
}

//crea un array contenente tutti i parametri degli orologi creati
function getClockParamList(){
	let res=[]
	
	for(let i=0;i<clockList.length;i++){
		let clk={}
		
		if(typeof clockList[i].clock.value != undefined){
			clk.value=clockList[i].clock.value
		}
		if(typeof clockList[i].clock.max != undefined){
			clk.max=clockList[i].clock.max
		}
		if(typeof clockList[i].clock.color != undefined){
			clk.color=clockList[i].clock.color
		}
		if(typeof clockList[i].clock.description != undefined){
			clk.description=clockList[i].clock.description
		}
		if(typeof clockList[i].clock.size != undefined){
			clk.size=clockList[i].clock.size
		}
		clk.editable=false
		
		res.push(clk)
	}
	
	return res
}

//crea griglia per l'orologio
function clockPattern(slices, s=150){
	let decimals=1000
	let size=s/1.5
	let path="M "+size+" "+size
	
	//let slices=document.getElementById("clockMax").value
	let rad=2*Math.PI/slices
	
	for(let i=0;i<slices;i++){
		path+=" L "+(Math.round(decimals*Math.cos(rad*i))/decimals*size+size)+" "+(Math.round(decimals*Math.sin(rad*i))/decimals*size+size)+" L "+size+" "+size
	}
	
	let svg= document.createElementNS("http://www.w3.org/2000/svg", "svg")
	svg.classList.add("clockGrid")
	svg.style.height=size*2+"px"
	svg.style.width=size*2+"px"
	svg.setAttribute("viewbox", "0 0 "+(size*2)+" "+(size*2))
	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
	
	let newPath= document.createElementNS("http://www.w3.org/2000/svg", "path")
	
	newPath.setAttribute("stroke", "black")
	newPath.setAttribute("stroke-width", "1")
	newPath.setAttribute("d", path)
	
	svg.appendChild(newPath)
	
	return svg
}

//crea l'orologioe i relativi controlli
function createNewClock(params={}, callbackOnChange=null){
	let newClock=document.createElement("div")
	
	newClock.value=(params.value==null?"0":params.value)
	newClock.max=(params.max==null?"4":params.max)
	newClock.color=(params.color==null?"orange":params.color)
	newClock.description=params.description
	newClock.size=(params.size==null?150:Number(params.size.toString().match(/\d+/g)))
	newClock.editable=(params.editable==null?true:params.editable)
	newClock.setValue=(params.setValue==null?true:params.setValue)
	newClock.setMax=(params.setMax==null?true:params.setMax)
	
	
	newClock.className="clock"
	newClock.style.cssText="--p:"+newClock.value+";--s:"+newClock.max+";--c:"+newClock.color+";--w:"+newClock.size+"px;"
	
	let grid=clockPattern(newClock.max, newClock.size)
	newClock.prepend(grid)
	newClock.grid=grid
	
	let newClockLabel=document.createElement("span")
	newClock.appendChild(newClockLabel)
	newClock.label=newClockLabel
	
	let clockWrapper=document.createElement("div")
	
	clockWrapper.className="clockWrapper"
	
	clockWrapper.appendChild(newClock)
	
	clockWrapper.clock=newClock
	
	//controlli dell'orologio
	let controlWrapper=document.createElement("div")
	controlWrapper.setAttribute("controls", true)
	
	if(newClock.editable){
		clockWrapper.appendChild(controlWrapper)	
	}
	
	let valueInput=document.createElement("input")
	let maxInput=document.createElement("input")
	
	valueInput.type="number"
	maxInput.type="number"
	
	valueInput.min="0"
	maxInput.min="4"
	
	valueInput.max=newClock.max
	maxInput.max="12"
	
	valueInput.value=newClock.value
	maxInput.value=newClock.max
	
	valueInput.addEventListener("change", 
		()=>{
			if(valueInput.value==""){
				valueInput.value=0
			}
			
			newClock.updateClock(valueInput.value)
		}
	)
	maxInput.addEventListener("change", 
		()=>{
			if(maxInput.value==""){
				maxInput.value=0
			}
			
			valueInput.max=maxInput.value
			
			if(Number(valueInput.value)>Number(maxInput.value)){
				valueInput.value=maxInput.value
				valueInput.max=maxInput.value
			}
			
			newClock.updateClock(valueInput.value, maxInput.value)
		}
	)
	
	//etichette controlli
	let valueLabel=document.createElement("span")
	let maxLabel=document.createElement("span")
	
	valueLabel.innerHTML="Avanzamento"
	maxLabel.innerHTML="Nr. sezioni"
		
	let valueWrapper=document.createElement("div")
	let maxWrapper=document.createElement("div")
	
	let minusValue=fetchSvgIcon("minus")
	let plusValue=fetchSvgIcon("plus")
	
	let minusMax=minusValue.cloneNode(true)
	let plusMax=plusValue.cloneNode(true)
	
	let evt = document.createEvent("HTMLEvents");
	evt.initEvent("change", false, true);
	
	minusValue.addEventListener("click", ()=>{
		valueInput.value=Math.max(Number(valueInput.min), Number(valueInput.value)-1)
		valueInput.dispatchEvent(evt);
	})
	plusValue.addEventListener("click", ()=>{
		valueInput.value=Math.min(Number(valueInput.max), Number(valueInput.value)+1)
		valueInput.dispatchEvent(evt);
	})
	
	minusMax.addEventListener("click", ()=>{
		maxInput.value=Math.max(Number(maxInput.min), Number(maxInput.value)-1)
		maxInput.dispatchEvent(evt);
	})
	plusMax.addEventListener("click", ()=>{
		maxInput.value=Math.min(Number(maxInput.max), Number(maxInput.value)+1)
		maxInput.dispatchEvent(evt);
	})
	
	if(newClock.setValue){
		controlWrapper.appendChild(valueLabel)	
		valueWrapper.appendChild(minusValue)	
		valueWrapper.appendChild(valueInput)	
		valueWrapper.appendChild(plusValue)	
		controlWrapper.appendChild(valueWrapper)	
	}
	
	if(newClock.setMax){
		controlWrapper.appendChild(maxLabel)
		maxWrapper.appendChild(minusMax)
		maxWrapper.appendChild(maxInput)
		maxWrapper.appendChild(plusMax)
		controlWrapper.appendChild(maxWrapper)
	}
	
	newClock.valueInput=valueInput
	newClock.maxInput=maxInput
	
	//descrizione dell'orologio
	if(newClock.description!=null){
		let description=document.createElement("div")
		description.innerHTML=newClock.description
		description.setAttribute("description", true)
		clockWrapper.appendChild(description)
	}
	
	//funzioni dell'orologio
	newClock.editCssString=function (value, param){
		let cssTxt=newClock.style.cssText.replace(/ /gi, "").split(";")
		cssTxt[cssTxt.indexOf(cssTxt.find(r=>r.substr(0, 3)===param))]=param+":"+value
		newClock.style.cssText=cssTxt.join(";")
	}

	newClock.setclockValue=function (val=null, max=null){
		if(max!=null){
			newClock.setMaxSlice(max)
		}
		
		let value=(val==null?Math.min(Number(newClock.value),Number(newClock.max)):val)
		
		newClock.editCssString(value, "--p")
		newClock.value=value
		
		newClockLabel.innerHTML=value+"/"+newClock.max
		
		newClock.checkMax()
	}

	newClock.setMaxSlice=function (max){
		if(max!==null){
			newClock.editCssString(max, "--s")
			newClock.max=max
			
			let grid=clockPattern(newClock.max, newClock.size)
			newClock.removeChild(newClock.grid)
			newClock.prepend(grid)
			newClock.grid=grid
			newClock.checkMax()
		}
	}
	
	newClock.checkMax=function (){
		if(Number(newClock.value)>=Number(newClock.max)){
			newClock.classList.add("clockFull")
		} else {
			newClock.classList.remove("clockFull")
		}
	}

	newClock.updateClock= function (value=null, max=null){
		newClock.setclockValue(value, max)
		shareClocks()
		
		if(callbackOnChange!=null){
			callbackOnChange(newClock)
		}
	}
	
	newClock.updateClock()
	return clockWrapper
}

//creazione orologio specifico per i poteri zero
function zeroPowerClock(){
	return createNewClock(
		{
			max:"6", 
			description:null, 
			value:characterInfo.zeroPowerProgress,
			setMax:false
		}, 
		(clk)=>{characterInfo.zeroPowerProgress=clk.value}
	)
}

//la funzione crea un tracker strutturato per tenere traccia dei punteggi
function createTracker(score, editable=true, leVar=null) {
    //si definisce per ogni punteggio delle caratteristiche necessarie alla costruzione del tracker
    const headName = {
        fabula: { tag: "Punti Fabula", icon_id: "book", icon_class: "falt", icon_src: "book-open", icon_fn: null },
        hp: { tag: "Punti Vita", icon_id: "heart", icon_class: "falt", icon_src: "heartbeat", icon_fn: e => heal() },
        mp: { tag: "Punti Mente", icon_id: "mind", icon_class: "falt", icon_src: "brain", icon_fn: e => refresh() },
        ip: { tag: "Punti Inventario", icon_id: "ipIcon", icon_class: "falt", icon_src: "briefcase", icon_fn: null },
        clock: { tag: "Orologio", icon_id: "", icon_class: "falt", icon_src: "clock", icon_fn: null }
    }

    //se il punteggio indicato � valido
    if (headName[score]) {
        let newPart = document.createElement("div");
        newPart.className = "scoreTracker";

        //testata del tracker
        let head = document.createElement("div");
        head.innerHTML = headName[score].tag;
        newPart.appendChild(head)

        //corpo del tracker, composto da due frecce (il + e il -), l'icona con eventuale evento associato, il numero di riferimento e l'input numero per la modifica manuale
        let center = document.createElement("div");
        center.style.display = "flex";
        center.style.fontSize = "2rem";
        center.style.lineHeight = "100%";

        let icon = fetchSvgIcon(headName[score].icon_src)
        icon.id = headName[score].icon_id;
        icon.style.margin = "auto";
        icon.className = headName[score].icon_class;
        icon.addEventListener("click", headName[score].icon_fn);
        center.appendChild(icon)

        //funzione che consente di visualizzare alternativamente il punteggio fisso o l'elemento input per la modifica diretta del numero
        //function switchView(e) {
        function switchView(viewer, input) {
			if (input.style.display == "none") {
				input.style.removeProperty("display");
				viewer.style.display = "none";
			} else {
				input.style.display = "none";
				viewer.style.removeProperty("display");
			}
        }

        let curVal = document.createElement("div");
        curVal.id = "tracker_" + score;
        curVal.style.margin = "auto";
        curVal.crossRef = score;
        center.appendChild(curVal)

		let manualInput = document.createElement("input");
		manualInput.type = "Number";
		manualInput.min = 0;
		manualInput.id = score;
		manualInput.style.display = "none";
		center.appendChild(manualInput)
		
		let refValue=null
		
		if(typeof characterInfo[score] !== "undefined"){
			refValue=characterInfo[score]
		} else {
			if(leVar!=null){
				refValue=leVar
			}
		}
		
		newPart.viewer=curVal
		newPart.input=manualInput
		newPart.refObj=refValue
		
        curVal.innerHTML = refValue.current;
		
		let plus = null
		let minus = null

        if(editable){
			curVal.addEventListener("dblclick", ()=>{switchView(curVal, manualInput)});
			
			manualInput.value = newPart.refObj.current;
			manualInput.addEventListener("change", (e)=>{refreshTracker(newPart, manualInput.value)});
			manualInput.addEventListener("keydown", (e)=>{
				if (e.code == "Enter" || e.code == "NumpadEnter" || e.code == "Tab" || e.keyCode === 13) { 
					//si attiva solo se viene premuto uno dei tasti invio o tab
					document.activeElement.blur();
				}
			});
			manualInput.addEventListener("blur", ()=>{switchView(curVal, manualInput)});
			manualInput.addEventListener("dblclick", ()=>{switchView(curVal, manualInput)});
			
			minus = document.createElement("div");
			minus.style.fontSize = "1rem";
			minus.style.cursor = "pointer";
			minus.style.userSelect = "none";
			minus.innerHTML = "<";
			minus.score = score
			//evento per togliere un singolo numero dal punteggio
			minus.addEventListener("click", function(e) {
				refreshTracker(newPart, newPart.refObj.current-1)
			});
			//evento per togliere punti in modo continuativo
			minus.addEventListener("mousedown", async function(e) {
				keptPressed = true;
				await sleep(500);
				while (keptPressed) {
					refreshTracker(newPart, newPart.refObj.current-1);

					if (newPart.input.value == Math.max(newPart.input.min, Number(newPart.input.value) - 1)) {
						break;
					} else {
						await sleep(50);
					}
				};
			});
			//evento per interrompere l'evento mousedown
			minus.addEventListener("mouseup", function(e) {
				keptPressed = false;
			});
			minus.addEventListener('contextmenu', e => e.preventDefault());
			minus.setAttribute("preventContext", true)
			center.prepend(minus)
			
			plus = document.createElement("div");
			plus.style.fontSize = "1rem";
			plus.style.cursor = "pointer";
			plus.style.userSelect = "none";
			plus.innerHTML = ">";
			plus.score = score
			//evento per aggiungere un singolo numero al punteggio
			plus.addEventListener("click", function(e) {
				refreshTracker(newPart, newPart.refObj.current+1);
			});
			//evento per aggiungere punti in modo continuativo
			plus.addEventListener("mousedown", async function(e) {
				keptPressed = true;
				await sleep(500);
				while (keptPressed) {
					refreshTracker(newPart, newPart.refObj.current+1);

					if (newPart.input.value == Math.min((newPart.input.max ? newPart.input.max : Infinity), Number(newPart.input.value) + 1)) {
						break;
					} else {
						await sleep(50);
					}
				};
			});
			//evento per interrompere l'evento mousedown
			plus.addEventListener("mouseup", function(e) {
				keptPressed = false;
			});
			plus.addEventListener('contextmenu', e => e.preventDefault());
			plus.setAttribute("preventContext", true)
			center.appendChild(plus)
			
		}

        newPart.appendChild(center)

        //footer del tracker, dove si indica il massimo valore, se esiste
        let foot = document.createElement("div");
        foot.style.fontSize = "1rem";
        if (newPart.refObj.max) {
            foot.innerHTML = "Max: " + (Number(newPart.refObj.max) + Number(newPart.refObj.mod));
			
			if(editable){
				manualInput.max = Number(newPart.refObj.max) + Number(newPart.refObj.mod);
				
				foot.title="Fai doppio click per cambiare il modificatore";
				foot.style.cursor="pointer"
				foot.style.display="flex";
				foot.style.alignItems="center";
				foot.style.justifyContent="center";
				foot.addEventListener("dblclick", function(e) { addMod(e.target, newPart.refObj); })
			}
        }
        newPart.appendChild(foot);
		
		newPart.textForChat={
			get value(){
				let text= "\n**"+headName[score].tag+"**";
				let targetScore = {};
				targetScore.target = document.getElementById(score);
				
				text+="\nValore attuale: "+targetScore.target.value+(targetScore.target.max?"/"+targetScore.target.max:"")

				return text;
			}
		}
		
		newPart.addEventListener("contextmenu", 
			function(e){
				buildContextMenu(newPart, [e.clientX, e.clientY], {chatInter:true});
				e.preventDefault(e);
			}
		);

        return newPart;
    } else return null;
}

//salva i dati del personaggio nella cache locale (IndexedDB), usando il nome PG come chiave univoca
async function saveCharacter(auto=false) {
    //si presuppone un solo personaggio per ogni nome
    FUDB.chars.get(characterInfo.name,
        function(result) { //se si trova il personaggio, viene eseguita la funzione onSuccessFn di aggiornamento dati
            let doSave=false
            if (auto) {
                doSave=true
            } else {
                doSave=window.confirm("Salvando si sovrascriveranno i dati gia' presenti: continuare?");
            }

            if(doSave){
                FUDB.chars.update({ id: characterInfo.name, data: JSON.stringify(characterInfo) })
            }
        },
        function() { //se non si trova il personaggio, viene eseguita la funzione onErrorFn di inserimento dati
            FUDB.chars.add({ id: characterInfo.name, data: JSON.stringify(characterInfo) });
            //si aggiorna la lista dei personaggi
            updateListFromDB(document.getElementById("listOfChars"), "chars");
        }
    );
}

//recupera e visualizza i dati del personaggio dalla cache, in base al nome selezionato nel menu
async function loadCharacter(loadedData) {
    //per evitare problemi di compatibilita' in caso di variazioni nella struttura di characterInfo, si caricano le proprieta' una per una. Si assume che, a parita' di proprieta', non ci siano differenze significative nella struttura e nel funzionamento delle stesse
    Object.keys(characterInfo).forEach(function(prop) {
        if (loadedData.hasOwnProperty(prop)) {
            characterInfo[prop] = loadedData[prop];
        }
    });
    
    if(typeof characterInfo.autosave !=="undefined"){
        document.getElementById("autosaveFlag").checked=characterInfo.autosave
    }

    updateSheet();
}

//elimina i dati del personaggio dalla cache, in base al nome selezionato nel menu
async function deleteCharacter() {
	if(window.confirm("La cancellazione � irreversibile: continuare?")){
		let listOfChars=document.getElementById("listOfChars");
		if (listOfChars.value) {
			let idx=listOfChars.selectedIndex;
			//si presuppone un solo personaggio per ogni nome
			FUDB.chars.delete(listOfChars.value, 
				function(){
					listOfChars.remove(idx);
				}
			);
		} else {
			console.log("Nessun nome di personaggio da eliminare.");
		}
    }
}

//scarica il JSON stringificato contenente i dati del personaggio, e li salva in un file json localmente (come download file da browser)
async function download() {
    let file = new Blob([JSON.stringify(characterInfo)], { type: 'text/plain' });
    console.log(JSON.stringify(characterInfo))
	if(typeof Capacitor !== 'undefined'){  
        if(typeof Capacitor.Plugins.Filesystem !== 'undefined'){
            //Capacitor.Plugins.Device.getInfo().then(device=>alert(device.platform))
            /*Capacitor.Plugins.Clipboard.write({
                string: JSON.stringify(characterInfo)
            }).then(
                console.log("Copied from clipboard")
            )*/

            /*Capacitor.Plugins.Filesystem.writeFile({
                path: "file:///storage/emulated/0/Download/text.txt",
                data: "test"
                //directory: "file://storage/emulated/0/Download/"//FilesystemDirectory.Data
            }).then(alert("Done"))*/
            return
        }
	}
    
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = characterInfo.name + '.fabula';
    a.click();
}

//ripulisce eventuali stringhe nocive dal testo
function sanitizeString(str){
    return str.replace("<script","").replace("</script","").replace("<a","").replace("</a","").replace("onclick=","").replace("href=","")
}

//recupera e visualizza i dati del personaggio dalla cache, in base al nome impostato nella casella del nome della scheda
async function fetchCharFromMemory() {
    let listOfChars=document.getElementById("listOfChars");
    if (listOfChars.value) {
        //si presuppone un solo personaggio per ogni nome
        FUDB.chars.get(listOfChars.value,
            function(result) { //se si trova il personaggio, viene eseguita la funzione onSuccessFn di caricamento dati
                console.log("Caricamento in corso...");
                let cleanData=sanitizeString(result.data)
                let loadedData = JSON.parse(cleanData);
                loadCharacter(loadedData);
                console.log("Caricamento completato.");
            },
            function() { //se non si trova il personaggio, viene restituito un messaggio di errore
                console.log("Nessun personaggio da caricare.");
            }
        );
    } else {
        console.log("Nessun nome di personaggio da caricare.");
    }
}

//carica in memoria i dati json da file salvato localmente, e li visualizza
function upload() {
    if (this.files && this.files[0]) {
        var myFile = this.files[0];
        var reader = new FileReader();

        reader.addEventListener('load', function(e) {
            let cleanData=sanitizeString(e.target.result)
            let loadedData = JSON.parse(cleanData);

            loadCharacter(loadedData);
            document.getElementById("charLoader").value = ""
        });

        reader.readAsText(myFile);
    }
}

//memorizza in base all'input utente quale libreria caricare di default all'avvio dell'editor
async function saveDefaultLibrary() {
    //si presuppone una sola libreria per ogni nome
    if(document.getElementById("listOfLibraries").value){
        let defaultLib=document.getElementById("listOfLibraries").value;

        FUDB.chosenSet.get("default",
            function(result) { //se si trova la libreria, viene eseguita la funzione onSuccessFn di aggiornamento dati
                FUDB.chosenSet.update({ id: "default", data: defaultLib });
                alert("Libreria "+defaultLib+" impostata come default.")
                console.log("Libreria preferita modificata.")
            },
            function() { //se non si trova la libreria, viene eseguita la funzione onErrorFn di inserimento dati
                FUDB.chosenSet.add({ id: "default", data: defaultLib });
                alert("Libreria "+defaultLib+" impostata come default.")
                console.log("Libreria preferita definita.")
            }
        );
    }
}

//carica la libreria di default, se definita
async function loadDefaultLibrary() {
    FUDB.chosenSet.get("default",
        function(result) { //se si trova la libreria, viene eseguita la funzione onSuccessFn di aggiornamento dati
            document.getElementById("listOfLibraries").value=result.data;
            fetchLibraryFromMemory(result.data);
        },
        function() { //se non si trova la libreria, viene eseguita la funzione onErrorFn di inserimento dati
            console.log("Nessuna libreria preferita definita.")
        }
    );
}

//prompt per il salvataggio delle modifiche alla libreria
function saveLibraryPrompt(){
    data.id= window.prompt("Indicare il nome della libreria da archiviare.",data.id)
    saveLibrary();
}

//salva i dati della libreria nella cache locale (IndexedDB), usando il nome libreria come chiave univoca
async function saveLibrary() {
    //si presuppone una sola libreria per ogni nome
    if(data.hasOwnProperty("id")){
        FUDB.libraries.get(data.id,
            function(result) { //se si trova la libreria, viene eseguita la funzione onSuccessFn di aggiornamento dati
                if (window.confirm("Salvando si sovrascriveranno i dati gia' presenti: continuare?")) {
                    FUDB.libraries.update({ id: data.id, data: JSON.stringify(data) })
                    setLibraryToBeSaved(false);
                }
            },
            function() { //se non si trova la libreria, viene eseguita la funzione onErrorFn di inserimento dati
                FUDB.libraries.add({ id: data.id, data: JSON.stringify(data) });
                //si aggiorna la lista di librerie
                updateListFromDB(document.getElementById("listOfLibraries"), "libraries");
                setLibraryToBeSaved(false);
            }
        );
    }
}

//recupera e visualizza i dati della libreria dalla cache, in base al nome libreria selezionato nel menu
async function loadLibrary(loadedData) {
    data = loadedData;
    //alert("Libreria "+loadedData.id+" caricata.")
	addChatLine("Info", "Libreria "+loadedData.id+" caricata.")
    document.getElementById("curLibraryName").innerHTML="Libreria corrente: <b>"+loadedData.id+"</b>"
    updateSheet();
}

//elimina i dati libreria dalla cache, in base al nome libreria selezionato nel menu
async function deleteLibrary() {
	if(window.confirm("La cancellazione � irreversibile: continuare?")){
		let listOfLibs=document.getElementById("listOfLibraries");
		if (listOfLibs.value) {
			let idx=listOfLibs.selectedIndex;
			//si presuppone una sola libreria per ogni nome
			FUDB.libraries.delete(listOfLibs.value, 
				function(){
					let idToDelete=data.id;
					FUDB.chosenSet.get("default",
						function(result) { //se si trova la libreria, viene eseguita la funzione onSuccessFn di aggiornamento dati
							if(idToDelete==result.data){
								FUDB.libraries.delete("default", 
									function(){
										console.log("Rimossa libreria di default.")
									}
								);
							}
						},
						function() {}
					);

					if(idToDelete==listOfLibs.value){
						data=defaultData;
						updateSheet();
					}
					listOfLibs.remove(idx);
				}
			);
		} else {
			console.log("Nessuna libreria da eliminare.");
		}
    }
}

//scarica il JSON stringificato contenente i dati della libreria caricata attualmente in cache, e li salva in un file json localmente (come download file da browser)
function downloadLibrary() {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(data)], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = data.id + '.fudb';
    a.click();
}

//recupera e visualizza i dati della libreria dalla cache, in base al nome impostato nella casella del nome della scheda
async function fetchLibraryFromMemory(libName=null) {
    if(!libName){
        libName=document.getElementById("listOfLibraries").value;
    }
    if (libName!=null) {
        //si presuppone una sola libreria per ogni nome
        FUDB.libraries.get(libName,
            function(result) { //se si trova la libreria, viene eseguita la funzione onSuccessFn di caricamento dati
                console.log("Caricamento in corso...");
                let loadedData = JSON.parse(result.data);
                loadLibrary(loadedData);
                itemFilters();
                console.log("Caricamento completato.");
				populateEditorSelect();
				
				if(document.getElementById("confirmObjectToEdit").innerHTML=="Annulla"){
					document.getElementById("confirmObjectToEdit").click()
				}
				
				if(characterInfo.inventory.length>0 || characterInfo.skills.length>0){
					if (window.confirm("Rilevato un personaggio in memoria: si vuole verificare se ci sono aggiornamenti da eseguire?")) {
						checkCharacterUpdate()
					}
				}
            },
            function() { //se non si trova il personaggio, viene restituito un messaggio di errore
                console.log("Nessuna libreria da caricare.");
            }
        );
    } else {
        console.log("Nessuna libreria da caricare.");
    }
}

//controlla se gli oggetti in inventario e le abilità acquisite dal personaggio in memoria sono diverse da quelle caricate in libreria, e chiede se sostituire, nel caso
function checkCharacterUpdate(){
	let lookUp=null
	
	//check inventario
	for(let i=0;i<characterInfo.inventory.length;i++){
		let inv=characterInfo.inventory[i]
		lookUp=data.items.filter(it=>it.NOME===inv.NOME)
		if(lookUp.length>0){
			Object.keys(inv).forEach(
				(prop)=>{
					if(inv[prop]!==lookUp[0][prop] && (typeof inv[prop]!="undefined" && typeof lookUp[0][prop]!="undefined" ) && (typeof inv[prop]!="object" && typeof lookUp[0][prop]!="object" )){
						if (window.confirm("Trovata differenza in oggetto '"+lookUp[0].NOME+"', proprietà '"+prop+"': valore attuale '"+inv[prop]+"', valore nuovo '"+lookUp[0][prop]+"'. Sostituire?")) {
							inv[prop]=lookUp[0][prop]
						}
					}
				}
			)
		}
	}
	
	//check abilità
	for(let j=0;j<characterInfo.skills.length;j++){
		let skl=characterInfo.skills[j]
		lookUp=data.abilities.filter(it=>it.NOME===skl.NOME)
		if(lookUp.length>0){
			Object.keys(skl).forEach(
				(prop)=>{
					if(skl[prop]!==lookUp[0][prop] && (typeof skl[prop]!=="undefined" && typeof lookUp[0][prop]!=="undefined" ) && (typeof skl[prop]!=="object" && typeof lookUp[0][prop]!=="object" )){
						if (window.confirm("Trovata differenza in oggetto '"+lookUp[0].NOME+"', proprietà '"+prop+"': valore attuale '"+skl[prop]+"', valore nuovo '"+lookUp[0][prop]+"'. Sostituire?")) {
							skl[prop]=lookUp[0][prop]
						}
					}
				}
			)
		}
	}
	
	updateSheet()
	
	/*Object.keys(data.editorTags[document.getElementById("selectListToEdit").value.toUpperCase()]).forEach(
				(prop)=>{
					if(prop==="NOME"){
						tempEntry[prop]="Nuovo..."
					} else {
						tempEntry[prop]=""
					}
				}
			)*/
}

//carica in memoria i dati libreria da file salvato localmente, e li visualizza
function uploadLibrary() {
    if (this.files && this.files[0]) {
        var myFile = this.files[0];
        var reader = new FileReader();

        reader.addEventListener('load', function(e) {
            data = JSON.parse(e.target.result);
            saveLibrary()
            updateSheet();
            document.getElementById("libraryLoader").value = ""
        });

        reader.readAsText(myFile);
    }
}

//carica uno script da file salvato localmente
function loadMod() {
    if (this.files && this.files[0]) {
        var myFile = this.files[0];
        var reader = new FileReader();

        reader.addEventListener('load', function(e) {
            let newScript=null

            if (typeof(document.getElementById("importedLib")) != 'undefined' && document.getElementById("importedLib") != null){
                newScript=document.getElementById("importedLib");
            } else {
                newScript=document.createElement("script");
                newScript.id="importedLib";
                document.getElementsByTagName('head')[0].appendChild(newScript);
            }
            
            newScript.innerHTML=e.target.result;
        });

        reader.readAsText(myFile);
    }
}

//funzione per eventi asincroni e ciclici
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//funzione per caricare l'immagine PG sul file dati del personaggio
function encodeImage(element, callbackFunction) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        callbackFunction(reader.result)
    }
    reader.readAsDataURL(file);
}

//funzione che aggiorna l'immagine profilo
function refreshProfileImage() {
    if (characterInfo.hasOwnProperty("img") && characterInfo.img!="") {
        let img = document.createElement("img");
        img.style.margin = "0.5em";
        img.style.maxHeight = "25em";
        img.style.maxWidth = "var(-webkit-fill-available, -moz-available)";
        img.src = characterInfo.img;
        document.getElementById("profileImage").innerHTML = "";

        let popup = document.createElement("div");
        let icon = fetchSvgIcon("times");
        icon.style.width = "3em";
        icon.style.height = "3em";
        popup.appendChild(icon);
        popup.addEventListener("click", function() {
            characterInfo.img = "";
            document.getElementById("profileImage").innerHTML = "";
        });
        popup.className = "popupMenu";
		
		img.textForChat={
			get value(){
				let text= img.outerHTML
				return text;
			}
		}
		
		img.addEventListener("contextmenu", 
			function(e){
				buildContextMenu(img, [e.clientX, e.clientY], {chatInter:true});
				e.preventDefault(e);
			}
		);
		
        document.getElementById("profileImage").appendChild(popup);
        document.getElementById("profileImage").appendChild(img)
    } else {
        document.getElementById("profileImage").innerHTML="";
    }
}

//funzione per cambiare il colore della scheda
function editPalette(refColor = characterInfo.sheetColor) {
    let baseCol = pSBC(0, refColor, "c"); //colore base
    let lighterCol = pSBC(0.5, refColor, "c"); //colore degli infoblock, piu' chiaro
    let darkCol = pSBC(-0.5, refColor, "c"); //colore degli elementi in rilievo, piu' scuro
    let darkerCol = pSBC(-0.9, refColor, "c"); //colore dei bordi e del testo delle testate, ancora piu' scuro*/

    let targetRuleSet = null;
    targetRuleSet = document.getElementById("FUSpecificStyle").sheet.cssRules;

    if (targetRuleSet) {
        targetRuleSet[0].style.backgroundColor = lighterCol; //colore background
        targetRuleSet[0].style.color = (getBrightness(lighterCol) > 125) ? 'black' : 'white'; //colore testo
        
        targetRuleSet[1].style.backgroundColor = baseCol; //colore background
        targetRuleSet[1].style.color = (getBrightness(baseCol) > 125) ? 'black' : 'white'; //colore testo
        
        targetRuleSet[2].style.backgroundColor = darkCol; //colore background
        targetRuleSet[2].style.color = (getBrightness(darkCol) > 125) ? 'black' : 'white'; //colore testo

        targetRuleSet[3].style.borderColor = darkerCol; //colore background
        
        targetRuleSet[4].style.filter = (getBrightness(lighterCol) > 125) ? 'brightness(0) saturate(100%)' : 'invert(100%)'; //colore svg
        targetRuleSet[5].style.filter = (getBrightness(baseCol) > 125) ? 'brightness(0) saturate(100%)' : 'invert(100%)'; //colore svg
        targetRuleSet[6].style.filter = (getBrightness(darkCol) > 125) ? 'brightness(0) saturate(100%)' : 'invert(100%)'; //colore svg
    }
}

//funzione per identificare la chiarezza di un colore RGB
function getBrightness(RGB) {
    let rgbElements = RGB.split("(")[1].split(")")[0].split(",");
    return Math.round(((rgbElements[0] * 299) +
        (rgbElements[1] * 587) +
        (rgbElements[2] * 114)) / 1000);
}

//funzione per gestire il colore di riferimento e i secondari
const pSBC = (p, c0, c1, l) => {
    let r, g, b, P, f, t, h, i = parseInt,
        m = Math.round,
        a = typeof(c1) == "string";
    if (typeof(p) != "number" || p < -1 || p > 1 || typeof(c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length,
            x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        }
        return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}

//funzione per convertire in caratteri HTML-safe il testo contenuto nei dati
function encodeHTML(str) {
    return str.replace(/[\u00A0-\u9999\&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
}

//funzione alternativa al document.getElementById
function getElementByFUId(id) {
    return document.querySelectorAll("[fuid='" + id + "']")[0];
}

//funzione che ritrova i dati memorizzati e li usa per prepopolare le list dropdown nel menu
function fetchMemoryData(){
    let charList=document.getElementById("listOfChars");
    let libList=document.getElementById("listOfLibraries");

    //si ritrovano i dati dei personaggi
    updateListFromDB(charList, "chars");

    //si ritrovano i dati delle librerie caricate
    updateListFromDB(libList, "libraries");
}

function updateListFromDB(target, tab){
    FUDB[tab].keys(
        function(result){
            populateSelect(target, result);
        }
    );
}

function populateSelect(target, result){
    if(result.length>0){
        target.innerHTML="";
        result.forEach(function(it, i){
            let opt=document.createElement("option")
            if(it.NOME!==undefined){
                opt.refObj = it;
                opt.value = it.NOME;
                opt.text = it.NOME;
            } else {
                opt.value = it;
                opt.text = it;
            }
            target.appendChild(opt);
        })
    }
}

function populateEditorSelect(){
	if(!data[document.getElementById("selectListToEdit").value]){
		if(data.editorTags[document.getElementById("selectListToEdit").value.toUpperCase()]){
			let tempEntry={}
			
			Object.keys(data.editorTags[document.getElementById("selectListToEdit").value.toUpperCase()]).forEach(
				(prop)=>{
					if(prop==="NOME"){
						tempEntry[prop]="Nuovo..."
					} else {
						tempEntry[prop]=""
					}
				}
			)
			
			data[document.getElementById("selectListToEdit").value]=[tempEntry]
		} else {
			return false
		}
	}
	
    if(data[document.getElementById("selectListToEdit").value].length>0){
        document.getElementById("listToEdit").innerHTML="";
        data[document.getElementById("selectListToEdit").value].forEach(function(it, i){
            let opt=document.createElement("option")
            if(it.NOME!==undefined){
                opt.value = it.NOME;
                opt.text = it.NOME;
                opt.refObj=it;
            } else {
                opt.value = it;
                opt.text = it;
                opt.refObj={
                    arr: data[document.getElementById("selectListToEdit").value],
                    idx: i,
                    NOME: it.toLowerCase()
                };
            }
            document.getElementById("listToEdit").appendChild(opt);
        })
    }
}

function setLibraryToBeSaved(flag){
    if(flag){
        document.getElementById("curLibraryName").innerHTML="Libreria corrente: <b style='color:red;'>"+data.id+" - ci sono modifiche non salvate</b>" 
        document.getElementById("saveLib").style.removeProperty("display");
    } else {
        document.getElementById("curLibraryName").innerHTML="Libreria corrente: <b>"+data.id+"</b>" 
        document.getElementById("saveLib").style.display="none";
    }
}

function selectToolkitMode(func){
    let allVariables = document.getElementById("FUToolkit").querySelectorAll("[modeSelector]");

    if(func=="charSheet"){
        document.getElementById("selectCharacterMode").setAttribute("selected", "true");
        document.getElementById("selectLibraryMode").removeAttribute("selected");
        document.getElementById("selectBestiaryMode").removeAttribute("selected");
    } else if(func=="library"){
        document.getElementById("selectCharacterMode").removeAttribute("selected");
        document.getElementById("selectLibraryMode").setAttribute("selected", "true");
        document.getElementById("selectBestiaryMode").removeAttribute("selected");
    } else if(func=="bestiary"){
        document.getElementById("selectCharacterMode").removeAttribute("selected");
        document.getElementById("selectLibraryMode").removeAttribute("selected");
        document.getElementById("selectBestiaryMode").setAttribute("selected", "true");
    }

    for (let i = 0; i < allVariables.length; i++) {
        let show=false;
        if (allVariables[i].getAttribute("modeSelector")==func){
            show=true;
        }

        if(show){
            allVariables[i].style.removeProperty("display");
        } else {
            allVariables[i].style.display="none"
        }
    };
}

//resituisce un nome con un numero progressivo, relativamente all'array passato come secondo argomento - usato per la duplicazione degli elementi in libreria
function progressiveNaming(name, arr){
    let verNumber=0;
    let curNumber="";
    let newName="";

    if(name.endsWith(")") && name.lastIndexOf("(")>-1){
        curNumber=name.substring(name.lastIndexOf("("));
        verNumber=Number(curNumber.substring(1, curNumber.length-1));
    }
    newName=(curNumber==""?name+" ("+(verNumber+1)+")":name.replace(curNumber, "("+(verNumber+1)+")"));

    if(arr.includes(newName)){
        newName=progressiveNaming(newName, arr)
    }

    return newName
}

//mostra nel menu lobby gli elementi selezionati
function showLobby(mode){
	if(mode=='join'){
		document.getElementById("lobbyCreator").disabled=false
		document.getElementById("lobbyUser").disabled=true
		//document.getElementById("passwordControl").style.display="none"
		document.getElementById("lobbyJoin").style.removeProperty("display")
		document.getElementById("lobbyMake").style.display="none"
	} else if(mode=='make'){
		document.getElementById("lobbyCreator").disabled=true
		document.getElementById("lobbyUser").disabled=false
		//document.getElementById("passwordControl").style.removeProperty("display")
		document.getElementById("lobbyMake").style.removeProperty("display")
		document.getElementById("lobbyJoin").style.display="none"
	}
}

function disableLobbySelector(){
	let showMake=document.getElementById("lobbyCreator")
	let showJoin=document.getElementById("lobbyUser")
	let showLobbyName=document.getElementById("lobbyName")
	let showUserName=document.getElementById("userName")
	let showConnect=document.getElementById("connect")
	let showDisconnect=document.getElementById("disconnect")
	let newLobby=document.getElementById("startLobby")
	let lobbyId=document.getElementById("idLobby")
	
	if(p2p.peer!=null){
		showMake.disabled=true
		showJoin.disabled=true
		showLobbyName.disabled=true
		showUserName.disabled=true
		showConnect.disabled=true
		showDisconnect.disabled=false
		newLobby.disabled=true
		lobbyId.disabled=true
		
		document.getElementById("charSharer").style.removeProperty("display")
		document.getElementById("libSharer").style.removeProperty("display")
	} else {
		showMake.disabled=false
		showJoin.disabled=false
		showLobbyName.disabled=false
		showUserName.disabled=false
		showConnect.disabled=false
		showDisconnect.disabled=true
		newLobby.disabled=false
		lobbyId.disabled=false
		
		document.getElementById("charSharer").style.display="none"
		document.getElementById("libSharer").style.display="none"
		
		document.getElementById("usListChar").innerHTML=""
		document.getElementById("usListLib").innerHTML=""
	}
}

//manda un messaggio in chat
function sendMessage(mess=null, sender=null){
	let msg=""
	
	if(mess===null){
		msg=document.getElementById("msgToSend").value.trim()
	} else{
		msg=mess.toString()
	}
	
	if(msg!=""){
		if(p2p.peer == null){
			addChatLine("I", msg)
		} else {
			broadcastMessage(msg)
		}
	}
	document.getElementById("msgToSend").value=""
	document.getElementById("msgToSend").focus()
}


//costruisce e restituisce l'elemento di messaggio in chat, anche in ricezione da altre persone
function addChatLine(sender, msg){
	if(msg!=""){
		let newLine=document.createElement("span")
		newLine.innerHTML="<b>"+sender+"</b>: "+msg.toString()
		newLine.className="chatLine"
		document.getElementById("chatLog").appendChild(newLine)
		document.getElementById("chatLog").scrollTo(0, document.getElementById("chatLog").scrollHeight)
		
		if (typeof msg === 'string' || msg instanceof String){
			//se � un tiro di dado
			if(msg.substring(0, 3).toLowerCase()==="/r "){
				if(p2p.peer == null || (p2p.peer != null && p2p.master)){
					let roll=rollEngine(sender, msg)		
					let listOfRolls=roll.listOfRolls		
					
					let rollTemplate=document.createElement("span")
					rollTemplate.className="chatLine"
					
					let r1=rollTemplate.cloneNode(true)
					let r2=rollTemplate.cloneNode(true)
					let r3=rollTemplate.cloneNode(true)
					
					r1.innerHTML=listOfRolls
					r2.innerHTML="Rolled a " + roll.total + "!"
					
					//se sono stati tirati due dadi e i due tiri sono uguali
					if(roll.rolls.filter(r=>r.max != null).length==2 && roll.rolls.filter(r=>r.value==roll.rolls.reduce((partialSum, a) => partialSum + a.value, 0)/2).length==2){
						let critTxt=""
						
						if(roll.rolls.filter(r=>r.value>=6).length==2){
							critTxt="<span style='color:green;'>["+sender+"] Critico!</span>"
						} else if(roll.rolls.filter(r=>r.value==1).length==2){
							critTxt="<span style='color:red;'>["+sender+"] Fallimento critico!</span>"
						} else if(hasAbility(characterInfo, "FRENESIA")){
							critTxt="<span style='color:lime;'>["+sender+"] Critico (Frenesia)!</span>"
						}
						
						broadcastMessage(critTxt, "RollEngine")						
						r3.innerHTML=critTxt
					}
					
					if(waitForCallback>0){
						document.getElementById("rollResult").appendChild(r1)
						document.getElementById("rollResult").appendChild(r2)
						document.getElementById("rollResult").appendChild(r3)
						waitForCallback=0
					}
				}
			}
			
			if(waitForCallback>0 && newLine.innerHTML.search(">"+p2p.userName+"<")>-1 && sender=="RollEngine"){
				document.getElementById("rollResult").appendChild(newLine.cloneNode(true))
				waitForCallback--
			}
		}
		
		//aggiunge animazione al tasto della chat, come notifica
		if(document.getElementById("FUChat").style.display=="none"){
			document.getElementById("openChat").classList.add("chatNotification")
		}
		
		return newLine
	}
	
	return null
}

//restituisce un intero casuale tra 1 e un valore massimo
function randomInt(max){
	return Math.floor(Math.random() * (max))+1;
}

//gestisce l'emissione dei tiri di dado
function rollEngine(sender, msg){
	let roll=rollDice(msg)
	
	roll.listOfRolls=""
	
	for(let i=0;i<roll.rolls.length;i++){
		if(roll.listOfRolls!=""){
			if(roll.rolls[i].positive){
				roll.listOfRolls+=" + "
			} else {
				roll.listOfRolls+=" - "
			}
		}
		roll.listOfRolls+=roll.rolls[i].value + (roll.rolls[i].max?"(d" + roll.rolls[i].max + ")":"")
	}
	
	broadcastMessage("["+sender+"] "+roll.listOfRolls, "RollEngine")
	broadcastMessage("["+sender+"] " + " rolled a " + roll.total + "!", "RollEngine")
	
	return roll
}

//restituisce un valore e i tiri di dado in base ad una notazione che inizia con "/r "
function rollDice(diceNotation){
	let result={
		rolls: [],
		total: 0,
	}
	
	let sanStr=diceNotation.substring(3).trim().replace((/  |\t\r\n|\n|\r/gm), "").toLowerCase()
	
	let isDice=false
	let num="0"
	let faces=""
	let rollTemplate={
		value:0,
		positive:true,
		max:null,
	}
	let add=true
	
	for(let i=0;i<sanStr.length;i++){
		let chr=sanStr.charAt(i)
		
		if(!isNaN(parseInt(chr))){
			if(isDice){
				faces=faces.concat(chr)
			}else {
				num=num.concat(chr)
			}
		}
		
		if(chr==="d"){
			isDice=true
		}
		
		if(chr==="+" || chr==="-" || i==sanStr.length-1){
			let roll=null
			let iter=1
			
			if(isDice){
				iter=Math.max(1, parseInt(num))
			}
			
			if(i>0){
				for(let j=0;j<iter;j++){
					roll=JSON.parse(JSON.stringify(rollTemplate))
					
					if(isDice){
						roll.value=randomInt(parseInt(faces))
						roll.positive=true
						roll.max=parseInt(faces)
					} else {					
						roll.value=parseInt(num)
						roll.positive=add
					}
					
					if(roll.positive){
						result.total+=roll.value
					}else{
						result.total-=roll.value
					}
					
					result.rolls.push(roll)
				}
				num="0"
				faces=""
				isDice=false
			}
			
			if(chr==="+"){
				add=true
			} else if(chr==="-"){
				add=false
			}
		}
	}
	
	return result
}

//costruisce l'HTML per mostrare... il mostro
function showMonster(monst, whatToShow){
    let statblock=document.createElement("div");
    statblock.className="monsterStats";

    let row="";
    let img=""

    let header=document.createElement("div");

    //intestazione
    if(whatToShow.includes("head")){

        if(monst.IMG!=""){
            img=document.createElement("img");
            img.style.border= "2px solid black";
            img.style.display= "block";
            img.style.maxWidth= "10em";
            img.style.width= "auto";
            img.style.height= "auto";
            img.style.position= "relative";
            img.style.float= "left";
            img.style.margin= "2em";
            img.src=monst.IMG;
            header.appendChild(img);
        }

        let title=document.createElement("div");
        title.className="monsterStatRow";
        title.innerHTML="<b>"+monst.NOME.toUpperCase()+" ? Liv "+monst.LIVELLO+" ? "+monst.TIPO.toUpperCase()+"</b>";
        header.appendChild(title);
    }

    //descrizione
    if(whatToShow.includes("desc")){
        let desc=document.createElement("div");
        desc.className="monsterStatRow";
        desc.innerHTML=monst.DESCRIZIONE;

        let newBox=createTextInput(function(e){
                if(newBox[0].value.trim()!=""){
                    monst.DESCRIZIONE=newBox[0].value;
					newBox[0].removeAttribute("newInput")
                    document.getElementById("bestiaryEditor").innerHTML="";
                    document.getElementById("bestiaryEditor").appendChild(showMonster(monst, whatToShow));
                }
            },
            updateSheet
        )

        header.appendChild(desc);
        header.appendChild(newBox[0]);
        header.appendChild(newBox[1]);
    }

    //tratti
    if(whatToShow.includes("traits")){
        let traits=document.createElement("div");
        traits.className="monsterStatRow";
        traits.innerHTML="<b>Tratti tipici: </b>"+monst.TRATTI;
        traits.style.justifyContent="center";
        header.appendChild(traits);
    }
        
    statblock.appendChild(header);

    //statistiche
    if(whatToShow.includes("stats")){
        let stats=document.createElement("div");
        stats.className="monsterStatRow";

        let scores=document.createElement("div");
        scores.style.border="1px black";
        scores.style.borderStyle="none solid"
        scores.className="monsterStatRow";
        traits.style.borderBottom="0px";

        let des=document.createElement("div");
        des.innerHTML="<b>DES d"+monst.DES+"</b>";
        scores.appendChild(des);

        let int=document.createElement("div");
        int.innerHTML="<b>INT d"+monst.INT+"</b>";
        scores.appendChild(int);

        let vig=document.createElement("div");
        vig.innerHTML="<b>VIG d"+monst.VIG+"</b>";
        scores.appendChild(vig);

        let vol=document.createElement("div");
        vol.innerHTML="<b>VOL d"+monst.VOL+"</b>";
        scores.appendChild(vol);
        
        let pv=document.createElement("div");
        pv.style.border="1px black";
        pv.style.borderStyle="none solid"
        pv.style.backgroundColor="red";
        pv.innerHTML="<b>PV: "+monst.PV+" ? "+Math.floor(monst.PV/2)+"</b>";

        let pm=document.createElement("div");
        pm.style.border="1px black";
        pm.style.borderStyle="none solid"
        pm.style.backgroundColor="deepskyblue";
        pm.innerHTML="<b>PM: "+monst.PM+"</b>";

        let init=document.createElement("div");
        init.style.border="1px black";
        init.style.borderStyle="none solid"
        init.innerHTML="<b>Iniz. "+monst.INIZ+"</b>";

        stats.appendChild(scores);
        stats.appendChild(pv);
        stats.appendChild(pm);
        stats.appendChild(init);
        statblock.appendChild(stats);
    }

    //difese
    if(whatToShow.includes("defs") || whatToShow.includes("defsShort")){
        let defs=document.createElement("div");
        defs.className="monsterStatRow";

        let deff=document.createElement("div");
        deff.style.border="1px black";
        deff.style.borderStyle="none solid"
        deff.innerHTML="<b>DIF "+monst.DIF+"</b>";
        defs.appendChild(deff);

        let defm=document.createElement("div");
        defm.style.border="1px black";
        defm.style.borderStyle="none solid"
        defm.innerHTML="<b>D. MAG "+monst.DMAG+"</b>";
        defs.appendChild(defm);

        let elem=null;

        for (const el in monst.ELEM) {
            if(whatToShow.includes("defs") || monst.ELEM[el]!=""){
                elem=document.createElement("div");
                elem.title=el;
                elem.style.border="1px black";
                elem.style.borderStyle="none solid"
                elem.innerHTML=el.charAt(0).toUpperCase() + el.slice(1)+": "+(monst.ELEM[el]==""?"-":monst.ELEM[el])
                defs.appendChild(elem);
            }
        }
        statblock.appendChild(defs);
    }

    //attacchi
    if(whatToShow.includes("atks")){
        let atkHead=document.createElement("div");
        atkHead.className="monsterStatRow";
        atkHead.innerHTML="<h3>ATTACCHI BASE</h3>";
        statblock.appendChild(atkHead);

        monst.ATTACCHI.forEach(function(atk, i){
                row=document.createElement("div");
                row.className="monsterStatRow";
                row.innerHTML="<span style='color: transparent;text-shadow: 0 0 0 black;font-weight: bold;margin: 5px;'>"+(atk.raggio=="M"?"⚔":"🏹")+"</span><b>"+atk.nome+"</b> ? <b class='tp'>"+atk.TP+"</b> ? <b>"+atk.TD+"</b> danni "+atk.tipo
                statblock.appendChild(row);
            }
        );
    }
    
    //incantesimi
    if(monst.INCANTESIMI.length>0 && whatToShow.includes("spells")){
        let spellHead=document.createElement("div");
        spellHead.className="monsterStatRow";
        spellHead.innerHTML="<h3>INCANTESIMI</h3>";
        statblock.appendChild(spellHead);

        monst.INCANTESIMI.forEach(function(spell, i){
                row=document.createElement("div");
                row.innerHTML="<span style='color: transparent;text-shadow: 0 0 0 black;font-weight: bold;margin: 5px;'>⚝</span><b>"+spell.nome+" "+(spell.offensivo=="1"?"⚡":"")+" ? <span class='tp'>"+spell.TP+"</span> ? "+spell.costo+" ? "+spell.bersagli+" ? "+spell.durata+"</b>"
                statblock.appendChild(row);
                row=document.createElement("div");
                row.innerHTML=spell.descrizione;
                statblock.appendChild(row);
            }
        );
    }

    //azioni speciali
    if(monst.AZIONI.length>0 && whatToShow.includes("actions")){
        let actionHead=document.createElement("div");
        actionHead.className="monsterStatRow";
        actionHead.innerHTML="<h3>ALTRE AZIONI</h3>";
        statblock.appendChild(actionHead);

        monst.AZIONI.forEach(function(act, i){
                row=document.createElement("div");
                row.innerHTML="<b>"+(act.azione=="1"?"<span style='color: transparent;text-shadow: 0 0 0 black;font-weight: bold;margin: 5px;'>⚙</span>":"")+" "+act.nome+"</b> ? "+act.descrizione
                statblock.appendChild(row);
            }
        );
    }
    
    //regole speciali
    if(monst.REGOLE.length>0 && whatToShow.includes("rules")){
        let ruleHead=document.createElement("div");
        ruleHead.className="monsterStatRow";
        ruleHead.innerHTML="<h3>REGOLE SPECIALI</h3>";
        statblock.appendChild(ruleHead);

        monst.REGOLE.forEach(function(rule, i){
                row=document.createElement("div");
                row.innerHTML="<b>"+rule.nome+"</b> ? "+rule.descrizione
                statblock.appendChild(row);
            }
        );
    }

    //applySpecialNotation(statblock);

    return statblock
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setupEULA(){
	document.getElementById("EULA").style.removeProperty("display")
	document.getElementById('startup').style.display='none'
	FUDB.open(
		()=>{
			FUDB.EULA.get("0", 
				()=>{
					document.getElementById("EULA").style.display="none";
					startUp()
				},
				()=>{
					document.getElementById("EULA").firstElementChild.style.removeProperty("display")
				}
			)
		}
	);
}

function acceptEULA(){
	document.getElementById("EULA").style.display="none";
	FUDB.EULA.add({ id: "0", data: "1" });
	startUp()
}

function closeModalWithBack(){
    if (document.getElementById("modalBckgr").style.display != "none") {
        setModal()
    }
}

function startUp() {
	//si carica in memoria la libreria di default
	loadDefaultLibrary();
	fetchMemoryData();
	
	document.querySelectorAll("link[rel='icon']")[0].setAttribute("href", fallbackImgB64);

	data = defaultData; //inizializzazione dei dati usati dalla scheda - di default si associano i dati contenuti nel file "data.js"
	startUpCharacter(); //va prima di tutto inizializzato il PG, dato che alcuni elementi di setup leggono i dati del PG
	itemFilters(); //associa anche gli eventi associati ai filtri separatamente da setupEvents, per tenere tutto nello stesso posto
	setupEvents();
	
	document.getElementById("openClocks").style.removeProperty("display")
	document.getElementById("openLobby").style.removeProperty("display")
	document.getElementById("openChat").style.removeProperty("display")
	
    
	if(typeof Capacitor !== 'undefined'){
        if(typeof Capacitor.Plugins.App !== 'undefined') {
            Capacitor.Plugins.App.addListener("backButton", 
                closeModalWithBack
            )

            Capacitor.Plugins.App.addListener("appUrlOpen",
            (event) => {
                const lobbyId = event.url.split(domain)[1];
                
                if(!p2p.master){
                    document.getElementById("idLobby").value=lobbyId
                    joinLobby()
                }
            });
        }
        
        if(typeof Capacitor.Plugins.Filesystem !== 'undefined'){
            document.getElementById("exportChar").style.display="none"
            document.getElementById("exportLib").style.display="none"
        }
	}

    document.addEventListener('keydown',function(e){
        let normalBackspace = false

        if(typeof e.target !== undefined){
            if(e.target.nodeName == "INPUT" || e.target.nodeName == "TEXTAREA" || e.target.getAttribute("contenteditable") == "true"){
                normalBackspace=true
            }
        }

        if(e.keyCode == 8 && !normalBackspace){
          e.preventDefault();
          closeModalWithBack()
        }
    })

    window.onbeforeunload = (event) => {
        event.preventDefault();
        return event.returnValue = "Are you sure you want to exit?";
    }
}