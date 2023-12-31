// includes & enums

const fs = require('fs')

/*
U = up
D = down
L = left
R = right
*/
const possible_moves = {
	'|': ['U', 'D'],
	'-': ['L', 'R'],
	'L': ['U', 'R'],
	'J': ['U', 'L'],
	'7': ['D', 'L'],
	'F': ['D', 'R'],
	'S': ['U', 'D', 'L', 'R']
}

// functions

function parse_input(data)
{
	return (data.split('\n').map((element) => element.split('')))
}

// pipes = 2d array
function find_start(pipes)
{
	for (let row = 0; row < pipes.length; row++)
	{
		for (let col = 0; col < pipes[row].length; col++)
		{
			if (pipes[row][col] === 'S')
				return ([row, col])
		}
	}
}

function find_start_directions_inverse(pipes, start)
{
	let directions = ['U', 'D', 'L', 'R']

	if (/[|7F]/g.test(pipes[start[0] - 1][start[1]])) // up
		directions.splice(directions.indexOf('U'), 1)
	if (/[|JL]/g.test(pipes[start[0] + 1][start[1]])) // down
		directions.splice(directions.indexOf('D'), 1)
	if (/[-FL]/g.test(pipes[start[0]][start[1] - 1])) // left
		directions.splice(directions.indexOf('L'), 1)
	if (/[-7J]/g.test(pipes[start[0]][start[1] + 1])) // right
		directions.splice(directions.indexOf('R'), 1)

	return (directions)
}

/*
prev_direction = u / d / l / r
curr loc = [row, col]
*/
function move(pipes, prev_direction, curr_location)
{
	let movable = [...possible_moves[pipes[curr_location[0]][curr_location[1]]]]

	// console.log("Char:", pipes[curr_location[0]][curr_location[1]], "Movable:", movable)

	for (let dir of prev_direction)
	{
		let idx = movable.indexOf(dir)
		if (idx !== -1)
			movable.splice(idx, 1)
	}
	// console.log("Movable:", movable)

	switch (movable[0])
	{
		case 'U':
			return [['D'], [curr_location[0] - 1, curr_location[1]]]
		case 'D':
			return [['U'], [curr_location[0] + 1, curr_location[1]]]
		case 'L':
			return [['R'], [curr_location[0], curr_location[1] - 1]]
		case 'R':
			return [['L'], [curr_location[0], curr_location[1] + 1]]
	}
}

function traverse_pipes(pipes)
{
	let start = find_start(pipes)
	let dir = find_start_directions_inverse(pipes, start)
	let count = 0

	let output = [dir, start]

	// console.log("Start:", output)
	while (true)
	{
		output = move(pipes, output[0], output[1])
		// console.log("Curr:", output)
		count++
		if (pipes[output[1][0]][output[1][1]] === 'S')
			break
	}
	return (count)
}

// main

let args = process.argv

if (args.length !== 3)
	return

let data

try
{
	data = fs.readFileSync(args[2], 'utf8')
}
catch (err)
{
	console.log("File not found.")
	return
}

let pipes = parse_input(data)

console.log(pipes)

let loop_length = traverse_pipes(pipes)

console.log("Farthest:", loop_length / 2)