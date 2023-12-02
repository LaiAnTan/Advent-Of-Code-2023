const fs = require('fs');

const data = fs.readFileSync('input.txt', 'utf8');

const strs = data.split('\n');

const nums_regex = /[0-9]/;

let sum = 0;

let real_numbers = {
	'one': '1',
	'two': '2',
	'three': '3',
	'four': '4',
	'five': '5',
	'six': '6',
	'seven': '7',
	'eight': '8',
	'nine': '9'
}

// in_reverse = true reverses the string and key of dict
function locate_number(str, in_reverse)
{
	if (in_reverse == true)
		str = str.split('').reverse().join('');

	let key_to_check;
	let smallest = null; // [key, index]

	for (let key in real_numbers)
	{
		if (in_reverse == true)
			key_to_check = key.split('').reverse().join('');
		else
			key_to_check = key;
		
		let idx = str.search(key_to_check);
		if ((smallest == null && idx != -1) || (idx != -1 && idx < smallest[1]))
			smallest = [key, idx];
	}

	let first_fake_idx = str.search(nums_regex);

	if (first_fake_idx == -1)
		return (real_numbers[smallest[0]]);

	if (smallest == null || first_fake_idx < smallest[1])
		return (str[first_fake_idx]);
	else
		return (real_numbers[smallest[0]]);
}

for (let i = 0; i < strs.length; i++)
{
	let first_num = locate_number(strs[i]);
	let last_num = locate_number(strs[i], true);

	if (first_num != null && last_num != null)
	{
		sum += parseInt(first_num + last_num);
	}
}

console.log("Sum: " + sum);