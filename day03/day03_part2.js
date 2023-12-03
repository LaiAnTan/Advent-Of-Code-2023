const fs = require('fs')

const data = fs.readFileSync('input.txt', 'utf8')

const schematic = data.split('\n')

const symbols = /[\W]/g

const numbers = /[0-9]/g

let sum = 0

// assumes that schematic[row][column] contains a number
function get_number(row, col)
{
	let	start_index;
	let	end_index;
	let num_substr;

	start_index = col
	end_index = col

	while (start_index > 0)
	{
		symbols.lastIndex = 0
		if (symbols.test(schematic[row][start_index - 1]) === true)
			break
		start_index--
	}
	while (end_index < schematic[row].length)
	{
		symbols.lastIndex = 0
		if (symbols.test(schematic[row][end_index]) === true)
			break
		end_index++
	}

	num_substr = schematic[row].substr(start_index, end_index - start_index)

	return (parseInt(num_substr))
}

function handle_surrounding_numbers(row, col)
{
	let number_of_adj = 0
	let gear_ratio = 1
	let num = 0

	let memory = [[0, 0, 0],
				  [0, 1, 0],
				  [0, 0, 0]]

	for (let row_offset = -1; row_offset <= 1; row_offset++)
	{
		for (let col_offset = -1; col_offset <= 1; col_offset++)
		{
			numbers.lastIndex = 0

			if (memory[row_offset + 1][col_offset + 1] === 1)
				continue
			else if (numbers.test(schematic[row + row_offset][col + col_offset]) === true)
			{
				num = get_number(row + row_offset, col + col_offset)

				gear_ratio *= num

				number_of_adj += 1
			}

			// stop same dot reading same number
			while (col_offset <= 1)
			{
				numbers.lastIndex = 0
				if (numbers.test(schematic[row + row_offset][col + col_offset]) === false)
					break

				memory[row_offset + 1][col_offset + 1] = 1
				col_offset++
			}
		}
	}

	if (number_of_adj === 2)
		return (gear_ratio)
	else
		return (0)
}

for (let i = 0; i < schematic.length; ++i)
{
	console.log(schematic[i])
	for (let result of schematic[i].matchAll(/[*]/g))
		sum += handle_surrounding_numbers(i, result.index)
}

console.log("Sum: " + sum)