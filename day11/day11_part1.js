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

function find_to_expand(locations, image)
{
	let rows_to_expand = [...Array(image.length).keys()]
	let cols_to_expand = [...Array(image[0].length).keys()]

	for (let location of locations)
	{
		let row_idx = rows_to_expand.indexOf(location[0])
		let col_idx = cols_to_expand.indexOf(location[1])

		if (row_idx !== -1)
			rows_to_expand.splice(row_idx, 1)
		if (col_idx !== -1)
			cols_to_expand.splice(col_idx ,1)
	}

	return ([rows_to_expand, cols_to_expand])
}

function expand(image, to_expand)
{
	let rows_to_expand = to_expand[0]
	let cols_to_expand = to_expand[1]

	let offset = 0

	for (let col of cols_to_expand) // we need to expand columns first
	{
		image = image.map((element) => {
			element.splice(col + offset, 0, '.')
			return (element)
			})
		offset++
	}

	offset = 0

	for (let row of rows_to_expand)
	{
		image.splice(row + offset, 0, [...".".repeat(image[0].length)])
		offset++
	}
	return (image)
}

// a, b are pairs of coordinates
function calc_distance(a, b)
{
	return (Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]))
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

let to_expand = find_to_expand(galaxies, image)

console.log(to_expand)

image = expand(image, to_expand)

console.log("Image after expand")
console.log(image)

galaxies = find_galaxies(image)

console.log("Galaxies after expand:", galaxies)

let sum = 0
let pairs = 0

while (galaxies.length > 1)
{
	for (let i = 1; i < galaxies.length; i++)
	{
		sum += calc_distance(galaxies[0], galaxies[i])
		pairs++
	}
	galaxies.splice(0, 1)
}

console.log("Pairs added:", pairs)
console.log("Sum:", sum)