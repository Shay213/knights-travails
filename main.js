const sameArr = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const Knight = (start, destination=null) => {
    let board = [];
    const moves = [
        [-2, -1],
        [-1, -2],
        [1, -2],
        [2, -1],
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1],
    ];

    const knightTour = () => {
        board = Array.from({length: 8}, () => Array.from({length: 8}, () => 0));
        const path = [];

        function dfsHelper(start, count=1){
            path.push(start);
            const [x,y] = start;
            board[x][y] = count;
            if(count === 64){
                return true;
            }
            
            const validMoves = moves.map(([dx,dy]) => [x+dx, y+dy]).filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === 0);
            validMoves.sort((a,b) => {
                const aMoves = moves.filter(([dx, dy]) => {
                    const [x,y] = a;
                    const nx = x + dx;
                    const ny = y + dy;
                    return nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[nx][ny] === 0;
                }).length;
                const bMoves = moves.filter(([dx, dy]) => {
                    const [x,y] = b;
                    const nx = x + dx;
                    const ny = y + dy;
                    return nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[nx][ny] === 0;
                }).length;

                return aMoves - bMoves;
            });

            for(const move of validMoves){
                if(dfsHelper(move, count+1)){
                    return path;
                }
            }

            board[x][y] = 0;
            path.pop();
            return false;
        }
        return dfsHelper(start);
    };

    

    return {knightTour, shortestPath};
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

const createNewLine = (start, end) => {
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

const gameFlow = () => {
    const board = document.querySelector('.board');
    const buttons = document.querySelectorAll('.container > div > button');
    let squares = document.querySelectorAll('.board > div');
    let firstClick = true;
    let start = null; 
    let destination = null;
    let knightTask = 'tour';

    buttons.forEach(button => button.addEventListener('click', chooseAlg));
    squares.forEach(square => square.addEventListener('click', squareChosen));

    function chooseAlg(e){
        if(e.target.name === 'tour'){
            buttons[0].classList.add('active');
            buttons[1].classList.remove('active');
            reset();
            knightTask = 'tour';
        }
        else if(e.target.name === 'path'){
            buttons[1].classList.add('active');
            buttons[0].classList.remove('active');
            reset();
            knightTask = 'path';
        }
        else{
            reset();
        }
    }

    function squareChosen(e){
        const choice = e.target.dataset.cords.split(',').map(el => +el);
        if(knightTask === 'tour'){
            e.currentTarget.style.backgroundColor = 'green';
            squares.forEach(square => square.removeEventListener('click', squareChosen));
            buttons.forEach(button => button.removeEventListener('click', chooseAlg));
            knightMoves(choice, destination);
        }else{
            if(firstClick){
                start = choice;
                e.currentTarget.style.backgroundColor = 'green';
            }else{
                destination = choice;
                e.currentTarget.style.backgroundColor = 'orange';
            }
            if(start && destination){
                squares.forEach(square => square.removeEventListener('click', squareChosen));
                buttons.forEach(button => button.removeEventListener('click', chooseAlg));
                knightMoves(start, destination);
            }
        }
        firstClick = false;
    }

    function knightMoves(start, destination){
        const findSquare = arr => [...squares].find(square => sameArr(square.dataset.cords.split(',').map(el => +el), arr));
        const knight1 = Knight(start, destination);
        let path = [];
        const startSquare = findSquare(start);
    
        destination ? path = knight1.shortestPath() : path = knight1.knightTour();
    
        let prevSquare = startSquare;
        const activateBtns = async () => {
            const result = await animate();

            buttons.forEach(button => button.addEventListener('click', chooseAlg));
        };
        activateBtns();

        function animate(){
            return new Promise(resolve => {
                function animateHelper(callback, length = 1){
                    if(length === path.length){
                        callback(); // call the callback to signal the animation is complete
                        return true;
                    }
            
                    const square = findSquare(path[length]);
                    if(destination){
                        if(path[length+1]) square.style.backgroundColor = 'pink';
                    }
                    else square.style.backgroundColor = 'pink';
                    
                    createNewLine(prevSquare, square);
                    prevSquare = square;
            
                    setTimeout(() => animateHelper(callback, ++length),500);
                }
                animateHelper(() => resolve('Animation complete'));
            });
        }
    }

    function reset(){
        firstClick = true;
        start = null; 
        destination = null;
        board.innerHTML = '';
        createHTMLBoard(64);
        squares = document.querySelectorAll('.board > div');
        squares.forEach(square => square.addEventListener('click', squareChosen));
    }
};

const init = (() => {
    createHTMLBoard(64);
    gameFlow();
})();