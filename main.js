const createBoard = (x,y) => {
    const run = (a, b) => {
        if(a === x) return [];
        if(b === y-1) return [[a,b], ...run(a+1, 0)];

        return [[a,b], ...run(a, b+1)];
    }
    return run(0,0);
};
const sameArr = (a,b) => JSON.stringify(a) === JSON.stringify(b);

class Graph{
    constructor(board){
        this.board = board;
        this.adjacencyList = [];
    }

    vertexInAdjacencyList(vertex){
        return this.adjacencyList.some(el => sameArr(el[0], vertex));
    }

    addVertex(vertex){
        if(this.adjacencyList.length === 0 || !this.vertexInAdjacencyList(vertex)){
            this.adjacencyList.push([vertex,[]]);
        }
    }

    addEdge(source, destination){
        this.addVertex(source);
        this.adjacencyList.find(el => sameArr(el[0], source))[1].push(destination);
    }

    buildGraphFromBoard(){
        const board = this.board;
        const moves = ([x,y]) => [
            [x+2, y-1], [x+2, y+1], [x-2, y+1], [x-2, y-1],
            [x-1, y+2], [x+1, y+2], [x-1, y-2], [x+1, y-2]
        ];
        board.forEach(cord => this.addEdge(cord, moves(cord).filter(move => isInBoard(move))));

        function isInBoard([x,y]){
            // from 0 
            const squaresRow = Math.sqrt(board.length)-1; 
            return (x >= 0 && x <= squaresRow) && (y >= 0 && y <= squaresRow);
        }
    }
    //bfs

    dfs(startNode, destinationNode){
        const visited = [];
        const result = [];
        const adjacencyList = this.adjacencyList;
        const isVisited = node => visited.find(el => sameArr(node, el)); 
        (function dfsRecursive(node){   
            if(!node) return null;
            visited.push(node);
            result.push(node);
            return adjacencyList.forEach(el => {
                if(sameArr(el[0], node)){
                    el[1][0].forEach(el2 => {
                        if(!isVisited(el2))
                            dfsRecursive(el2);
                    });
                }
            });
        })(startNode);

        return result;
    }
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



const init = (() => {
    createHTMLBoard(64);
    gameFlow();
})();
