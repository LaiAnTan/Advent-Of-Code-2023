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

function handle_line(sets)
{
	let maxes = [0, 0, 0] // rgb
	let amount = 0
	let color = ''

	for (let set of sets)
	{
		for (let item of set)
		{
			item = item.split(' ')
			color = item[1]
			amount = parseInt(item[0])

			if (color == 'red' && amount > maxes[0])
				maxes[0] = amount
			else if (color == 'green' && amount > maxes[1])
				maxes[1] = amount
			else if (color == 'blue' && amount > maxes[2])
				maxes[2] = amount
		}
	}
	return (maxes[0] * maxes[1] * maxes[2])
}

for (let i = 0; i < lines.length; ++i)
{
	let parsed = parse_line(lines[i])

	sum += handle_line(parsed)
}

console.log("Sum: " + sum)
