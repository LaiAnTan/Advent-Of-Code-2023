// includes

const fs = require('fs')

// functions

function get_directions(lines)
{
	map = new Map()

	for (i = 2; i < lines.length; i++)
	{
		let splitted = lines[i].split(" = ")
		let src = splitted[0]
		let options = splitted[1].split(", ").map(element => element.replace(/[()]/g, ''))
		map.set(src, options)
	}
	return (map)
}

function process_moves(dir, moves)
{
	let steps = 0
	let curr_loc = 'AAA'

	while (true)
	{
		for (let i = 0; i < moves.length; i++)
		{
			// console.log("At:", curr_loc)
			if (curr_loc === 'ZZZ')
				return (steps)
			let node = dir.get(curr_loc)
			curr_loc = moves[i] === 'L' ? node[0] : node[1]
			steps++
		}
	}
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

let lines = data.split('\n')

let moves = lines[0]

let dir = get_directions(lines)

console.log(dir)

let steps = process_moves(dir, moves)

console.log("Steps:", steps)