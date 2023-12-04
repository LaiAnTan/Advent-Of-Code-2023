const fs = require('fs')

function handle_line(line)
{
	let winning_nums;
	let my_nums;
	let nums = [];

	let splitted = line.split("|")
	
	winning_nums = splitted[0].substr(line.search(":") + 2).trim().split(spaces_regex)
	my_nums = splitted[1].trim().split(spaces_regex)

	winning_nums = new Set(winning_nums.map(element => {
									return (parseInt(element))
									}))

	my_nums = new Set(my_nums.map(element => {
						  return (parseInt(element))
						  }))

	// to get the intersection of two sets
	// ... (spread operator) expands the iterable into arguments (for functions) / elements (for arrays)
	// arrow function WITH curly braces does not automatically return value
	// arrow function WITHOUT curly braces implicitly returns a value
	let matches = [...winning_nums].filter(element => my_nums.has(element)).length

	if (matches >= 1)
		return (Math.pow(2, matches - 1))
	else
		return (0)
}

let args = process.argv

if (args.length !== 3)
	return

const data = fs.readFileSync(args[2], 'utf8')

const lines = data.split('\n')

const spaces_regex = /\s+/

let sum = 0

for (let line of lines)
{
	sum += handle_line(line)
}

console.log("Sum:", sum)