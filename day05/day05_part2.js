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
		seed_ranges.push([values[i], values[i + 1]])
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

/*
map_range
0 - dest range start
1 - src range start
2 - range size

seed_range
0 - range start
1 - range size
*/

// converts the range into 1, 2 or 3 ranges depending on overlap
function convert_range(src_range, map_range)
{
	let converted = []
	let not_converted = []
	let new_range

	if (map_range[1] <= src_range[0] && (src_range[0] + src_range[1]) <= (map_range[1] + map_range[2])) 
	{
		//console.log("src is totally inside map", src_range, map_range)
		// if src is totally inside map, move the whole range
		new_range = [map_range[0] + src_range[0] - map_range[1], src_range[1]]
		converted.push(new_range)
	}
	else if (src_range[0] < map_range[1] && (map_range[1] + map_range[2]) < (src_range[0] + src_range[1]))
	{
		//console.log("map is totally inside src", src_range, map_range)
		// if map is totally inside src, split int 3 ranges
		new_range = [src_range[0], map_range[1] - src_range[0]] // not converted left
		not_converted.push(new_range)
		new_range = [map_range[1] + map_range[2], src_range[0] + src_range[1]] // not converted right
		not_converted.push(new_range)
		new_range = [map_range[0], map_range[2]] // converted middle
		converted.push(new_range)
	}
	else if (map_range[1] < src_range[0] && src_range[0] < (map_range[1] + map_range[2]) && (map_range[1] + map_range[2]) < (src_range[0] + src_range[1]))
	{
		//console.log("left side of src is inside map", src_range, map_range)
		// if only the left side of src is inside map, move the left side and copy the right
		new_range = [map_range[0] + src_range[0] - map_range[1], map_range[1] + map_range[2] - src_range[0]] // converted left
		converted.push(new_range)
		new_range = [map_range[1] + map_range[2], (src_range[0] + src_range[1]) - (map_range[1] + map_range[2])] // not converted right
		not_converted.push(new_range)
	}
	else if (src_range[0] < map_range[1] && map_range[1] < (src_range[0] + src_range[1]) && (src_range[0] + src_range[1]) < (map_range[1] + map_range[2]))
	{
		//console.log("right side of src is inside map", src_range, map_range)
		// if only the right side of src is inside map, move the right side and copy the left
		new_range = [map_range[0], src_range[0] + src_range[1] - map_range[1]] // converted right
		converted.push(new_range)
		new_range = [src_range[0], map_range[1] - src_range[0]] // not converted left
		not_converted.push(new_range)
	}
	else
	{
		//console.log("map total miss")
	}
	// console.log("Converted:", converted)
	// console.log("Not converted:", not_converted)
	return ([converted, not_converted])
}

// we must convert whole ranges at a time because brute force is too slow
function convert_ranges(seed_ranges, maps)
{
	let ranges = seed_ranges

	for (let map of maps)
	{
		console.log("Current Map:", map)
		console.log("Ranges before conversion:", ranges)

		let output
		let converted = []
		let not_converted = []
		let ranges_copy = [...ranges]
		for (let map_range of map)
		{
			//console.log("Current map range:", map_range)
			//console.log("Current ranges", ranges)
			for (let i = 0; i < ranges.length; ++i)
			{
				//console.log("Trying to convert:", ranges[i])

				output = convert_range(ranges[i], map_range) // output[0] = converted, output[1] = not converted

				converted = converted.concat(output[0])
				not_converted = not_converted.concat(output[1])

				// full miss
				if (output[0].length === 0 && output[1].length === 0)
				{
					//console.log("Conversion fail")
					continue
				}

				//console.log("Conversion success, removing", ranges[i])
				ranges_copy.splice(ranges_copy.findIndex(element => element === ranges[i]), 1)

				// console.log("ranges_copy:", ranges_copy)
				// console.log("Converted:", converted, "Not converted:", not_converted)
			}

			ranges = [...not_converted, ...ranges_copy]
		}
		ranges = [...ranges, ...converted]
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
