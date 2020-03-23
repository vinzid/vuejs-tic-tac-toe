React 的官方[教程][react-tutorial-zh]井字棋很好的引导初学者一步步走进 React 的世界，我想类似的教程对 Vue.js 的初学者应该也会有启发，于是使用 Vue.js 进行了改写

可以先查看最终的[结果][codepen-done]，尝试点击体验，我们将逐步地实现这个效果


## 初始状态代码 

### 初始状态查看

打开[初始状态][codepen-init]直接编辑，或者将对应的文件复制下来放置在同一文件夹中  
此时只是一个简单的井字棋格子，以及写死的下一个选手

### 初始代码分析

目前定义了三个组件，分别为 Square，Board 和 Game

Square 目前只是一个普通的按钮
```
Vue.component('Square', {
  template: `
    <button class="square">
      {{ /* TODO */ }}
    </button>
  `
})
```
- 这样定义了组件后，别的组件就可以直接以 \<Square /> 的方式引用该组件

Board 模版由当前状态和 9 个 Square 组成
```
Vue.component('Board', {
  data() {
    return {
      status: `${nextLabel}X`,
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
```
- data 定义了当前状态 status，和 board 的值，这样在模版中就可以用 {{ status }} 的方式引用状态值，使用 v-for 将 board 二维数组里的值两次循环组装成井字格  
- 在组件中的 data 必须是返回对象的函数而非对象字面值
- v-for 需要有 key 确保性能以及不报警告

Game 模版由 Board 与 后面需要增加的状态和历史组成
```
Vue.component('Game', {
  template: `
    <div class="game">
      <div class="game-board">
        <Board />
      </div>
      <div class="game-info">
        <div>{{ /* status */ }}</div>
        <ol>{{ /* TODO */ }}</ol>
      </div>
    </div>
  `
});
```


## 增加数据处理

### 增加 props

在 Board 中传递一个名为 value 的 prop 到 Square
```
<Square v-for="square in row" :key="square" :value="square" />
```
- :value 是 v-bind:value 的缩写，表示其值是一个表达式

在 Square 的组件定义和模版中增加 value prop
```
Vue.component('Square', {
  props: ['value'],
  template: `
    <button class="square">
      {{ value }}
    </button>
  `
})
```
- props 为父组件可传递给子组件的变量，在父组件调用子组件时在标签中设置对应属性，在子组件中使用方法与 data 一致

目前的[代码和效果][codepen-props]：0 - 8 的数字分别填充进井字棋格中

### 增加交互

增加点击事件至按钮元素以更新值
```
Vue.component('Square', {
  //props: ['value'],
  data() {
    return {
      value: null
    }
  },
  methods: {
    setValue() {
      this.value = 'X';
    }
  },
  template: `
    <button class="square" @click="setValue">
      {{ value }}
    </button>
  `
})
```
- @click 为 v-on:click 的缩写，其值为点击需要运行的函数，这里为组件定义的方法 methods 中的 setValue  
- 子组件不能直接更新父组件的值，所以将 value 从 props 改为 data
- data 的值更新，对应模版就会自动更新展示内容

目前的[代码和效果][codepen-click]：点击井字棋格，对应填充 X


## 完善游戏

### 数值提升

为交替落子和确认输赢，需要统一判断各格状态，所以将 value 提升至 Board

Board 增加数据 squares 和方法 handleClick
```
Vue.component('Board', {
  data() {
    return {
      ...
      squares: Array(9).fill(null),
    }
  },
  methods: {
    handleClick(i) {
      const squares = this.squares.slice();
      if (squares[i]){
        alert('此位置已被占!');
        return
      }
      squares[i] = 'X';
      this.squares = squares;
    }
  },
  template: `
    ...
      <div class="board-row" v-for="(row, index) in board" :key="index">
        <Square v-for="square in row" :key="square" :value="squares[square]" @click="handleClick(square)" />
