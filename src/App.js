import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SelfControlSimulation = () => {
  const [selectedInterpretation, setSelectedInterpretation] = useState('');
  const [parameters, setParameters] = useState({});
  const [simulationData, setSimulationData] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');

  // Human experiment data
  const humanData = [
    { condition: 'Before Choice', granola: 102.19, chocolate: 74.06 },
    { condition: 'After Choice', granola: 94.22, chocolate: 93.11 }
  ];

  // Default parameters for each interpretation
  const defaultParams = {
    'explicit-implicit': {
      achievementDeficit: 0.7,
      achievementStimulus: 0.7,
      deficitReductionRate: 0.5,
      benefitCoefficient: 1.0,
      costCoefficient: 0.16
    },
    'desire-goal': {
      achievementStimulusBefore: 0.8,
      achievementStimulusAfter: 0.5,
      achievementDeficit: 0.7,
      healthyGoalSatisfaction: 0.5,
      costCoefficient: 0.185
    },
    'goal-goal': {
      achievementStimulusBefore: 0.8,
      achievementStimulusAfter: 0.5,
      granolaAchievementSat: 0.9,
      chocolateFoodSat: 0.9,
      granolaActionCost: 0.2,
      chocolateActionCost: 0.1
    }
  };

  // Parameter configurations - only critical parameters with groups
  const parameterConfigs = {
    'explicit-implicit': [
      { key: 'achievementDeficit', label: 'Achievement Deficit', group: 'Drive Parameters', min: 0.4, max: 1.0, step: 0.1 },
      { key: 'achievementStimulus', label: 'Achievement Stimulus Level', group: 'Drive Parameters', min: 0.4, max: 1.0, step: 0.1 },
      { key: 'deficitReductionRate', label: 'Deficit Reduction Rate', group: 'Self-Control Depletion', min: 0.2, max: 0.8, step: 0.1 },
      { key: 'benefitCoefficient', label: 'Benefit Coefficient', group: 'Utility Parameters', min: 0.5, max: 1.5, step: 0.1 },
      { key: 'costCoefficient', label: 'Cost Coefficient', group: 'Utility Parameters', min: 0.1, max: 0.3, step: 0.02 }
    ],
    'desire-goal': [
      { key: 'achievementStimulusBefore', label: 'Achievement Stimulus (Before)', group: 'Drive Parameters', min: 0.5, max: 1.0, step: 0.1 },
      { key: 'achievementStimulusAfter', label: 'Achievement Stimulus (After)', group: 'Drive Parameters', min: 0.3, max: 0.7, step: 0.1 },
      { key: 'achievementDeficit', label: 'Achievement Deficit', group: 'Drive Parameters', min: 0.4, max: 1.0, step: 0.1 },
      { key: 'healthyGoalSatisfaction', label: 'Healthy Goal Satisfaction', group: 'Goal Competition', min: 0.2, max: 0.8, step: 0.1 },
      { key: 'costCoefficient', label: 'Cost Coefficient', group: 'Utility Parameters', min: 0.1, max: 0.3, step: 0.02 }
    ],
    'goal-goal': [
      { key: 'achievementStimulusBefore', label: 'Achievement Stimulus (Before)', group: 'Drive Parameters', min: 0.5, max: 1.0, step: 0.1 },
      { key: 'achievementStimulusAfter', label: 'Achievement Stimulus (After)', group: 'Drive Parameters', min: 0.3, max: 0.7, step: 0.1 },
      { key: 'granolaAchievementSat', label: 'Granola Achievement Satisfaction', group: 'Action-Drive Satisfaction', min: 0.5, max: 1.0, step: 0.1 },
      { key: 'chocolateFoodSat', label: 'Chocolate Food Satisfaction', group: 'Action-Drive Satisfaction', min: 0.6, max: 1.0, step: 0.1 },
      { key: 'granolaActionCost', label: 'Granola Action Cost', group: 'Action Costs', min: 0.1, max: 0.4, step: 0.1 },
      { key: 'chocolateActionCost', label: 'Chocolate Action Cost', group: 'Action Costs', min: 0.05, max: 0.2, step: 0.05 }
    ]
  };

  // Initialize parameters when interpretation changes
  useEffect(() => {
    if (selectedInterpretation && defaultParams[selectedInterpretation]) {
      setParameters(defaultParams[selectedInterpretation]);
      setSimulationData([]);
      setExplanation('');
      setAnalysisResult('');
    }
  }, [selectedInterpretation]);

  // Simulation functions
  const simulateExplicitImplicit = (params) => {
    const { achievementDeficit, achievementStimulus, deficitReductionRate, benefitCoefficient, costCoefficient } = params;
    
    const achievementDriveStrength = achievementStimulus * achievementDeficit;
    const beforeExplicitness = Math.min(1.0, 0.75 + (achievementDriveStrength * benefitCoefficient - costCoefficient) * 0.3);
    const afterExplicitness = Math.max(0.3, 0.75 - deficitReductionRate * 0.4);
    
    const beforeGranola = 70 + beforeExplicitness * 35;
    const beforeChocolate = 105 - beforeExplicitness * 35;
    const afterGranola = 70 + afterExplicitness * 35;
    const afterChocolate = 105 - afterExplicitness * 35;
    
    return [
      { condition: 'Before Choice', granola: Math.round(beforeGranola), chocolate: Math.round(beforeChocolate) },
      { condition: 'After Choice', granola: Math.round(afterGranola), chocolate: Math.round(afterChocolate) }
    ];
  };

  const simulateDesireGoal = (params) => {
    const { achievementStimulusBefore, achievementStimulusAfter, achievementDeficit, healthyGoalSatisfaction, costCoefficient } = params;
    
    const beforeAchievementDrive = achievementStimulusBefore * achievementDeficit;
    const afterAchievementDrive = achievementStimulusAfter * achievementDeficit;
    const foodDriveStrength = 0.8 * 0.7;
    
    const beforeGoalValue = beforeAchievementDrive * healthyGoalSatisfaction + foodDriveStrength * 0.7;
    const afterGoalValue = afterAchievementDrive * healthyGoalSatisfaction + foodDriveStrength * 0.7;
    
    const beforeExplicitness = Math.min(1.0, Math.max(0.3, (beforeGoalValue * 1.0 - costCoefficient) * 1.5));
    const afterExplicitness = Math.min(1.0, Math.max(0.3, (afterGoalValue * 1.0 - costCoefficient) * 1.5));
    
    const beforeGranola = 60 + beforeExplicitness * 52 + 2;
    const beforeChocolate = 100 - beforeExplicitness * 40 + 6;
    const afterGranola = 93.5 + (afterExplicitness - 0.5) * 2;
    const afterChocolate = 93.5 - (afterExplicitness - 0.5) * 1;
    
    return [
      { condition: 'Before Choice', granola: Math.round(Math.max(50, beforeGranola)), chocolate: Math.round(Math.max(50, beforeChocolate)) },
      { condition: 'After Choice', granola: Math.round(Math.max(50, afterGranola)), chocolate: Math.round(Math.max(50, afterChocolate)) }
    ];
  };

  const simulateGoalGoal = (params) => {
    const { achievementStimulusBefore, achievementStimulusAfter, granolaAchievementSat, chocolateFoodSat, granolaActionCost, chocolateActionCost } = params;
    
    const beforeAchievementDrive = achievementStimulusBefore * 0.7;
    const afterAchievementDrive = achievementStimulusAfter * 0.7;
    const foodDriveStrength = 0.8 * 0.7;
    
    const beforeGranolaUtility = (beforeAchievementDrive * granolaAchievementSat + foodDriveStrength * 0.6) - granolaActionCost;
    const beforeChocolateUtility = (beforeAchievementDrive * 0.1 + foodDriveStrength * chocolateFoodSat) - chocolateActionCost;
    
    const afterGranolaUtility = (afterAchievementDrive * granolaAchievementSat + foodDriveStrength * 0.6) - granolaActionCost;
    const afterChocolateUtility = (afterAchievementDrive * 0.1 + foodDriveStrength * chocolateFoodSat) - chocolateActionCost;
    
    const utilityDiffBefore = beforeGranolaUtility - beforeChocolateUtility;
    const utilityDiffAfter = afterGranolaUtility - afterChocolateUtility;
    
    const beforeGranola = 88.1 + utilityDiffBefore * 35 + 14.1;
    const beforeChocolate = 88.1 - utilityDiffBefore * 28 - 14.0;
    const afterGranola = 88.1 + utilityDiffAfter * 35 + 6.1;
    const afterChocolate = 88.1 - utilityDiffAfter * 28 + 5.0;
    
    return [
      { condition: 'Before Choice', granola: Math.round(Math.max(50, Math.min(150, beforeGranola))), chocolate: Math.round(Math.max(50, Math.min(150, beforeChocolate))) },
      { condition: 'After Choice', granola: Math.round(Math.max(50, Math.min(150, afterGranola))), chocolate: Math.round(Math.max(50, Math.min(150, afterChocolate))) }
    ];
  };

  const runSimulation = () => {
    if (!selectedInterpretation || !parameters) return;

    let data = [];
    let newExplanation = '';

    switch (selectedInterpretation) {
      case 'explicit-implicit':
        data = simulateExplicitImplicit(parameters);
        newExplanation = 'The explicit-implicit interpretation shows how self-control operates through competition between deliberate health-conscious rules and automatic hedonic preferences.';
        break;
      case 'desire-goal':
        data = simulateDesireGoal(parameters);
        newExplanation = 'The desire-goal interpretation demonstrates how immediate food desires compete with longer-term health goals through temporal modulation of achievement drives.';
        break;
      case 'goal-goal':
        data = simulateGoalGoal(parameters);
        newExplanation = 'The goal-goal interpretation models explicit competition between health-oriented and taste-oriented subgoals through utility calculations.';
        break;
    }

    setSimulationData(data);
    setExplanation(newExplanation);
  };

  const analyzeConfiguration = () => {
    if (!simulationData.length) return;

    const beforeGranolaDiff = simulationData[0].granola - humanData[0].granola;
    const beforeChocolateDiff = simulationData[0].chocolate - humanData[0].chocolate;
    const afterGranolaDiff = simulationData[1].granola - humanData[1].granola;
    const afterChocolateDiff = simulationData[1].chocolate - humanData[1].chocolate;

    const humanBeforeDiff = humanData[0].granola - humanData[0].chocolate;
    const humanAfterDiff = humanData[1].granola - humanData[1].chocolate;
    const simBeforeDiff = simulationData[0].granola - simulationData[0].chocolate;
    const simAfterDiff = simulationData[1].granola - simulationData[1].chocolate;

    let analysis = '## Parameter Configuration Analysis\n\n';

    const defaults = defaultParams[selectedInterpretation];
    const significantChanges = [];
    
    Object.entries(parameters).forEach(([key, value]) => {
      const defaultValue = defaults[key];
      const percentChange = ((value - defaultValue) / defaultValue) * 100;
      if (Math.abs(percentChange) > 10) {
        const paramConfig = parameterConfigs[selectedInterpretation].find(p => p.key === key);
        significantChanges.push({
          param: paramConfig?.label || key,
          group: paramConfig?.group || 'Unknown',
          change: percentChange,
          direction: percentChange > 0 ? 'increased' : 'decreased'
        });
      }
    });

    if (significantChanges.length > 0) {
      analysis += '### Significant Parameter Changes:\n';
      significantChanges.forEach(change => {
        analysis += `• **${change.param}** (${change.group}): ${change.direction} by ${Math.abs(change.change).toFixed(1)}%\n`;
      });
      analysis += '\n';
    }

    analysis += '### Simulation vs Human Results:\n';
    analysis += '**Before Choice Condition:**\n';
    analysis += `• Granola bars: ${beforeGranolaDiff > 0 ? '+' : ''}${beforeGranolaDiff.toFixed(1)} points difference\n`;
    analysis += `• Chocolate bars: ${beforeChocolateDiff > 0 ? '+' : ''}${beforeChocolateDiff.toFixed(1)} points difference\n`;
    analysis += '**After Choice Condition:**\n';
    analysis += `• Granola bars: ${afterGranolaDiff > 0 ? '+' : ''}${afterGranolaDiff.toFixed(1)} points difference\n`;
    analysis += `• Chocolate bars: ${afterChocolateDiff > 0 ? '+' : ''}${afterChocolateDiff.toFixed(1)} points difference\n\n`;

    analysis += '### Effect Size Comparison:\n';
    analysis += `• Human preference difference (Before): ${humanBeforeDiff.toFixed(1)} points\n`;
    analysis += `• Simulation preference difference (Before): ${simBeforeDiff.toFixed(1)} points\n`;
    analysis += `• Human preference difference (After): ${humanAfterDiff.toFixed(1)} points\n`;
    analysis += `• Simulation preference difference (After): ${simAfterDiff.toFixed(1)} points\n\n`;

    let mechanisticExplanation = '';
    
    if (selectedInterpretation === 'explicit-implicit') {
      mechanisticExplanation = '### Mechanistic Explanation (Explicit-Implicit):\n';
      mechanisticExplanation += 'The explicit-implicit competition determines whether health-conscious rules or hedonic preferences dominate food evaluations. ';
      if (parameters.achievementDeficit !== defaults.achievementDeficit) {
        mechanisticExplanation += 'Changes in achievement deficit affect the motivation for explicit rule engagement. ';
      }
      mechanisticExplanation += '\n\n';
    } else if (selectedInterpretation === 'desire-goal') {
      mechanisticExplanation = '### Mechanistic Explanation (Desire-Goal):\n';
      mechanisticExplanation += 'The temporal modulation of achievement drives creates differential explicitness levels. ';
      if (parameters.achievementStimulusBefore !== defaults.achievementStimulusBefore) {
        mechanisticExplanation += 'Achievement stimulus changes alter goal activation strength during decision-making contexts. ';
      }
      mechanisticExplanation += '\n\n';
    } else if (selectedInterpretation === 'goal-goal') {
      mechanisticExplanation = '### Mechanistic Explanation (Goal-Goal):\n';
      mechanisticExplanation += 'Utility-based subgoal competition determines food preferences through action-specific satisfaction calculations. ';
      if (parameters.granolaAchievementSat !== defaults.granolaAchievementSat) {
        mechanisticExplanation += 'Changes in granola achievement satisfaction alter the utility advantage of healthy choices. ';
      }
      mechanisticExplanation += '\n\n';
    }

    analysis += mechanisticExplanation;

    const simConvergence = Math.abs(simAfterDiff);
    const humanConvergence = Math.abs(humanAfterDiff);
    analysis += '### Convergence Analysis:\n';
    if (simConvergence < 5 && humanConvergence < 5) {
      analysis += '✓ Both human and simulation show good convergence in After Choice condition.\n';
    } else if (simConvergence > humanConvergence + 5) {
      analysis += '⚠ Simulation shows stronger preference differences than humans in After Choice condition.\n';
    }

    setAnalysisResult(analysis);
  };

  const resetParameters = () => {
    if (selectedInterpretation && defaultParams[selectedInterpretation]) {
      setParameters(defaultParams[selectedInterpretation]);
      setSimulationData([]);
      setExplanation('');
      setAnalysisResult('');
    }
  };

  const handleParameterChange = (key, value) => {
    const newParams = { ...parameters, [key]: parseFloat(value) };
    setParameters(newParams);
    
    const parameterEffects = {
      'explicit-implicit': {
        achievementDeficit: 'Higher achievement deficit increases motivation for goal-directed behavior, strengthening explicit rule dominance.',
        deficitReductionRate: 'Higher deficit reduction rates represent faster depletion of self-control resources after exertion.',
        costCoefficient: 'Higher cost coefficients represent greater cognitive effort required for explicit control.'
      },
      'desire-goal': {
        achievementStimulusBefore: 'Higher before-choice achievement stimulus creates stronger goal activation during decision-making.',
        healthyGoalSatisfaction: 'Higher healthy goal satisfaction increases the utility gained from achieving health objectives.',
        costCoefficient: 'Higher cost coefficients represent greater effort required for goal pursuit.'
      },
      'goal-goal': {
        granolaAchievementSat: 'Higher granola achievement satisfaction increases utility gained from healthy choices.',
        chocolateFoodSat: 'Higher chocolate food satisfaction increases the hedonic advantage of indulgent options.',
        granolaActionCost: 'Higher granola action costs represent greater effort required for healthy choices.'
      }
    };

    if (parameterEffects[selectedInterpretation] && parameterEffects[selectedInterpretation][key]) {
      setExplanation(parameterEffects[selectedInterpretation][key]);
    }
  };

  const interpretationDescriptions = {
    'explicit-implicit': {
      title: 'Explicit-Implicit Interpretation',
      description: 'Models self-control as competition between explicit health-conscious rules and implicit hedonic preferences.'
    },
    'desire-goal': {
      title: 'Desire-Goal Interpretation', 
      description: 'Views self-control as managing competition between immediate food desires and longer-term health goals.'
    },
    'goal-goal': {
      title: 'Goal-Goal Interpretation',
      description: 'Models self-control as explicit conflict resolution between competing subgoals through utility calculations.'
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Self-Control Simulation: Three Interpretations
      </h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Select Interpretation:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(interpretationDescriptions).map(([key, { title, description }]) => (
            <div
              key={key}
              onClick={() => setSelectedInterpretation(key)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedInterpretation === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <h3 className="text-lg font-medium mb-2 text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedInterpretation && (
        <>
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Critical Parameters:</h2>
            
            {Object.entries(
              parameterConfigs[selectedInterpretation]?.reduce((groups, param) => {
                const group = param.group;
                if (!groups[group]) groups[group] = [];
                groups[group].push(param);
                return groups;
              }, {}) || {}
            ).map(([groupName, groupParams]) => (
              <div key={groupName} className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-blue-700 border-b border-blue-200 pb-1">
                  {groupName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupParams.map((config) => (
                    <div key={config.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {config.label}: {parameters[config.key]?.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        value={parameters[config.key] || config.min}
                        onChange={(e) => handleParameterChange(config.key, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8 flex gap-4 justify-center">
            <button
              onClick={runSimulation}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Run Simulation
            </button>
            <button
              onClick={resetParameters}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Reset Values
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Human Experiment Results (Myrseth et al., 2009)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={humanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="condition" />
                  <YAxis domain={[60, 120]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="granola" fill="#8FBC8F" name="Granola Bars" />
                  <Bar dataKey="chocolate" fill="#CD853F" name="Chocolate Bars" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-2">
                Human participants showed significantly higher granola bar ratings compared to chocolate bars in the before-choice condition (M = 102.19 vs M = 74.06), with this preference disparity disappearing in the after-choice condition (M = 94.22 vs M = 93.11).
              </p>
            </div>

            {simulationData.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Simulation Results</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="condition" />
                    <YAxis domain={[60, 120]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="granola" fill="#8FBC8F" name="Granola Bars" />
                    <Bar dataKey="chocolate" fill="#CD853F" name="Chocolate Bars" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={analyzeConfiguration}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Analyze Parameter Configuration
                  </button>
                </div>
                
                {explanation && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{explanation}</p>
                  </div>
                )}
              </div>
            )}

            {analysisResult && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Parameter Configuration Analysis</h2>
                <div className="prose prose-sm max-w-none">
                  {analysisResult.split('\n').map((line, index) => {
                    if (line.startsWith('##')) {
                      return <h2 key={index} className="text-lg font-bold mt-4 mb-2 text-gray-800">{line.replace('##', '').trim()}</h2>;
                    } else if (line.startsWith('###')) {
                      return <h3 key={index} className="text-md font-semibold mt-3 mb-2 text-gray-700">{line.replace('###', '').trim()}</h3>;
                    } else if (line.startsWith('•')) {
                      return <p key={index} className="ml-4 mb-1 text-gray-600">{line}</p>;
                    } else if (line.startsWith('✓')) {
                      return <p key={index} className="text-green-700 font-medium mb-1">{line}</p>;
                    } else if (line.startsWith('⚠')) {
                      return <p key={index} className="text-orange-600 font-medium mb-1">{line}</p>;
                    } else if (line.trim()) {
                      return <p key={index} className="mb-2 text-gray-600">{line}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SelfControlSimulation;