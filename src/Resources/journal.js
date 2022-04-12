module.exports = [
	{
		Question: 'You woke up on a cloud...',
		Options: [
			{
				name: 'Jump down',
				next: {
					Response: 'You died of fall damage.',
					Question: null,
					Death: true,
				},
			},
			{
				name: 'Command it',
				next: {
					Response: 'At your words, wiz.',
					Question: 'What should we command it...?',
					Options: [
						{
							name: 'Take me down!',
							next: {
								Response: 'Sure! *fades away*\nYou\'re now on a weird looking land..',
								Question: 'Where should we go next?',
								Options: [
									{
										name: 'The weird looking shop',
										next: {
											REsponse: 'The seller killed you.',
											Question: null,
											Death: true,
										},
									},
									{
										name: 'Stadium', // totally not inspired by owl house c:
										next: {/** */},
									},
								],
							},
						},
					],
				},
			},
		],
	},
];