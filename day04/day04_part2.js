const fs = require('fs')

function parse_line(line)
{
	let winning_nums;
	let my_nums;
	let nums = [];

	let splitted = line.split("|")
	
	winning_nums = splitted[0].substr(line.search(":") + 2).trim().split(spaces_regex)
	my_nums = splitted[1].trim().split(spaces_regex)

	winning_nums = winning_nums.map(element => {
									return (parseInt(element))
									})

	my_nums = my_nums.map(element => {
						  return (parseInt(element))
						  })

	nums.push(winning_nums)
	nums.push(my_nums)

	return (nums)
}

// nums is the output from above
function get_matches(nums)
{
	let matches = 0
	let arr = new Array(100).fill(0)

	for (let win of nums[0])
	{
		arr[win - 1] = 1
	}
	for (let my_num of nums[1])
	{
		if (arr[my_num - 1] === 1)
			matches++
	}

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
let scratchcards = {}

for (let i = 0; i < lines.length; ++i)
{
	let nums = parse_line(lines[i])

	results[i + 1] = get_matches(nums)
}

for (let key in results)
{
	scratchcards[key] = 1
}

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