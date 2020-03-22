let nextLabel = '下一个选手：'

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

Vue.component('Square', {
  props: ['value'],
  methods: {
    setValue() {
      this.$emit('click');
    }
  },
  template: `
    <button class="square" @click="setValue()">
      {{ value }}
    </button>
  `
})

Vue.component('Board', {
  data() {
    return {
      status: `${nextLabel}X`,
      board: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
      ],
      squares: Array(9).fill(null),
      xIsNext: true
    }
  },
  methods: {
    handleClick(i) {
      const squares = this.squares.slice();
      if (calculateWinner(squares)) {
        alert('胜负已定！');
        return;
      }
      if (squares[i]){
        alert('此位置已被占!');
        return
      }
      squares[i] = this.xIsNext ? 'X' : 'O';
      this.squares = squares;
      const winner = calculateWinner(squares);
      if (winner) {
        this.status = '获胜者：' + winner;
        return;
      }
      this.xIsNext = !this.xIsNext;
      this.status = `${nextLabel}${this.xIsNext ? 'X' : 'O'}`
    }
  },
  template: `
    <div>
      <div class="status">{{ status }}</div>
      <div class="board-row" v-for="(row, index) in board" :key="index">
        <Square v-for="square in row" :key="square" :value="squares[square]" @click="handleClick(square)" />
      </div>
    </div>
  `
});

Vue.component('Game', {
  template: `
    <div id="app">
      <div class="game">
        <div class="game-board">
          <Board />
        </div>
        <div class="game-info">
          <div>{{ /* status */ }}</div>
          <ol>{{ /* TODO */ }}</ol>
        </div>
      </div>
    </div>
  `
})
  
new Vue({
  el: '#app',
  template: `
    <Game />
  `
});