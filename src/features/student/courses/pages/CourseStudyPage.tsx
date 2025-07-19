import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/providers/AuthProvider';
import MainLayout from '../../../../pages/layout/MainLayout';

// 聊天消息接口
interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'student' | 'teacher';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

// 课程学习相关接口
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
  likes: number;
  isLiked: boolean;
}

interface Rating {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  timestamp: string;
  helpful: number;
  isHelpful: boolean;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
  description: string;
}

interface StudyData {
  courseId: string;
  courseTitle: string;
  currentLesson: Lesson;
  instructor: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  classmates: Array<{
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  }>;
  comments: Comment[];
  ratings: Rating[];
  courseRating: {
    average: number;
    total: number;
    distribution: { [key: number]: number };
  };
  chatMessages: ChatMessage[];
}

/**
 * CourseStudyPage - 课程学习主页面
 * 
 * 功能包括：
 * - 视频播放
 * - 师生互动
 * - 课程评价
 * - 评论系统
 */
const CourseStudyPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [studyData, setStudyData] = useState<StudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'ratings'>('comments');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [newRatingComment, setNewRatingComment] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // 聊天相关状态
  const [newChatMessage, setNewChatMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 模拟数据
  useEffect(() => {
    const loadStudyData = () => {
      const mockData: StudyData = {
        courseId: courseId || 'stm32-intro',
        courseTitle: 'STM32基础入门',
        currentLesson: {
          id: lessonId || 'lesson-1',
          title: 'STM32系列概述',
          duration: '15:30',
          videoUrl: '/videos/stm32-intro-lesson1.mp4',
          completed: false,
          description: '本节课将介绍STM32系列微控制器的基本概念、架构特点和应用领域。'
        },
        instructor: {
          name: '张教授',
          avatar: '👨‍🏫',
          isOnline: true
        },
        classmates: [
          { id: '1', name: '李小明', avatar: '👨‍🎓', isOnline: true },
          { id: '2', name: '王小红', avatar: '👩‍🎓', isOnline: true },
          { id: '3', name: '刘小强', avatar: '👨‍🎓', isOnline: false },
          { id: '4', name: '陈小美', avatar: '👩‍🎓', isOnline: true }
        ],
        comments: [
          {
            id: '1',
            userId: '1',
            userName: '李小明',
            userAvatar: '👨‍🎓',
            content: '这节课讲得很清楚，STM32的架构图很有帮助！',
            timestamp: '2024-01-20 14:30',
            likes: 5,
            isLiked: false,
            replies: [
              {
                id: '1-1',
                userId: 'teacher',
                userName: '张教授',
                userAvatar: '👨‍🏫',
                content: '谢谢！后面我们会深入讲解每个模块的具体功能。',
                timestamp: '2024-01-20 14:35',
                likes: 2,
                isLiked: false
              }
            ]
          },
          {
            id: '2',
            userId: '2',
            userName: '王小红',
            userAvatar: '👩‍🎓',
            content: '请问STM32F4和STM32H7系列的主要区别是什么？',
            timestamp: '2024-01-20 14:25',
            likes: 3,
            isLiked: true
          }
        ],
        ratings: [
          {
            id: '1',
            userId: '1',
            userName: '李小明',
            userAvatar: '👨‍🎓',
            rating: 5,
            comment: '课程内容很全面，老师讲解清晰，实例丰富。强烈推荐！',
            timestamp: '2024-01-20 15:00',
            helpful: 8,
            isHelpful: false
          },
          {
            id: '2',
            userId: '3',
            userName: '刘小强',
            userAvatar: '👨‍🎓',
            rating: 4,
            comment: '整体不错，但希望能增加更多实际项目案例。',
            timestamp: '2024-01-20 13:45',
            helpful: 5,
            isHelpful: true
          }
        ],
        courseRating: {
          average: 4.6,
          total: 156,
          distribution: { 5: 89, 4: 45, 3: 15, 2: 5, 1: 2 }
        },
        chatMessages: [
          {
            id: '1',
            userId: 'teacher',
            userName: '张教授',
            userAvatar: '👨‍🏫',
            userRole: 'teacher',
            content: '大家好！欢迎来到STM32基础入门课程，有任何问题随时提问。',
            timestamp: '2024-01-20 14:00',
            type: 'text'
          },
          {
            id: '2',
            userId: '1',
            userName: '李小明',
            userAvatar: '👨‍🎓',
            userRole: 'student',
            content: '老师好！很期待这门课程。',
            timestamp: '2024-01-20 14:02',
            type: 'text'
          },
          {
            id: '3',
            userId: '2',
            userName: '王小红',
            userAvatar: '👩‍🎓',
            userRole: 'student',
            content: '请问需要准备什么开发板吗？',
            timestamp: '2024-01-20 14:05',
            type: 'text'
          },
          {
            id: '4',
            userId: 'teacher',
            userName: '张教授',
            userAvatar: '👨‍🏫',
            userRole: 'teacher',
            content: '建议使用STM32F4系列的开发板，比如STM32F407或STM32F429。',
            timestamp: '2024-01-20 14:06',
            type: 'text'
          }
        ]
      };

      setStudyData(mockData);
      setLoading(false);
    };

    setTimeout(loadStudyData, 500);
  }, [courseId, lessonId]);

  // 模拟接收聊天消息
  useEffect(() => {
    if (!studyData) return;

    const simulateMessages = [
      {
        content: '这个概念很重要，大家要重点理解！',
        userName: '张教授',
        userRole: 'teacher' as const,
        delay: 10000
      },
      {
        content: '我觉得这个例子很好理解',
        userName: '刘小强',
        userRole: 'student' as const,
        delay: 15000
      },
      {
        content: '有同学对这部分有疑问吗？',
        userName: '张教授',
        userRole: 'teacher' as const,
        delay: 25000
      }
    ];

    const timeouts = simulateMessages.map((msg, index) => {
      return setTimeout(() => {
        if (studyData) {
          const newMessage: ChatMessage = {
            id: `sim-${Date.now()}-${index}`,
            userId: msg.userRole === 'teacher' ? 'teacher' : `student-${index}`,
            userName: msg.userName,
            userAvatar: msg.userRole === 'teacher' ? '👨‍🏫' : '👨‍🎓',
            userRole: msg.userRole,
            content: msg.content,
            timestamp: new Date().toLocaleString('zh-CN'),
            type: 'text'
          };

          setStudyData(prev => prev ? {
            ...prev,
            chatMessages: [...prev.chatMessages, newMessage]
          } : null);

          // 自动滚动到底部
          setTimeout(() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
          }, 100);
        }
      }, msg.delay);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [studyData?.courseId]);

  // 视频播放控制
  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  // 发送评论
  const handleSendComment = () => {
    if (!newComment.trim() || !studyData) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user?.id || 'current-user',
      userName: user?.displayName || user?.username || '我',
      userAvatar: '👤',
      content: newComment,
      timestamp: new Date().toLocaleString('zh-CN'),
      likes: 0,
      isLiked: false
    };

    setStudyData({
      ...studyData,
      comments: [comment, ...studyData.comments]
    });
    setNewComment('');
  };

  // 提交评分
  const handleSubmitRating = () => {
    if (newRating === 0 || !studyData) return;

    const rating: Rating = {
      id: Date.now().toString(),
      userId: user?.id || 'current-user',
      userName: user?.displayName || user?.username || '我',
      userAvatar: '👤',
      rating: newRating,
      comment: newRatingComment,
      timestamp: new Date().toLocaleString('zh-CN'),
      helpful: 0,
      isHelpful: false
    };

    setStudyData({
      ...studyData,
      ratings: [rating, ...studyData.ratings]
    });
    setNewRating(0);
    setNewRatingComment('');
  };

  // 点赞评论
  const handleLikeComment = (commentId: string) => {
    if (!studyData) return;

    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateComments(comment.replies)
          };
        }
        return comment;
      });
    };

    setStudyData({
      ...studyData,
      comments: updateComments(studyData.comments)
    });
  };

  // 发送聊天消息
  const handleSendChatMessage = () => {
    if (!newChatMessage.trim() || !studyData) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || 'current-user',
      userName: user?.displayName || user?.username || '我',
      userAvatar: '👤',
      userRole: 'student',
      content: newChatMessage,
      timestamp: new Date().toLocaleString('zh-CN'),
      type: 'text'
    };

    setStudyData({
      ...studyData,
      chatMessages: [...studyData.chatMessages, message]
    });
    setNewChatMessage('');

    // 滚动到底部
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };



  // 标记评价为有用
  const handleMarkHelpful = (ratingId: string) => {
    if (!studyData) return;

    const updatedRatings = studyData.ratings.map(rating => {
      if (rating.id === ratingId) {
        return {
          ...rating,
          helpful: rating.isHelpful ? rating.helpful - 1 : rating.helpful + 1,
          isHelpful: !rating.isHelpful
        };
      }
      return rating;
    });

    setStudyData({
      ...studyData,
      ratings: updatedRatings
    });
  };

  // 回复评论
  const handleReplyComment = (commentId: string, replyContent: string) => {
    if (!replyContent.trim() || !studyData) return;

    const reply: Comment = {
      id: Date.now().toString(),
      userId: user?.id || 'current-user',
      userName: user?.displayName || user?.username || '我',
      userAvatar: '👤',
      content: replyContent,
      timestamp: new Date().toLocaleString('zh-CN'),
      likes: 0,
      isLiked: false
    };

    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateComments(comment.replies)
          };
        }
        return comment;
      });
    };

    setStudyData({
      ...studyData,
      comments: updateComments(studyData.comments)
    });
  };

  // 向讲师提问
  const handleAskTeacher = () => {
    const question = prompt('请输入您要向讲师提问的问题：');
    if (question && question.trim() && studyData) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: user?.id || 'current-user',
        userName: user?.displayName || user?.username || '我',
        userAvatar: '👤',
        userRole: 'student',
        content: `@张教授 ${question}`,
        timestamp: new Date().toLocaleString('zh-CN'),
        type: 'text'
      };

      setStudyData({
        ...studyData,
        chatMessages: [...studyData.chatMessages, message]
      });

      // 滚动到底部
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // 渲染星级评分
  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <svg
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载课程内容中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!studyData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600 mb-4">课程内容加载失败</p>
            <button
              onClick={() => navigate('/student/courses')}
              className="btn btn-primary"
            >
              返回课程列表
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* 课程标题栏 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <button
              onClick={() => navigate('/student/courses')}
              className="hover:text-blue-600 transition-colors"
            >
              课程列表
            </button>
            <span>›</span>
            <button
              onClick={() => navigate(`/student/courses/${courseId}`)}
              className="hover:text-blue-600 transition-colors"
            >
              {studyData.courseTitle}
            </button>
            <span>›</span>
            <span className="text-gray-900">{studyData.currentLesson.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{studyData.currentLesson.title}</h1>
          <p className="text-gray-600 mt-1">{studyData.currentLesson.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 视频播放器 */}
            <div className="card p-0 overflow-hidden">
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  controls
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  poster="/images/video-poster.jpg"
                >
                  <source src={studyData.currentLesson.videoUrl} type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
                
                {/* 视频信息覆盖层 */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{studyData.currentLesson.title}</h3>
                      <p className="text-sm opacity-90">时长: {studyData.currentLesson.duration}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isVideoPlaying && (
                        <span className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                          正在播放
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 互动和评论区域 */}
            <div className="card">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'comments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    讨论区 ({studyData.comments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('ratings')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'ratings'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    课程评价 ({studyData.ratings.length})
                  </button>
                </nav>
              </div>

              <div className="pt-6">
                {activeTab === 'comments' && (
                  <div className="space-y-6">
                    {/* 发表评论 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="参与讨论，分享你的想法..."
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={handleSendComment}
                              disabled={!newComment.trim()}
                              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              发表评论
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 评论列表 */}
                    <div className="space-y-4">
                      {studyData.comments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="flex space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm">{comment.userAvatar}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">{comment.userName}</span>
                                <span className="text-sm text-gray-500">{comment.timestamp}</span>
                              </div>
                              <p className="text-gray-700 mb-2">{comment.content}</p>
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => handleLikeComment(comment.id)}
                                  className={`flex items-center space-x-1 text-sm ${
                                    comment.isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                  </svg>
                                  <span>{comment.likes}</span>
                                </button>
                                <button className="text-sm text-gray-500 hover:text-blue-600">
                                  回复
                                </button>
                              </div>

                              {/* 回复 */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-3 ml-4 space-y-3">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex space-x-3">
                                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs">{reply.userAvatar}</span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-medium text-gray-900 text-sm">{reply.userName}</span>
                                          <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{reply.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'ratings' && (
                  <div className="space-y-6">
                    {/* 课程评分概览 */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900 mb-2">
                            {studyData.courseRating.average}
                          </div>
                          <div className="flex justify-center mb-2">
                            {renderStars(studyData.courseRating.average)}
                          </div>
                          <p className="text-gray-600">基于 {studyData.courseRating.total} 个评价</p>
                        </div>
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600 w-8">{star}星</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{
                                    width: `${(studyData.courseRating.distribution[star] / studyData.courseRating.total) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {studyData.courseRating.distribution[star]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 发表评价 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">为这门课程评分</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            您的评分
                          </label>
                          {renderStars(newRating, true, setNewRating)}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            评价内容（可选）
                          </label>
                          <textarea
                            value={newRatingComment}
                            onChange={(e) => setNewRatingComment(e.target.value)}
                            placeholder="分享您对这门课程的看法..."
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={handleSubmitRating}
                            disabled={newRating === 0}
                            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            提交评价
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 评价列表 */}
                    <div className="space-y-4">
                      {studyData.ratings.map((rating) => (
                        <div key={rating.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="flex space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm">{rating.userAvatar}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">{rating.userName}</span>
                                <div className="flex items-center space-x-1">
                                  {renderStars(rating.rating)}
                                </div>
                                <span className="text-sm text-gray-500">{rating.timestamp}</span>
                              </div>
                              {rating.comment && (
                                <p className="text-gray-700 mb-2">{rating.comment}</p>
                              )}
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => handleMarkHelpful(rating.id)}
                                  className={`flex items-center space-x-1 text-sm transition-colors ${
                                    rating.isHelpful ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.60L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                  <span>有用 ({rating.helpful})</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 互动聊天区域 */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-fit max-h-screen sticky top-4">
            {/* 聊天头部 - 集成讲师和在线信息 */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">课堂互动</h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {studyData.classmates.filter(c => c.isOnline).length + 1} 人在线
                </span>
              </div>

              {/* 讲师信息 */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">{studyData.instructor.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{studyData.instructor.name}</h4>
                    {studyData.instructor.isOnline && (
                      <span className="flex items-center text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                        在线
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-blue-100">课程讲师</p>
                </div>
                <button
                  onClick={handleAskTeacher}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-xs transition-colors"
                >
                  提问
                </button>
              </div>

              {/* 学习进度 */}
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex justify-between text-xs mb-2">
                  <span>学习进度</span>
                  <span>1/12 课时</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '8%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-blue-100">
                  <span>已完成 8%</span>
                  <span>还需 1.5小时</span>
                </div>
              </div>
            </div>

            {/* 在线用户列表 */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2 overflow-x-auto">
                <span className="text-xs text-gray-600 whitespace-nowrap">在线:</span>
                {/* 讲师头像 */}
                <div className="relative">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">{studyData.instructor.avatar}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                </div>
                {/* 在线同学头像 */}
                {studyData.classmates.filter(c => c.isOnline).map((classmate) => (
                  <div key={classmate.id} className="relative">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">{classmate.avatar}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                  </div>
                ))}
                {/* 当前用户 */}
                <div className="relative">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">👤</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                </div>
              </div>
            </div>

            {/* 聊天消息区域 */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-white"
              style={{ height: '400px', maxHeight: '400px' }}
            >
              {studyData.chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex space-x-2 ${
                    message.userId === (user?.id || 'current-user') ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.userId !== (user?.id || 'current-user') && (
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">{message.userAvatar}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.userId === (user?.id || 'current-user')
                        ? 'bg-blue-600 text-white'
                        : message.userRole === 'teacher'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-gray-50 text-gray-800 border border-gray-200'
                    }`}
                  >
                    {message.userId !== (user?.id || 'current-user') && (
                      <div className={`text-xs mb-1 font-medium ${
                        message.userRole === 'teacher' ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {message.userName}
                        {message.userRole === 'teacher' && ' 👨‍🏫'}
                      </div>
                    )}
                    <div className="text-sm leading-relaxed">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.userId === (user?.id || 'current-user') ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {message.timestamp.split(' ')[1]}
                    </div>
                  </div>
                  {message.userId === (user?.id || 'current-user') && (
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">👤</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 聊天输入区域 */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="输入消息，与师生互动..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!newChatMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              {/* 快捷操作 */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-2">
                  <button
                    onClick={handleAskTeacher}
                    className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                  >
                    @讲师
                  </button>
                  <button className="text-xs text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors">
                    📎 文件
                  </button>
                </div>
                <button className="w-full ml-3 btn btn-primary text-xs py-1">
                  下一课时
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </MainLayout>
  );
};

export default CourseStudyPage;
