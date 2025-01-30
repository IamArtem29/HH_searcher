'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsDarkUnica from 'highcharts/themes/dark-unica';
import { useTheme } from 'next-themes';

type ChartProps = {
  options: Highcharts.Options;
};

const lightTheme = {
  colors: [
    '#7cb5ec',
    '#434348',
    '#90ed7d',
    '#f7a35c',
    '#8085e9',
    '#f15c80',
    '#e4d354',
    '#2b908f',
    '#f45b5b',
    '#91e8e1',
  ],
  chart: {
    backgroundColor: '#ffffff',
    style: {
      fontFamily: "'Unica One', sans-serif",
    },
    plotBorderColor: '#cccccc',
  },
  title: {
    style: {
      color: '#333333',
      textTransform: 'uppercase',
      fontSize: '20px',
    },
  },
  subtitle: {
    style: {
      color: '#333333',
      textTransform: 'uppercase',
    },
  },
  xAxis: {
    gridLineColor: '#e6e6e6',
    labels: {
      style: {
        color: '#333333',
      },
    },
    lineColor: '#e6e6e6',
    minorGridLineColor: '#e6e6e6',
    tickColor: '#e6e6e6',
    title: {
      style: {
        color: '#333333',
      },
    },
  },
  yAxis: {
    gridLineColor: '#e6e6e6',
    labels: {
      style: {
        color: '#333333',
      },
    },
    lineColor: '#e6e6e6',
    minorGridLineColor: '#e6e6e6',
    tickColor: '#e6e6e6',
    tickWidth: 1,
    title: {
      style: {
        color: '#333333',
      },
    },
  },
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    style: {
      color: '#333333',
    },
  },
  plotOptions: {
    series: {
      dataLabels: {
        color: '#333333',
      },
      marker: {
        lineColor: '#333333',
      },
    },
    boxplot: {
      fillColor: '#e6e6e6',
    },
    candlestick: {
      lineColor: 'white',
    },
    errorbar: {
      color: 'white',
    },
  },
  legend: {
    itemStyle: {
      color: '#333333',
    },
    itemHoverStyle: {
      color: '#000000',
    },
    itemHiddenStyle: {
      color: '#cccccc',
    },
  },
  credits: {
    style: {
      color: '#333333',
    },
  },
  labels: {
    style: {
      color: '#333333',
    },
  },
  drilldown: {
    activeAxisLabelStyle: {
      color: '#333333',
    },
    activeDataLabelStyle: {
      color: '#333333',
    },
  },
  navigation: {
    buttonOptions: {
      symbolStroke: '#333333',
      theme: {
        fill: '#e6e6e6',
      },
    },
  },
  rangeSelector: {
    buttonTheme: {
      fill: '#e6e6e6',
      stroke: '#333333',
      style: {
        color: '#333333',
      },
      states: {
        hover: {
          fill: '#cccccc',
          stroke: '#333333',
          style: {
            color: 'white',
          },
        },
        select: {
          fill: '#000000',
          stroke: '#333333',
          style: {
            color: 'white',
          },
        },
      },
    },
    inputBoxBorderColor: '#e6e6e6',
    inputStyle: {
      backgroundColor: '#ffffff',
      color: '#333333',
    },
    labelStyle: {
      color: '#333333',
    },
  },
  navigator: {
    handles: {
      backgroundColor: '#e6e6e6',
      borderColor: '#cccccc',
    },
    outlineColor: '#cccccc',
    maskFill: 'rgba(255,255,255,0.1)',
    series: {
      color: '#7798BF',
      lineColor: '#A6C7ED',
    },
    xAxis: {
      gridLineColor: '#e6e6e6',
    },
  },
  scrollbar: {
    barBackgroundColor: '#cccccc',
    barBorderColor: '#cccccc',
    buttonArrowColor: '#333333',
    buttonBackgroundColor: '#e6e6e6',
    buttonBorderColor: '#e6e6e6',
    rifleColor: '#333333',
    trackBackgroundColor: '#f2f2f2',
    trackBorderColor: '#f2f2f2',
  },
};

export const Chart = ({ options }: ChartProps) => {
  const { theme } = useTheme();

  const [chartOptions, setChartOptions] = useState(options);

  useEffect(() => {
    if (typeof Highcharts === 'object') {
      HighchartsExporting(Highcharts);

      // Применяем темную тему, если текущая тема приложения - темная
      if (theme === 'dark') {
        HighchartsDarkUnica(Highcharts);
      } else {
        // Применяем светлую тему
        Highcharts.setOptions(lightTheme);
      }

      // Обновляем опции графика для перерисовки
      setChartOptions({ ...options });
    }
  }, [theme, options]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      // className="highcharts-dark"
    />
  );
};
