// includes

const fs = require('fs')

function parse_races(data)
{
	let lines = data.split('\n')

	let time = lines[0].split(":")[1].trim().split(/ +/g).join("")
	let distance = lines[1].split(":")[1].trim().split(/ +/g).join("")

	return ([time, distance])
}

function find_total_ways(time, distance_to_beat)
{
	// use quadratic formula even though solution can be found with brute force :skull:

	let a = -1
	let b = time
	let c = -distance_to_beat

	let discriminant = (b ** 2) - (4 * a * c)

	let x_one = Math.floor((-b - Math.sqrt(discriminant)) / (2 * a))
	let x_two = Math.floor((-b + Math.sqrt(discriminant)) / (2 * a))

	return (Math.max(x_one, x_two) - Math.min(x_one, x_two))
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

let race = parse_races(data)

let margin = 1

margin = find_total_ways(race[0], race[1])

console.log(margin)