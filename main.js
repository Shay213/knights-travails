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

}

const init = (() => {
    createHTMLBoard(64);
    gameFlow();
})();
