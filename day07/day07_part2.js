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
	five_of_a_kind: 0,
	four_of_a_kind: 1,
	full_house: 2,
	three_of_a_kind: 3,
	two_pair: 4,
	one_pair: 5,
	high_card: 6
}

const strength = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']

function compare_cards(a, b)
{
	let a_strength = strength.indexOf(a)
	let b_strength = strength.indexOf(b)

	if (a_strength > b_strength)
		return (1)
	else if (a_strength < b_strength)
		return (-1)
	else
		return (0)
}

function same_chars(arr, char)
{
	return (arr.filter((element) => element === char).length)
}

function get_hand_type_no_joker(hand)
{
	if (same_chars(hand, hand[2]) === 5) // five of a kind
		return (hand_type.five_of_a_kind)
	else if (same_chars(hand, hand[2]) === 4) // four of a kind
		return (hand_type.four_of_a_kind)
	else if (same_chars(hand, hand[2]) === 3)
	{
		if (same_chars(hand, hand[0]) === 2 || same_chars(hand, hand[4]) === 2) // full house
			return (hand_type.full_house)
		else
			return (hand_type.three_of_a_kind)
	}
	else if ((same_chars(hand, hand[0]) === 2 && same_chars(hand, hand[2]) === 2) 
				|| (same_chars(hand, hand[1]) === 2 && same_chars(hand, hand[3]) === 2)
				|| (same_chars(hand, hand[0]) === 2 && same_chars(hand, hand[3]) === 2)
			) // two pair AABBx xAABB AAxBB
		return (hand_type.two_pair)
	else if ((same_chars(hand, hand[0]) === 2) || (same_chars(hand, hand[1]) === 2)
				|| (same_chars(hand, hand[2]) === 2) || (same_chars(hand, hand[3]) === 2)
			) // pair AAxyz xAAyz xyAAz xyzAA
		return (hand_type.one_pair)
	else
		return (hand_type.high_card)
}

function get_hand_type(hand)
{
	// hand = hand.split('')

	hand.sort(compare_cards)

	// console.log("Hand:", hand)

	let jokers = same_chars(hand, 'J')

	switch (jokers)
	{
		case 5:
		case 4: // A + JJJJ = five
			return (hand_type.five_of_a_kind)
		case 3:
			if (same_chars(hand, hand[3]) === 2) // remaining pair AA + JJJ = five
				return (hand_type.five_of_a_kind)
			else // xA + JJJ = four
				return (hand_type.four_of_a_kind)
		case 2:
			if (same_chars(hand, hand[2]) === 3) // remaining triple AAA + JJ = five
				return (hand_type.five_of_a_kind)
			else if (same_chars(hand, hand[3]) === 2) // remaining pair xAA AAx + JJ = four
				return (hand_type.four_of_a_kind)
			else // xxA + JJ = triple
				return (hand_type.three_of_a_kind)
		case 1:
			if (same_chars(hand, hand[1]) === 4) // AAAA + J = five
				return (hand_type.five_of_a_kind) 
			else if (same_chars(hand, hand[2]) === 3) // xAAA AAAx + J = four
				return (hand_type.four_of_a_kind)
			else if (same_chars(hand, hand[1]) === 2 && same_chars(hand, hand[3]) === 2) // AABB + J = full
				return (hand_type.full_house)
			else if (same_chars(hand, hand[1]) === 2 || same_chars(hand, hand[3]) === 2) // AAxx xAAx xxAA + J = three
				return (hand_type.three_of_a_kind)
			else // A + J = pair
				return (hand_type.one_pair)
		case 0:
			return (get_hand_type_no_joker(hand))
	}

}

function compare_hands(a, b)
{
	let a_hand = get_hand_type(a[0])
	let b_hand = get_hand_type(b[0])

	console.log(a_hand, b_hand)

	if (a_hand < b_hand)
		return (-1)
	else if (b_hand < a_hand)
		return (1)
	else
	{
		for (let i = 0; i < a[0].length; i++) // fuck i am retarded
		{
			let res = compare_cards(a[0][i], b[0][i])
			if (res > 0)
				return (-1)
			else if (res < 0)
				return (1)
		}
		console.log("both equal wtf")
		return (0)
	}
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

hands.sort(compare_hands).reverse()

console.log(hands)

// console.log(JSON.stringify(hands, null, 2))

let winnings = 0

for (let i = 0; i < hands.length; i++)
	winnings += (hands[i][1]) * (i + 1)

console.log("Winnings:", winnings)

//console.log(compare_hands(["KK677", 0], ["KTJJT", 0]))
