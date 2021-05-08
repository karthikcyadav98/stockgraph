import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Spinner from '../assets/loading.gif';

const HighStockChart = () => {
  const [state, setState] = useState({
    stockSymbol: 'RELIANCE.BSE',
    dataType: 'TIME_SERIES_DAILY_ADJUSTED',
    stockChartXValues: [],
    stockChartYValues: [],
    loading: true,
  });

  useEffect(() => {
    fetchStock(state.dataType);
  }, []);

  const fetchStock = (dataType) => {
    const API_KEY = 'HGJWFG4N8AQ66ICD';
    let API_Call = '';
    let arrKey = '';
    if (dataType === 'TIME_SERIES_DAILY_ADJUSTED') {
      API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=RELIANCE.BSE&outputsize=compact&apikey=${API_KEY}`;
      arrKey = 'Time Series (Daily)';
    } else if (dataType === 'TIME_SERIES_WEEKLY_ADJUSTED') {
      API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=RELIANCE.BSE&apikey=${API_KEY}`;
      arrKey = 'Weekly Adjusted Time Series';
    } else if (dataType === 'TIME_SERIES_MONTHLY_ADJUSTED') {
      API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=RELIANCE.BSE&apikey=${API_KEY}`;
      arrKey = 'Monthly Adjusted Time Series';
    }

    let stockChartXValuesFunction = [];
    let stockChartYValuesFunction = [];

    fetch(API_Call)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        for (var key in data[arrKey]) {
          stockChartXValuesFunction.push(key);
          stockChartYValuesFunction.push(Number(data[arrKey][key]['1. open']));
        }

        setState({
          stockChartXValues: stockChartXValuesFunction,
          stockChartYValues: stockChartYValuesFunction,
          loading: false,
        });
      });
  };

  const handleDataChange = (type) => {
    setState({ dataType: type, loading: true });
    fetchStock(type);
  };

  if (!state.loading) {
    return (
      <div>
        <div style={{ marginLeft: 30, marginTop: 20 }}>
          <button
            onClick={() => handleDataChange('TIME_SERIES_DAILY_ADJUSTED')}
            style={{ marginLeft: 10 }}>
            Daily
          </button>
          <button
            onClick={() => handleDataChange('TIME_SERIES_WEEKLY_ADJUSTED')}
            style={{ marginLeft: 10 }}>
            Weekly
          </button>
          <button
            onClick={() => handleDataChange('TIME_SERIES_MONTHLY_ADJUSTED')}
            style={{ marginLeft: 10 }}>
            Monthly
          </button>
        </div>

        <HighchartsReact
          ChartTitle={state.stockSymbol}
          highcharts={Highcharts}
          options={{
            xAxis: {
              categories: state.stockChartXValues,
            },
            series: [
              {
                name: 'value',
                data: state.stockChartYValues,
              },
            ],
          }}
        />
      </div>
    );
  } else {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <img src={Spinner} />
      </div>
    );
  }
};

export default HighStockChart;
