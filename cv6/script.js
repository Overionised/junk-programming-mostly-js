
const dvdElement= document.getElementById("dvd");
const scoreElement= document.getElementById("score");
const announcementElement= document.getElementById("announcement");
const backgroundCanvas = document.getElementById("bg");
const backgroundContext = backgroundCanvas.getContext("2d", { alpha: true });

async function playPngMkv(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load ${url}: ${response.status}`);

    const bytes = new Uint8Array(await response.arrayBuffer());
    const frames = parsePngMkv(bytes);
    if (!frames.length) throw new Error("No PNG video frames found");

    const cache = new Map();
    const cacheOrder = [];
    let lastFrameIndex = -1;
    let startTime = performance.now();
    const duration = frames[frames.length - 1].timeMs + (1000 / 15);

    backgroundCanvas.width = 1280;
    backgroundCanvas.height = 720;
    backgroundContext.imageSmoothingEnabled = false;

    async function decodeFrame(index) {
        if (cache.has(index)) return cache.get(index);

        const frame = frames[index];
        const blob = new Blob([frame.data], { type: "image/png" });
        const bitmap = await createImageBitmap(blob);
        cache.set(index, bitmap);
        cacheOrder.push(index);

        while (cacheOrder.length > 24) {
            const oldIndex = cacheOrder.shift();
            const oldBitmap = cache.get(oldIndex);
            if (oldBitmap) oldBitmap.close();
            cache.delete(oldIndex);
        }
        return bitmap;
    }

    function drawCover(bitmap) {
        const scale = Math.max(backgroundCanvas.width / bitmap.width, backgroundCanvas.height / bitmap.height);
        const width = bitmap.width * scale;
        const height = bitmap.height * scale;
        const x = (backgroundCanvas.width - width) / 2;
        const y = (backgroundCanvas.height - height) / 2;
        backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        backgroundContext.drawImage(bitmap, x, y, width, height);
    }

    async function animationLoop(now) {
        const elapsed = (now - startTime) % duration;
        let low = 0;
        let high = frames.length - 1;

        while (low < high) {
            const middle = Math.ceil((low + high) / 2);
            if (frames[middle].timeMs <= elapsed) low = middle;
            else high = middle - 1;
        }

        if (low !== lastFrameIndex) {
            lastFrameIndex = low;
            drawCover(await decodeFrame(low));
        }

        const nextIndex = (low + 1) % frames.length;
        if (!cache.has(nextIndex)) decodeFrame(nextIndex);
        requestAnimationFrame(animationLoop);
    }

    drawCover(await decodeFrame(0));
    requestAnimationFrame(animationLoop);
}

function parsePngMkv(bytes) {
    function readVint(offset, isId) {
        const first = bytes[offset];
        if (first === undefined) return null;

        let length = 1;
        while (length <= 8 && !(first & (0x80 >>> (length - 1)))) length++;
        if (length > 8) return null;

        let value = isId ? first : first & (0xff >>> length);
        for (let index = 1; index < length; index++) value = value * 256 + bytes[offset + index];
        return { value, length };
    }

    const frames = [];
    let clusterTimeMs = 0;

    function parseRange(start, end) {
        let offset = start;
        while (offset < end) {
            const id = readVint(offset, true);
            if (!id) break;
            offset += id.length;

            const size = readVint(offset, false);
            if (!size) break;
            offset += size.length;

            const unknownSize = size.value >= Number.MAX_SAFE_INTEGER;
            const payloadEnd = unknownSize ? end : Math.min(end, offset + size.value);

            if (id.value === 0x1f43b675) {
                clusterTimeMs = 0;
                parseRange(offset, payloadEnd);
            } else if (id.value === 0xe7) {
                clusterTimeMs = readUnsigned(bytes, offset, size.value);
            } else if (id.value === 0xa3 || id.value === 0xa1) {
                let blockOffset = offset;
                const track = readVint(blockOffset, false);
                if (track) {
                    blockOffset += track.length;
                    const relativeTime = (bytes[blockOffset] << 8) | bytes[blockOffset + 1];
                    blockOffset += 2;
                    blockOffset += 1;

                    const signedRelativeTime = relativeTime & 0x8000
                        ? relativeTime - 0x10000
                        : relativeTime;
                    const pngStart = blockOffset;
                    frames.push({
                        timeMs: clusterTimeMs + signedRelativeTime,
                        data: bytes.slice(pngStart, payloadEnd)
                    });
                }
            } else if (
                id.value === 0x18538067 ||
                id.value === 0x1549a966 ||
                id.value === 0x1654ae6b ||
                id.value === 0xa0 ||
                id.value === 0xae
            ) {
                parseRange(offset, payloadEnd);
            }

            offset = payloadEnd;
        }
    }

    function readUnsigned(source, offset, length) {
        let value = 0;
        for (let index = 0; index < length; index++) {
            value = value * 256 + source[offset + index];
        }
        return value;
    }

    parseRange(0, bytes.length);
    return frames.sort((first, second) => first.timeMs - second.timeMs);
}

playPngMkv("bg/bg.mkv").catch(error => console.error(error));


const picturex = 200;
const picturey = 150;
const tolerance = 5 /2;

let cornerhitf =false
let cornerhitl=false

let w = window.innerWidth;
let h = window.innerHeight;
let x=0;
let y =0;
let switchery = false;
let switcherx = false;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//rand spawn
y = getRandomInt( 0, h-picturey);
x = getRandomInt(0, w-picturex);
let score = 0;
let cornerscore = 0;
switcherx = Math.floor(Math.random()+0.5);
switchery = Math.floor(Math.random()+0.5);
console.log(switcherx, switchery)

setInterval(function (){
    scoreElement.innerText= "Score: " + score +
        "  Corners Hit: " +cornerscore;
    w = window.innerWidth;
    h = window.innerHeight;

    //corner check

    //first if it's in the corner hitbox
    if(((x>0-tolerance)&&(x<tolerance) && (y>0-tolerance)&&(y<tolerance)) ||
        ((x>0-tolerance)&&(x<tolerance) && (y>(h-picturey-tolerance))&& (y<(h-picturey+tolerance))) ||
        ((x>(w-picturex-tolerance))&& (x<(w-picturex+tolerance)) && (y>0-tolerance)&&(y<tolerance)) ||
        ((x>(w-picturex-tolerance))&& (x<(w-picturex+tolerance)) && (y>(h-picturey-tolerance))&& (y<(h-picturey+tolerance)))) {

        //now it's in the hitbox, but it only wants to be there once and we check every 5ms
        //so we make a makeshift náběžná hodnota

        //it hit 'cornet hit first'
        cornerhitf=true

        //it was already true before
        //we are STILL inside the hitbox
        if(!(cornerhitf===cornerhitl)) {
            //normal behaviour we hit the corner
            score =score*10;
            announcementElement.style.top=h/2 +"px";
            announcementElement.style.left=w/2 +"px";
            announcementElement.innerText= "Corner Hit";
            cornerscore++;
            setTimeout(function() {
               announcementElement.innerText="";
            }, 3000);




        }
    }else{
        //if it didnt hit the output is false
        cornerhitf=false;
    }
    //the last value is the one we just got.
    cornerhitl=cornerhitf;


    if (x>=w-picturex){switcherx=true; score++;}
    else if(x<=0){switcherx=false; score++;}
    if(y>=h-picturey){switchery=true; score++;}
    else if(y<=0){switchery=false; score++;}

    if (switcherx){x--;}
    else{x++;}
    if(switchery){y--;}
    else{y++}
    dvdElement.style.top=y+"px";
    dvdElement.style.left=x+"px";

}, 5)