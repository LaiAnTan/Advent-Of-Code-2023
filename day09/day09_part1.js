// includes

const fs = require('fs')

// functions

function parse_input(data)
{
	let histories = []

	let lines = data.split('\n')

	for (let line of lines)
		histories.push(line.split(' ').map((element) => parseInt(element)))
	return (histories)
}

function calc_diff(arr)
{
	let diffs = []

	for (let i = 1; i < arr.length; i++)
		diffs.push(arr[i] - arr[i - 1])

	return (diffs)
}

function process_history(history)
{
	let layers = [history]
	let next_layer = []

	while (true)
	{
		next_layer = calc_diff(layers[layers.length - 1])
		if (next_layer.filter((element) => element === 0).length === next_layer.length)
			break
		layers.push(next_layer)
	}
	return (layers)
}

// uses return from process_history function
function extrapolate(layers)
{
	let extrapolated = layers[layers.length - 1][0]

	for (let i = layers.length - 2; i >= 0; i--)
	{
		extrapolated += layers[i][layers[i].length - 1]
	}
	return (extrapolated)
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

let histories = parse_input(data)

console.log(histories)

let sum = 0

for (let history of histories)
	sum += extrapolate(process_history(history))

console.log("Sum:", sum)