const nextLabel = 'Next player 下一个选手：';

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
      stepNumber: 0,
      xIsNext: true,
      status: `${nextLabel}X`
    }
  },
  methods: {
    handleClick(i) {
      const history = this.history.slice(0, this.stepNumber + 1);
      const current = history[history.length - 1]
      const squares = current.squares.slice();
      if (calculateWinner(squares)) {
        alert('Winner was determined!\n胜负已定！');
        return;
      }
      if (squares[i]){
        alert('Place was taken!\n此位置已被占！');
        return
      }
      squares[i] = this.xIsNext ? 'X' : 'O';
      this.history = history.concat([{
        squares: squares
      }]);
      this.stepNumber = history.length;
      this.squares = squares;
      const winner = calculateWinner(squares);
      if (winner) {
        this.status = 'Winner 获胜者：' + winner;
        return;
      }
      this.xIsNext = !this.xIsNext;
      this.status = `${nextLabel}${this.xIsNext ? 'X' : 'O'}`;
    },
    jumpTo(step) {
      if(step === this.stepNumber){
        alert('已在' + (0 === step ? '最开始' : `步骤#${step}！`) + '\nAlready at ' + (0 === step ? 'Beginning' : `Step#${step}！`));
        return;
      }
      this.stepNumber = step;
      this.xIsNext = (step % 2) === 0;
      this.status = `${nextLabel}${this.xIsNext ? 'X' : 'O'}`;
    }
  },
  template: `
    <div class="game">
      <div class="game-board">
        <Board :squares="history[this.stepNumber].squares" @click="handleClick" />
      </div>
      <div class="game-info">
        <div>{{ status }}</div>
        <ol>
          <li v-for="(squares, index) in history" :key="index" :class="{'move-on': index === stepNumber}">
            <button @click="jumpTo(index)">{{ 0 === index ? 'Go to start 回到最开始' : 'Go to move 回到步骤#' + index }}</button>
          </li>
        </ol>
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