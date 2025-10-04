export default async function handler(request, response) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const { city } = request.query;

  if (!city) {
    return response.status(400).json({ error: 'City parameter is required' });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    if (data.cod && data.cod !== 200) {
        return response.status(data.cod).json({ 
            error: data.message || 'Error from weather API' 
        });
    }

    response.status(200).json(data);

  } catch (error) {
    console.error('Serverless Function Error:', error);
    response.status(500).json({ error: 'Internal server error processing the request.' });
  }
}