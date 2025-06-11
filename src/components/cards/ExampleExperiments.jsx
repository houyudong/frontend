import React, { useState, useEffect } from 'react';
import ExperimentCard from './ExperimentCard';
import './ExampleExperiments.css';

const ExampleExperiments = () => {
  // 示例实验数据
  const [experiments, setExperiments] = useState([
    {
      id: 1,
      title: 'LED Blink',
      description: 'Learn how to control LEDs using GPIO pins. This experiment demonstrates the basics of digital output.',
      type: 'gpio',
      difficulty: 'beginner',
      timeEstimate: 15,
      imageUrl: '/images/experiments/led_blink.jpg',
      tags: ['GPIO', 'LED', 'Digital Output']
    },
    {
      id: 2,
      title: 'Button Input',
      description: 'Read the state of a push button and control an LED based on button presses.',
      type: 'gpio',
      difficulty: 'beginner',
      timeEstimate: 20,
      imageUrl: '/images/experiments/button_input.jpg',
      tags: ['GPIO', 'Button', 'Digital Input']
    },
    {
      id: 3,
      title: 'UART Communication',
      description: 'Send and receive data between your STM32 and computer via the serial port.',
      type: 'serial',
      difficulty: 'intermediate',
      timeEstimate: 30,
      imageUrl: '/images/experiments/uart_comm.jpg',
      tags: ['UART', 'Serial', 'Communication']
    },
    {
      id: 4,
      title: 'I2C Temperature Sensor',
      description: 'Interface with an I2C temperature sensor and display readings.',
      type: 'i2c',
      difficulty: 'intermediate',
      timeEstimate: 45,
      imageUrl: '/images/experiments/i2c_temp.jpg',
      tags: ['I2C', 'Sensor', 'Temperature']
    },
    {
      id: 5,
      title: 'SPI OLED Display',
      description: 'Control an OLED display using SPI communication to show text and graphics.',
      type: 'spi',
      difficulty: 'advanced',
      timeEstimate: 60,
      imageUrl: '/images/experiments/spi_oled.jpg',
      tags: ['SPI', 'Display', 'Graphics']
    },
    {
      id: 6,
      title: 'ADC Light Sensor',
      description: 'Measure ambient light levels using an analog light sensor and the ADC.',
      type: 'adc',
      difficulty: 'intermediate',
      timeEstimate: 30,
      imageUrl: '/images/experiments/adc_light.jpg',
      tags: ['ADC', 'Analog', 'Sensor']
    }
  ]);

  // 过滤状态
  const [filters, setFilters] = useState({
    type: 'all',
    difficulty: 'all'
  });

  // 过滤后的实验
  const [filteredExperiments, setFilteredExperiments] = useState(experiments);

  // 处理过滤器变化
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // 当过滤器变化时更新过滤后的实验
  useEffect(() => {
    let results = [...experiments];

    if (filters.type !== 'all') {
      results = results.filter(exp => exp.type === filters.type);
    }

    if (filters.difficulty !== 'all') {
      results = results.filter(exp => exp.difficulty === filters.difficulty);
    }

    setFilteredExperiments(results);
  }, [filters, experiments]);

  return (
    <div className="container mx-auto px-4 py-8 experiments-container">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 section-title">Example Experiments</h2>
      <p className="text-center max-w-3xl mx-auto mb-8 text-gray-600 section-description">
        Explore these example experiments to learn different aspects of STM32 programming.
        Each experiment includes step-by-step instructions and code examples.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8 filters-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="mb-3">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by type
            </label>
            <select
              id="type-filter"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="gpio">GPIO</option>
              <option value="serial">Serial/UART</option>
              <option value="i2c">I2C</option>
              <option value="spi">SPI</option>
              <option value="adc">ADC</option>
              <option value="timer">Timer</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by difficulty
            </label>
            <select
              id="difficulty-filter"
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 experiment-cards-container">
        {filteredExperiments.length > 0 ? (
          filteredExperiments.map(experiment => (
            <div key={experiment.id} className="mb-4">
              <ExperimentCard
                id={experiment.id}
                title={experiment.title}
                description={experiment.description}
                type={experiment.type}
                difficulty={experiment.difficulty}
                timeEstimate={experiment.timeEstimate}
                imageUrl={experiment.imageUrl}
                tags={experiment.tags}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-gray-50 p-8 text-center rounded-lg no-results">
              <p className="text-lg text-gray-600">No experiments match your filters. Try changing the filter criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExampleExperiments;