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
function handle_nums(nums)
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
	let nums = parse_line(line)

	sum += handle_nums(nums)
}

console.log("Sum:", sum)