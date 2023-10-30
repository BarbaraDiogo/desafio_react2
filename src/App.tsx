import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface WeatherProps {
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

export function App() {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherProps | null>(null);
  const [status, setStatus] = useState<'init' | 'loading' | '200' | '404' | 'error'>('init');

  const fetchWeather = useCallback(async () => {
    try {
      setStatus('loading');
      setWeatherData(null);

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=937169feb60bf3c0f6fbaaad8155469f
        `
      );

      if (response.status === 200) {
        setWeatherData(response.data);
        setStatus('200');
      } else {
        setStatus('404');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, [city]);

  useEffect(() => {
    if (status !== 'init') {
      setStatus('init');
    }
  }, [city]);

  return (
    <div className="flex justify-center items-center w-[100vw] min-h-[100vh] p-2 bg-gray-900">
      <div className="w-[400px] min-h-[200px] bg-gray-700 rounded flex flex-col items-start p-4 text-white">
        <h1 className="text-2xl font-semibold">Previsão do Tempo</h1>

        <div className="w-full mt-4 flex flex-col">
          <label className="font-semibold">Cidade:</label>
          <input
            className="bg-gray-900 rounded p-2 mt-1 text-white outline-none w-full"
            placeholder="Digite o nome da cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="off"
          />
        </div>

        {status === 'init' && (
          <button
            className="mt-2 bg-gray-900 p-2 rounded active:bg-gray-800 font-semibold"
            onClick={fetchWeather}
          >
            Carregar Previsão
          </button>
        )}

        {status === '404' && (
          <div className="mt-6 w-full flex flex-row items-center justify-center bg-gray-800 rounded p-2">
            Cidade não encontrada.
          </div>
        )}

        {status === 'loading' && (
          <div className="mt-6 w-full flex flex-row items-center justify-center bg-gray-800 rounded p-2">
            Carregando...
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 w-full flex flex-row items-center justify-center bg-gray-800 rounded p-2">
            Ocorreu um erro.
          </div>
        )}

        {status === '200' && weatherData && (
          <div className="mt-6 w-full flex flex-row items-center justify-center bg-gray-800 rounded p-2">
            <div>
              <h2 className="font-bold">Previsão do Tempo para {city}</h2>
              <p className="text-sm text-gray-400">{weatherData.weather[0].description}</p>
              <p className="text-lg font-bold">{weatherData.main.temp}°C</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
