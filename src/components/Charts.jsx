import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { getBrandColor } from '../styles/colors';

Chart.register(...registerables);

export function BarChart({ data, xKey, yKey, xLabel, yLabel, colorBy, groupBy }) {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    const ctx = chartRef.current.getContext('2d');
    
    // Group data if groupBy is provided
    let datasets = [];
    if (groupBy) {
      const groups = [...new Set(data.map(item => item[groupBy]))];
      datasets = groups.map(group => {
        const groupData = data.filter(item => item[groupBy] === group);
        return {
          label: group,
          data: groupData.map(item => item[yKey]),
          backgroundColor: group === groups[0] ? '#ef5350' : '#42a5f5'
        };
      });
    } else {
      datasets = [{
        label: yLabel,
        data: data.map(item => item[yKey]),
        backgroundColor: colorBy 
          ? data.map(item => getBrandColor(item[colorBy]))
          : '#42a5f5'
      }];
    }
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: groupBy ? [...new Set(data.map(item => item[xKey]))] : data.map(item => item[xKey]),
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: yLabel
            }
          },
          x: {
            title: {
              display: true,
              text: xLabel
            }
          }
        }
      }
    });
    
    return () => chart.destroy();
  }, [data, xKey, yKey, xLabel, yLabel, colorBy, groupBy]);
  
  return <canvas ref={chartRef} />;
}

export function LineChart({ data, xKey, yKey, xLabel, yLabel }) {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    const ctx = chartRef.current.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item[xKey]),
        datasets: [{
          label: yLabel,
          data: data.map(item => item[yKey]),
          borderColor: '#ef5350',
          backgroundColor: 'rgba(239, 83, 80, 0.1)',
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: yLabel
            }
          },
          x: {
            title: {
              display: true,
              text: xLabel
            }
          }
        }
      }
    });
    
    return () => chart.destroy();
  }, [data, xKey, yKey, xLabel, yLabel]);
  
  return <canvas ref={chartRef} />;
}
