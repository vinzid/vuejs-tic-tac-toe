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
      board: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
      ]
    }
  },
  props: ['squares'],
  methods: {
    handleClick(i) {
      this.$emit('click', i);
    }
  },
  template: `
    <div>
      <div class="board-row" v-for="(row, index) in board" :key="index">
        <Square v-for="square in row" :key="square" :value="squares[square]" @click="handleClick(square)" />
      </div>
    </div>
  `
});

Vue.component('Game', {
  data() {
    return {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      status: `${nextLabel}X`
    }
  },
  methods: {
    handleClick(i) {
      const history = this.history;
      const current = history[history.length - 1]
      const squares = current.squares.slice();
      if (calculateWinner(squares)) {
        alert('胜负已定！');
        return;
      }
      if (squares[i]){
        alert('此位置已被占!');
        return
      }
      squares[i] = this.xIsNext ? 'X' : 'O';
      history.push({
        squares: squares
      });
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
    <div class="game">
      <div class="game-board">
        <Board :squares="history[history.length - 1].squares" @click="handleClick" />
      </div>
      <div class="game-info">
        <div>{{ status }}</div>
        <ol>{{ /* TODO */ }}</ol>
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