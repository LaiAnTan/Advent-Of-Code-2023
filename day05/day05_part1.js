const fs = require('fs')

function get_seeds(data)
{
	let lines = data.split('\n')
	let seeds = []

	if (/^seeds:/g.test(lines[0]) === true)
	{
		seeds = lines[0].split(": ")[1].split(" ").map(element => parseInt(element))
	}

	return (seeds)
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

// uses seeds and maps from above functions' return values
function traverse_maps(seeds, maps)
{
	let values = [...seeds]

	console.log("Original values:", values)

	// update seed values using every map
	for (let map of maps)
	{
		console.log("Current map:", map)
		for (let i = 0; i < values.length; ++i)
		{
			for (let map_range of map)
			{
				if (values[i] >= map_range[1] && values[i] < (map_range[1] + map_range[2])) // in range
				{
					// find offset
					let offset = values[i] - map_range[1]
					values[i] = map_range[0] + offset
					break
				}
			}
		}
		console.log("New values:", values)
	}
	return (values)
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

let seeds = get_seeds(data)
let maps = parse_maps(data)

console.log(seeds)
console.log(maps)

let locations = traverse_maps(seeds, maps)

// funny js min does not work with arrays ??
console.log("Lowest location:", Math.min(...locations))

