const fs = require('fs')

function get_seed_ranges(data)
{
	let lines = data.split('\n')
	let values = []
	let seed_ranges = []

	if (/^seeds:/g.test(lines[0]) === true)
		values = lines[0].split(": ")[1].split(" ").map(element => parseInt(element))

	for (let i = 0; i < values.length; i += 2)
	{
		seed_ranges.push([values[i], values[i] + values[i + 1]])
	}
	return (seed_ranges)
}

// converts data into an array of maps
function parse_maps(data)
{
	let lines = data.split('\n')
	let maps_arr = []
	let map

	for (let i = 2; i < lines.length; i++)
	{
		if (/:/g.test(lines[i]) === true)
			map = new Array()
		else if (/[0-9]+/g.test(lines[i]) === true)
			map.push(lines[i].split(' ').map(element => parseInt(element)))
		else
			maps_arr.push(map)
	}
	maps_arr.push(map)
	return (maps_arr)
}

// we must convert whole ranges at a time because brute force is too slow
// credit: hypernutrino
function convert_ranges(seed_ranges, maps)
{
	let not_converted
	let ranges = seed_ranges

	console.log("Ranges:", ranges)

	for (let map of maps)
	{
		let converted = []
		while (ranges.length > 0)
		{
			let curr = ranges.pop()
			not_converted = true
			for (let map_range of map)
			{
				let overlap_start = Math.max(curr[0], map_range[1])
				let overlap_end = Math.min(curr[1], map_range[1] + map_range[2])
				if (overlap_start < overlap_end) // there is an overlap
				{
					not_converted = false
					converted.push([overlap_start - map_range[1] + map_range[0], overlap_end - map_range[1] + map_range[0]])
					if (overlap_start > curr[0]) // there is excess on the left
					{
						ranges.push([curr[0], overlap_start])
					}
					if (curr[1] > overlap_end) // there is excess on the right
					{
						ranges.push([overlap_end, curr[1]])
					}
					break
				}
			}
			if (not_converted === true) // carry over if not converted
				converted.push(curr)
		}
		ranges = converted
	}
	return (ranges)
}

function find_min(ranges)
{
	let flattened = []

	for (let range of ranges)
	{
		flattened.push(range[0])
	}
	console.log("Flattened:", flattened)
	return (Math.min(...flattened))
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

let seed_ranges = get_seed_ranges(data)
let maps = parse_maps(data)

// console.log(seed_ranges)
// console.log(maps)

let ranges = convert_ranges(seed_ranges, maps)

console.log(ranges)

console.log("Lowest location:", find_min(ranges))
