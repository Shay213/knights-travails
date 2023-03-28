const knightTour = start => {
    const board = Array.from({length: 8}, () => Array.from({length: 8}, () => 0));
    const getMoves = ([x, y]) => [
        [x - 2, y - 1],
        [x - 2, y + 1],
        [x - 1, y - 2],
        [x - 1, y + 2],
        [x + 1, y - 2],
        [x + 1, y + 2],
        [x + 2, y - 1],
        [x + 2, y + 1],
    ];
    const isValidMove = ([x,y]) => x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === 0;
    const path = []

    function dfs(start, count=1){
        path.push(start);
        const [x,y] = start;
        board[x][y] = count;
        if(count === 64){
            return true;
        }
        
        const moves = getMoves(start);
        for(const move of moves){
            if(isValidMove(move)){
                if(dfs(move, count + 1)){
                    return true;
                }
            }
        }
        path.pop();
        board[x][y] = 0;
        return false;
    }
    dfs(start);
    return path;
};

const createHTMLBoard = size => {
    const boardContainer = document.querySelector('.board');
    boardContainer.style.cssText = `grid-template-columns: repeat(8, 80px); grid-auto-rows: 80px;`;
    let counter = 7;
    while(!!(size--)){
        const el = document.createElement("div");
        if(counter === -1) counter = 7;
        el.setAttribute('data-cords', `${counter},${parseInt(size/8)}`);
        counter--;
        boardContainer.appendChild(el).style.backgroundColor = parseInt((size / 8) + size) % 2 == 0 ? '#ababab' : 'white';
    }
};

const knightMoves = start => {
    const path = knightTour(start);
    const [...squares] = document.querySelectorAll('.board > div');
    const sameArr = (a,b) => JSON.stringify(a) === JSON.stringify(b);
    const findSquare = arr => squares.find(square => sameArr(square.dataset.cords.split(',').map(el => +el), arr));

    let prevSquare = findSquare(start);
    animate();
    function animate(length = 1){
        if(length === path.length) return;
        
        const square = findSquare(path[length]);
        createNewLine(prevSquare, square);
        prevSquare = square;

        setTimeout(() => animate(++length),500);
    }

    function createNewLine(start, end){
        const board = document.querySelector('.board');
        const line = document.createElement('div');
        line.classList.add('line');
        const startX = start.offsetLeft + (start.offsetWidth / 2);
        const startY = start.offsetTop + (start.offsetHeight / 2);
        const endX = end.offsetLeft + (end.offsetWidth / 2);
        const endY = end.offsetTop + (end.offsetHeight / 2);
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

        line.style.width = length + 'px';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.top = startY + 'px';
        line.style.left = startX + 'px';
        board.appendChild(line);
    }
}

const gameFlow = () => {
    const squares = document.querySelectorAll('.board > div');
    const buttons = document.querySelectorAll('.container > div > button');
    let counter = 0;
    let start = null; 
    let destination = null;

    buttons.forEach(button => button.addEventListener('click', chooseAlg));

    function chooseAlg(e){
        if(e.target.dataset.id === '1'){
            buttons[0].classList.add('active');
            buttons[1].classList.remove('active');
        }else{
            buttons[1].classList.add('active');
            buttons[0].classList.remove('active');
        }
    }

    squares.forEach(square => square.addEventListener('click', squareChosen));

    function squareChosen(e){
        if(counter === 2) return;
        const choice = e.target.dataset.cords.split(',').map(el => +el);
        counter === 0 ? start = choice : destination = choice;

        if(start && destination){
            knightMoves(start, destination);

            // reset
            /*counter = 0;
            start = null;
            destination = null;
            startSquareText.textContent = `Start: `;
            destinationSquareText.textContent = `Destination: `;*/
        }
        counter++;
    }
};

const init = (() => {
    createHTMLBoard(64);
    gameFlow();
})();
