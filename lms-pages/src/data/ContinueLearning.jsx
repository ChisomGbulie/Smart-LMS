// src/components/ContinueLearning.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContinueLearning({ courseId }) {
  const navigate = useNavigate();
  const [lastModule, setLastModule] = useState(null);

  useEffect(() => {
    // Load last accessed module from localStorage
    const saved = localStorage.getItem(`course_${courseId}_last_module`);
    if (saved) {
      setLastModule(JSON.parse(saved));
    }
  }, [courseId]);

  const handleContinue = () => {
    if (lastModule) {
      navigate(`/course/${courseId}/module/${lastModule.moduleId}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  return (
    <button
      onClick={handleContinue}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Continue Learning
    </button>
  );
}