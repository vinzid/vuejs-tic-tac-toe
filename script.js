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
      status: '下一个选手：X',
      board: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
      ],
      squares: Array(9).fill(null),
    }
  },
  methods: {
    handleClick(i) {
      const squares = this.squares.slice();
      squares[i] = 'X';
      this.squares = squares;
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