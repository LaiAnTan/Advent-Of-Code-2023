const fs = require('fs')

const data = fs.readFileSync('input.txt', 'utf8')

const lines = data.split('\n')

let sum = 0

// "Game 1: 4 blue; 1 green, 2 red; 4 blue, 1 green, 6 red"
function parse_line(line)
{
	line = line.split(':')[1]

	let sets = line.split(';')

	sets = sets.map(element => {
		return element.split(',')
	})

	// trim every element in each sub array
	sets = sets.map(subArray => {
		return subArray.map(element => {
			return element.trim()
		})
	})

	return (sets);
}

// bag only has 12 red cubes, 13 green cubes, and 14 blue cubes
// return true if possible, false if not
function handle_line(sets)
{
	for (let set of sets)
	{
		for (let item of set)
		{
			if (item.search("red") != -1)
			{
				if (parseInt(item.split(' ')[0]) > 12)
					return (false)
			}
			else if (item.search("green") != -1)
			{
				if (parseInt(item.split(' ')[0]) > 13)
					return (false)
			}
			else if (item.search("blue") != -1)
			{
				if (parseInt(item.split(' ')[0]) > 14)
					return (false)
			}
		}
	}
	return (true)
}

for (let i = 0; i < lines.length; ++i)
{
	let parsed = parse_line(lines[i])

	if (handle_line(parsed) == true)
	{
		sum += (i + 1)
	}
}

console.log("Sum: " + sum)
