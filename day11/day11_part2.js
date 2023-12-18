// includes

const fs = require('fs')

// functions

function parse_image(data)
{
	return (data.split('\n').map((element) => element.split('')))
}

function find_galaxies(image)
{
	let locations = []

	for (let row = 0; row < image.length; row++)
	{
		for (let col = 0; col < image[0].length; col++)
		{
			if (image[row][col] === '#')
				locations.push([row, col])
		}
	}
	return (locations)
}

function find_empty(locations, image)
{
	let empty_rows = [...Array(image.length).keys()]
	let empty_cols = [...Array(image[0].length).keys()]

	for (let location of locations)
	{
		let row_idx = empty_rows.indexOf(location[0])
		let col_idx = empty_cols.indexOf(location[1])

		if (row_idx !== -1)
			empty_rows.splice(row_idx, 1)
		if (col_idx !== -1)
			empty_cols.splice(col_idx ,1)
	}

	return ([empty_rows, empty_cols])
}

// a, b are pairs of coordinates
function calc_distance(a, b, empty)
{
	let empty_rows = 0
	let empty_cols = 0

	let smaller
	let bigger

	if (a[0] > b[0]) // row
	{
		smaller = b[0]
		bigger = a[0]
	}
	else
	{
		smaller = a[0]
		bigger = b[0]
	}

	for (let empty_row of empty[0])
	{
		if (empty_row > smaller && empty_row < bigger)
			empty_rows++
	}

	if (a[1] > b[1]) // col
	{
		smaller = b[1]
		bigger = a[1]
	}
	else
	{
		smaller = a[1]
		bigger = b[1]
	}

	for (let empty_col of empty[1])
	{
		if (empty_col > smaller && empty_col < bigger)
			empty_cols++
	}

	return (Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]) - (empty_rows + empty_cols) + ((empty_rows + empty_cols) * 1000000)) // funny formula
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

let image = parse_image(data)

let galaxies = find_galaxies(image)

let empty = find_empty(galaxies, image)

console.log(empty)

let sum = 0
let pairs = 0

while (galaxies.length > 1)
{
	for (let i = 1; i < galaxies.length; i++)
	{
		sum += calc_distance(galaxies[0], galaxies[i], empty)
		pairs++
	}
	galaxies.splice(0, 1)
}

console.log("Pairs added:", pairs)
console.log("Sum:", sum)

// find how many empty rows & cols between two galaxies and add 1m per empty