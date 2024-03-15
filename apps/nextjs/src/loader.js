export default `
body{
display: block;
}
#globalLoader{
    position: fixed;
    z-index: 1700;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: linear-gradient(to right, #38b2ac, #2AA6B7, #9f7aea);
    display: flex;
    left: 0,
    right: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.loader {
 --clr: #2AA6B7;
 /* color of spining  */
 width: 60px;
 height: 60px;
 position: relative;
}

.loader div:nth-child(1), .loader div:nth-child(2) {
 content: "";
 position: absolute;
 top: -10px;
 left: -10px;
 width: 100%;
 height: 100%;
 border-radius: 100%;
 border: 8px solid transparent;
 border-top-color: var(--clr);
}

.loader div:nth-child(1) {
 z-index: 100;
 animation: spin 1s infinite;
}

.loader div:nth-child(2) {
 border: 8px solid #ccc;
}

@keyframes spin {
 0% {
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
 }
 100% {
  -webkit-transform: rotate(360deg);
  -ms-transform: rotate(360deg);
  -o-transform: rotate(360deg);
  transform: rotate(360deg);
 }
}`;
