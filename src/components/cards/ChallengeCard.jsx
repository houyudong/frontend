import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaRobot, FaCode } from 'react-icons/fa';
import { AIAssistantContainer as AiAssistant } from '../AIAssistant';

function ChallengeCard({ challenge, index }) {
  const [expanded, setExpanded] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleOpenAssistant = () => {
    setShowAssistant(true);
    if (!expanded) setExpanded(true);
  };

  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden bg-blue-50 mb-4 transition-shadow hover:shadow-md">
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={toggleExpanded}
      >
        <div>
          <h3 className="font-semibold text-lg">挑战 {index + 1}:</h3>
          <p className="text-gray-700">{challenge}</p>
        </div>
        <div className="flex items-center">
          {!showAssistant && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAssistant();
              }}
              className="mr-3 bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 flex items-center"
            >
              <FaRobot className="mr-1" /> AI助手
            </button>
          )}
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 pt-0 border-t border-blue-200">
          {showAssistant ? (
            <div className="mt-4">
              <AiAssistant
                type="challenge"
                context={challenge}
                challengeData={{
                  title: `挑战 ${index + 1}`,
                  description: challenge
                }}
              />
            </div>
          ) : (
            <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-semibold mb-2 flex items-center">
                <FaCode className="mr-2 text-primary-600" />
                完成挑战
              </h4>
              <p className="mb-3 text-gray-600">
                有两种方式完成这个挑战：
              </p>
              <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-600">
                <li>使用AI助手：通过自然语言描述您的需求，AI将帮您生成代码</li>
                <li>自行编写代码：根据挑战描述，在CubeIDE中编写代码并测试</li>
              </ol>
              <button
                onClick={handleOpenAssistant}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center justify-center w-full"
              >
                <FaRobot className="mr-2" /> 使用AI助手解决挑战
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChallengeCard;