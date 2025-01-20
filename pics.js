// Importação centralizada das imagens
import sunIcon from "./img/weather/ensolarado.png";
import rainIcon from "./img/weather/nublado comchuva.png";
import stormIcon from "./img/weather/chuva com relâmpago.png";
import snowIcon from "./img/weather/neve.png";
import partlyCloudyIcon from "./img/weather/sol entre nuvens.png";
import cloudyIcon from "./img/weather/nublado.png";
import lightningIcon from "./img/weather/relâmpago.png";
import partlySunnyShowersIcon from "./img/weather/sol entre nuves com chuva.png";

// Mapeamento de condições climáticas para ícones
const weatherIcons = {
  Sunny: sunIcon,
  Rain: rainIcon,
  Storm: stormIcon,
  Snow: snowIcon,
  "Mostly cloudy": partlyCloudyIcon,
  Cloudy: cloudyIcon,
  Lightning: lightningIcon,
  "Partly sunny w/ showers": partlySunnyShowersIcon,
};

// Função para obter o ícone com fallback padrão
export const getWeatherIcon = (weatherText) => {
  return weatherIcons[weatherText] || sunIcon; // Ícone padrão: ensolarado
};
