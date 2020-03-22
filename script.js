Vue.component('Square', {
  template: `
    <button class="square">
      {{ /* TODO */ }}
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
      ]
    }
  },
  template: `
    <div>
      <div class="status">{{ status }}</div>
      <div class="board-row" v-for="(row, index) in board" :key="index">
        <Square v-for="square in row" :key="square" />
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