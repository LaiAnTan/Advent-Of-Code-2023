const fs = require('fs');

const data = fs.readFileSync('input.txt', 'utf8');

const strs = data.split('\n');

const nums_regex = /[0-9]/;

let sum = 0;

for (let i = 0; i < strs.length; i++)
{
	let first_num = strs[i].match(nums_regex);
	let last_num = strs[i].split('').reverse().join('').match(nums_regex);

	if (first_num != null && last_num != null)
	{
		sum += parseInt(first_num + last_num);
	}
}

console.log("Sum: " + sum);