import './App.css'
import { useState } from 'react'
import { CircleDollarSign, MapPin, User } from "lucide-react";

const header = {
    "Cache-Control": "no-cache",
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": "*",
};

function App() {
  let [jobs, setJobs] = useState([]);
  let [message, setMessage] = useState("");

  const handleClick = async () => {
    await fetch("http://localhost:80/api/jobs", { headers: header })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          setMessage("Error fetching data");
        }
      }
      )
      .then(data => {
      setJobs(data);
    })
    .catch(error => {
      console.error(error);
    });
  }

  return (
    <>
      <div className="card">
        <button onClick={handleClick}>
          Fetch API
        </button>
      </div>
      <div className="px-8 py-8 grid grid-cols-5 gap-5">
        {
          message !== "" ? <div className='text-base text-gray-500 flex space-x-1'>{message}</div> : (
          <div className="col-span-2">
            <ul>
                {jobs.map(job => (
                    <li
                        key={job.id}
                        className="block max-w-none p-6 mb-6 bg-white rounded-lg flex-col space-y-1">
                        <p className="text-sm text-gray-500">Posted on {job.posted_day}</p>
                        
                        <a href={`/job-detail?id=${job.id}`}>
                            <h2 className="text-xl font-bold">{job.title}</h2>
                        </a>
                        <p className="text-base">{job.company?.name}</p>

                        <p className="text-base text-green-600 flex space-x-1">
                            <CircleDollarSign />
                            <div>{job.salary}</div>
                        </p>
                        <hr />
                        <p className="flex space-x-1">
                            <User />
                            <div className="text-sm">{job.working_model}</div>
                        </p>
                        <p className="flex space-x-1">
                            <MapPin />
                            <div className="text-sm">{job.location}</div>
                        </p>
                        <div className="flex space-x-1">
                            {job.skills.map(skill => (
                                <span key={skill} className="text-xs p-1 border rounded-full">{skill}</span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        )}   
      </div>
    </>
  )
}

export default App
