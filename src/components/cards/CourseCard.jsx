import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  // 默认图片
  const defaultImage = '/images/course-placeholder.jpg';
  
  // 根据难度获取标签颜色
  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 获取难度标签文本
  const getLevelText = (level) => {
    switch (level) {
      case 'beginner':
        return '入门级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return level;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link to={`/courses/${course.id}`} className="block">
        <div className="h-48 overflow-hidden">
          <img
            src={course.image_url || defaultImage}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link 
            to={`/courses/${course.id}`}
            className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {course.title}
          </Link>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {getLevelText(course.level)}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {course.duration}
            </span>
          </div>
          
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors"
          >
            查看详情
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 