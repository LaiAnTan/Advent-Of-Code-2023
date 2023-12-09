// includes

const fs = require("fs")

function parse_hands(data)
{
	let lines = data.split('\n')
	let hands = []

	for (let line of lines)
	{
		line = line.split(' ')
		hands.push([line[0], parseInt(line[1])]) // [hand, bid]
	}
	return (hands)
}

const hand_type = {
	five_of_a_kind: 1,
	four_of_a_kind: 2,
	full_house: 3,
	three_of_a_kind: 4,
	pair: 5,
	high_card: 6
}

const strength = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

function compare_cards(a, b)
{
	return (strength.indexOf(a) - strength.indexOf(b))
}

function get_hand_type(hand)
{
	hand = hand.split('')

	hand.sort(compare_cards)

	console.log("Hand:", hand)

	let same = hand.filter((element) => element === hand[0]).length

	switch (same)
	{
		case (hand.length):
			return (hand_type.five_of_a_kind)
		case (hand.length - 1):
			return (hand_type.four_of_a_kind)
		case (hand.length - 2):
			if (hand.filter((element) => element === hand[3]).length === 2)
				return (hand_type.full_house)
			else
				return (hand_type.three_of_a_kind)
	}
}

function compare_hands(a, b)
{
	// compares hands
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

let hands = parse_hands(data)

// hands.sort(compare_hands)

// console.log(hands)

console.log(get_hand_type('23332'))