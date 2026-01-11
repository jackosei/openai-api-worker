import OpenAi from 'openai'

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'POST, OPTIONS'

}

export default {
	async fetch(request, env, ctx) {

		// Handle CORS preflight requests
		if(request.method === "OPTIONS") {
			return new Response(null, { headers, corsHeaders })
		}
		
		const openaiClient = new OpenAi({
			apiKey: env.OPENAI_API_KEY
		})

		try {
			const chatCompletion = await openaiClient.chat.completions.create({
				model: 'gpt-4.1-nano',
				messages: [
					{
						role: 'system',
						content: 'Limit all your response to 100 words maximum.'
					},
					{
						role: 'user',
						content: 'Should I trust stock predictions from Dodgy Dave?'
					}
				],
				temperature: 1.1,
				presence_penalty: 0,
				frequency_penalty: 0,
				max_tokens: 100
			})

			const response = chatCompletion.choices[0].message

			return new Response(JSON.stringify(response), { headers: corsHeaders })
		} catch(err) {
			return new Response(err, { headers: corsHeaders })
		}
	},
};
