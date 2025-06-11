import { useState } from 'react';

const ModuleAccordion = ({ module, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center mr-3">
            {index + 1}
          </div>
          <h3 className="text-lg font-medium text-left text-gray-900">{module.title}</h3>
        </div>
        <svg
          className={`h-6 w-6 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-gray-600 mb-4">{module.description}</p>
          
          {module.lessons && module.lessons.length > 0 ? (
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">课程内容</h4>
              <ul className="space-y-3">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 mt-0.5 text-primary-600">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between text-sm">
                        <p className="font-medium text-gray-900">{lesson.title}</p>
                        <p className="text-gray-500">{lesson.duration}</p>
                      </div>
                      {lesson.content && <p className="mt-1 text-sm text-gray-600">{lesson.content}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic">暂无课程内容</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleAccordion; 