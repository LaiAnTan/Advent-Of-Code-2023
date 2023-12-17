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

function process_moves(dir, moves, start)
{
	let steps = 0
	let curr_loc = start

	while (true)
	{
		for (let i = 0; i < moves.length; i++)
		{
			// console.log("At:", curr_loc)
			if (curr_loc[2] === 'Z') // end at a location that ends with Z
				return (steps)
			let node = dir.get(curr_loc)
			curr_loc = moves[i] === 'L' ? node[0] : node[1]
			steps++
		}
	}
}

function get_all_starts(dir)
{
	let starts = []

	for (let key of dir.keys())
	{
		if (key[2] === 'A')
			starts.push(key)
	}
	return (starts)
}

function gcd(a, b)
{
	let temp

	while (b !== 0)
	{
		temp = b
		b = a % b
		a = temp
	}
	return (a)
}

function arr_lcm(arr)
{
	// let product = arr.reduce((prev, curr) => (prev * curr), arr[0])
	// console.log(product)
	// return (product / arr_gcd(arr))

	let lcm = arr[0]

	for (let i = 1; i < arr.length; i++)
	{
		let gcd_val = gcd(lcm, arr[i])
		lcm = lcm * arr[i] / gcd_val
	}
	return (lcm);
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

let starts = get_all_starts(dir)

let steps = []


for (let start_point of starts)
steps.push(process_moves(dir, moves, start_point))

console.log(steps)
console.log("Steps:", arr_lcm(steps))