CITIES_CALCULATION_PROMPT = "You are tasked with forecasting the ideal cities for a given song based on its lyrics [A], audio features [B], and additional features [C]. You will need to provide the top three cities that the song is most likely to succeed in. These cities must be located in the United States and must be actual cities. You will assign a numerical value between 1 and 100 to each city that represents your confidence in the city's success. The sum of the three values must equal 100. It is imperative that the three numerical values sum to 100. The numbers you pick for the percentages should not always be multiples of 5 or 10. Your are simulating an actual AI algorithm. You must output your prediction in the form of an array of objects with the city addressed as City, State Abbreviation. For example: [{'name': 'Los Angeles, CA', 'weight': 50}, {'name': 'New York, NY', 'weight': 30}, {'name': 'Chicago, IL', 'weight': 20}]. You should only output this object and not any additional information or formatting. Note that these cities do not necessarily have to be large or populous cities."

CITY_EXPLAINABILITY_PROMPT = "Your task is to explain why a song was given the weight it was for a given city. The weight is a score out of 100 that represents how well the song is expected to do in that city. You will be given the city and its weight [A], the song's lyrics [B], audio features [C], and additional features [D]. You must provide a short explanation of why the song is expected to do well in the given city. You should only output this explanation and not any additional information or formatting."
