import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";


function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				key={i} //안넣어주면 계속 key 없다고 에러뜸
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}
	// return 안에서는 반복문 사용 못함 > map 사용 하던가 return 바깥에서 처리
	render() {
		let boardSquares = [];
		for (let row = 0; row < 3; row++) {
			let boardRow = [];
			for (let col = 0; col < 3; col++) {
				boardRow.push(this.renderSquare((row * 3) + col));
			}
			boardSquares.push(<div key={row} className="board-row" >{boardRow}</div>);
		}
		return (
			<div>
				{boardSquares}
				{/* {
					Array(3).fill().map((_, row)=>{
						console.log(row)
						return(
							<div key={row} className="board-row">
							{
								Array(3).fill().map((_, col)=>{
									console.log(row*3+col+1)
									return(
										this.renderSquare(row*3+col)
									)
								})
							}
							</div>
						)
					})
				} */}
				{/* <div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div> */}
			</div>
		);
	}
}



class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				x: null,
				y: null,
			}],
			xIsNext: true,
			stepNumber: 0,

		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);

		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				//x : parseInt(i/3)+1,
				x: Math.trunc((i / 3) + 1),
				y: (i % 3) + 1,
			}]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move, array) => {
			const desc = move ?
				//ES6 백틱 사용
				//'Go to move #' + move + ' ( '+step.x+','+step.y+' )':
				`Go to move # ${move} ( ${step.x}, ${step.y} )` :
				'Go to game start';
			return (
				<li key={move}>
					<button className={move == this.state.stepNumber ? "active" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