```
- squares 初始为 9 个 null 组成的数组，井字棋盘为空的状态
- handleClick 接收对应格子序号的参数，并更新对应的 squares 元素
- 事件触发的处理函数不是 handleClick(square) 的返回值，而是 handleClick，只是在触发时会带上参数值 square

在 Square 的点击事件处理器中触发 Board 的点击事件
```
Vue.component('Square', {
  props: ['value'],
  methods: {
    setValue() {
      this.$emit('click');
    }
  },
```
- value 要从 data 改回到 props
- $emit 可以触发父组件传递的事件
- prop 里的值在父组件更新，子组件模版也会对应更新展示内容

目前的[代码和效果][codepen-emit]：点击井字棋格，如果未被占，则填充 X

### 轮流落子

增加数据 xIsNext，并在点击时切换
```
data() {
  return {
    ...
    xIsNext: true
  }
},
methods: {
    handleClick(i) {
      ...
      squares[i] = this.xIsNext ? 'X' : 'O';
      this.squares = squares;
      this.xIsNext = !this.xIsNext;
      this.status = `${nextLabel}${this.xIsNext ? 'X' : 'O'}`;
```
- xIsNext 初始值为 true，即 X 先落子
- 点击后，通过取反交替 xIsNext
- 更新状态值 status 为下一个落子者

目前的[代码和效果][codepen-alter]：点击井字棋格，X 和 O 交替落子

### 判断胜者

增加计算胜者的函数
```
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
```
- 列举可能获胜的组合，与 squares 数组的值进行比对

增加点击处理函数的胜者逻辑
```
if (calculateWinner(squares)) {
  alert('胜负已定！');
  return;
}
...
const winner = calculateWinner(squares);
if (winner) {
  this.status = '获胜者: ' + winner;
  return;
}
```
- 点击后，如果之前已有取胜，则点击无效
- 处理落子后，再次判断是否取胜，更新状态

目前的[代码和效果][codepen-winner]：有一方获胜后， 状态和点击处理更新

## 增加事件旅行

### 保存历史记录

为实现“悔棋”功能，需要记录每一次落子的整体状态，相当于棋盘的快照，作为一个历史记录，提升至 Game 组件中

在 Game 增加数据 history，将 xIsNext，status 和 handleClick 方法 从 Board 中转移到 Game 中
```
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
      ...
      squares[i] = this.xIsNext ? 'X' : 'O';
      history.push({
        squares: squares
      });
      ...
    }
  },
  template: `
    <div class="game">
      <div class="game-board">
        <Board :squares="history[history.length - 1].squares" @click="handleClick" />
  `
})
```
- squares 从 history 的最后一个记录取值（目前只有一个记录）
- 落子后，squares 把落子记录进去后，history 再增加一个记录

Board 增加 prop squares，handleClick 更新为触发父组件的事件
```
Vue.component('Board', {
  props: ['squares'],
  methods: {
    handleClick(i) {
      this.$emit('click', i);
    }
  },
```

目前的[代码和效果][codepen-history]：状态位置更新，历史记录已存储

### 展示历史步骤记录

把历史记录循环展示出来，并绑定点击事件，通过 stepNumber 的更新显示对应步骤的记录
```
Vue.component('Game', {
  data() {
    ...
      stepNumber: 0,
    ...
    }
  },
  methods: {
    handleClick(i) {
      const history = this.history.slice(0, this.stepNumber + 1);
      ...
      this.history = history.concat([{
        squares: squares
      }]);
      this.stepNumber = history.length;
      ...
    },
    jumpTo(step) {
      if(step === this.stepNumber){
        alert('已在' + (0 === step ? '最开始' : `步骤#${step}！`));
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
            <button @click="jumpTo(index)">{{ 0 === index ? '回到开始' : '回到步骤#' + index }}</button>
   ...
  `
})
```
- 在 Game 中增加 stepNumber，初始为 0，记录当前展示的步骤
- 将 Board 的 prop squares 的取值更新为 this.stepNumber 对应的步骤
- handleClick 中以已当前步骤为基础处理 history，并更新 stepNumber
- 增加方法 jumpTo 处理回到历史的展示，更新 stepNumber，xIsNext 和 status

最终的[代码和效果][codepen-done]：每落一子，都会增加一个历史步骤，点击步骤可回到该步


## 总结

### 游戏实现内容
- 交替落子
- 判断输赢
- 悔棋重来

### 展示技术内容
- v-bind 在模版中进行数据绑定
- v-for 在模版中进行数组循环
- v-on 在模版中进行事件传递和触发
- data 在组件的定义和模版自动更新
- prop 在组件的传递和模版自动更新


[react-tutorial-zh]: https://zh-hans.reactjs.org/tutorial/tutorial.html
[codepen-done]: https://codepen.io/chanvin/pen/rNVZwJy?editors=0010
[codepen-init]: https://codepen.io/chanvin/pen/yLNxVdL
[codepen-props]: https://codepen.io/chanvin/pen/wvaEgPV?editors=0010
[codepen-click]: https://codepen.io/chanvin/pen/jOPvyxW?editors=0010
[codepen-emit]: https://codepen.io/chanvin/pen/mdJGWxV?editors=0010
[codepen-alter]: https://codepen.io/chanvin/pen/ZEGMKBZ?editors=0010
[codepen-winner]: https://codepen.io/chanvin/pen/PoqdmEQ?editors=0010
[codepen-history]: https://codepen.io/chanvin/pen/poJOwbv?editors=0010