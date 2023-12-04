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

	return (matches)
}


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

const lines = data.split('\n')

const spaces_regex = /\s+/

let total = 0

let results = {}

for (let i = 0; i < lines.length; ++i)
{
	results[i + 1] = handle_line(lines[i])
}

// surprise surprise
// dicts are just objects (key value pairs are actually properties)
// we build scratchcards with the same keys as results but initialise all values to 1
// .reduce transforms (reduces) the array of keys into a singular object (scratchcards)
// the initial value of scratchcards is provided ({})
// in each execution of the reducer function per element in keys, a new property (key value pair) is added to the accumulator (the final result)
// the return value of the reducer function is the input for the next reducer function call.
// idk what i just wrote here but all you need to know is that reduce transforms an array of keys into an object with keys value pairs all initialised to 1
let scratchcards = Object.keys(results).reduce((obj, key) => {
												obj[key] = 1
												return obj
												}, {})

for (let key in results)
{
	console.log("Current key:", key)
	console.log("Number of cards:", scratchcards[key])
	console.log("winnings:", results[key])
	// add no of current cards to no of scratchcards after current
	for (let i = 1; i <= results[key]; i++)
	{
		if (parseInt(key) + i > lines.length)
			break
		scratchcards[parseInt(key) + i] += scratchcards[key]
		console.log("after add:", scratchcards[parseInt(key) + i])
	}
	total += scratchcards[key]
}

console.log("Total:", total)