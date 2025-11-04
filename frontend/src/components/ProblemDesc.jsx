import React, { useContext, useEffect, useState } from 'react';
import { CodeExecutionContext } from '../Context';
import topics from '../assets/tags.svg';
import UserSubmission from './UserSubmission';
import { fetchJsonWithFallback } from '../utils/apiClient';
const ProblemDesc = () => {
  const [desc, setDesc] = useState(true);
  const [sub, setSub] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const {data,setData,setprobId,probId,setCurrentProblem,currentProblem}=useContext(CodeExecutionContext);
  const fetchData = async () => {
    try {
      const result = await fetchJsonWithFallback('/api/problems/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }, { fallbackOnEmpty: true });

      if (Array.isArray(result) && result.length > 0) {
        setCurrentProblem(result[0]);
        setprobId(result[0]._id);
        setData(result);
      } else {
        setCurrentProblem(null);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchData1 = async (probId) => {
    if (!probId) return;
    setLoading(true);
    try {
      const result = await fetchJsonWithFallback(`/api/problems/${probId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      setCurrentProblem(result || null);
    } catch (error) {
      console.error('Error fetching problem by id:', error);
      setCurrentProblem(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    initializeData();
  }, []);
  
useEffect(()=>{
  // console.log("problem id changed",probId);
  // fetchData()
  fetchData1(probId);
},[probId])
  const handleClick = (num) => {
   switch(num){
    case 1:
     setDesc(true);
     setSub(false);
     break;
    case 2:
      setDesc(false);
      setSub(true);
      break; 
    default:
        break;    
   }
  };

  const getCategoryColor = (category) => {
    const cat = typeof category === 'string' ? category.toLowerCase() : '';
    switch (cat) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-700';
      default:
        return '';
    }
  };
  return (
    <>
      <nav className='flex gap-4'>
        <button onClick={()=>handleClick(1)} >DESCRIPTION</button>
        <button onClick={()=>handleClick(2)}>SUBMISSIONS</button>
      </nav>
      {desc && !sub ? (
        <div className="p-3 max-h-screen">
          <div className="text-left flex flex-col">
            {loading ? (
              <p>Loading problems...</p>
            ) : !currentProblem ? (
              <p>No problems available. Try seeding the database or switch to the cloud API.</p>
            ) : (
              <div className='flex flex-col'>
                <span className="text-2xl font-semibold">
                {currentProblem?.problem_name || ''}
                </span>
                <span
                  className={`rounded-xl bg-[#f0f0f0] w-[85px] p-2 text-center mt-5 ${getCategoryColor(
                    currentProblem?.category
                  )} text-xl w-[140px] ` }
                >
                  {currentProblem?.category || 'Unknown'}
                </span>
                <div className='max-w-screen mt-4'>
                  <div dangerouslySetInnerHTML={{ __html: currentProblem?.problem_desc || '' }} />
                </div>
                <div className='example'>
                  <div dangerouslySetInnerHTML={{ __html: currentProblem?.problem_examples || '' }} />
                </div>
                <div className='constraints mt-5'>
                  <span className='font-bold'> Constraints:</span>
                  <ol>
                    <li dangerouslySetInnerHTML={{ __html: currentProblem?.constraints || '' }} />
                  </ol>
                </div>
                <div className='flex gap-2'>
                <img src={topics} alt="" width={20} height={20} className='mt-5' />
                <span className='font-bold mt-5'> Topics:</span>
                </div> 
                <div dangerouslySetInnerHTML={{ __html: currentProblem?.tags || '' } }/>
                <span className='font-bold mt-5'> Hints:</span>
                {/* {console.log(currentProblem.hints)} */}
                <div dangerouslySetInnerHTML={{ __html: Array.isArray(currentProblem?.hints) && currentProblem.hints.length !== 0 ? currentProblem.hints : "No hints" } }/>
                {/* <div dangerouslySetInnerHTML={{ __html: currentProblem.hints }}} /> */}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <UserSubmission/>
        </div>
      )}
     
    </>
  );
};

export default ProblemDesc;
