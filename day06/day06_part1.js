// includes

const fs = require('fs')

function parse_races(data)
{
	let lines = data.split('\n')
	let races = []

	let times = lines[0].split(":")[1].trim().split(/ +/g)
	let distances = lines[1].split(":")[1].trim().split(/ +/g)

	for (let i = 0; i < times.length; ++i)
		races.push([times[i], distances[i]])

	return (races)
}

function find_total_ways(time, distance_to_beat)
{
	// time = all possible ways
	// min_hold = min time held and still win
	// max_hold = max time held and still win
	let min_hold = 0
	let max_hold = time
	while (true)
	{
		// distance = time_held * time left
		if (min_hold * (time - min_hold) > distance_to_beat)
			break
		++min_hold
	}
	console.log("Minimum hold time is", min_hold)
	while (true)
	{
		if (max_hold * (time - max_hold) > distance_to_beat)
			break
		--max_hold
	}
	console.log("Maximum hold time is", max_hold)
	return (max_hold - min_hold + 1)
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

let races = parse_races(data)

let margin = 1

for (let race of races)
{
	margin *= find_total_ways(race[0], race[1])
}

console.log(margin)
