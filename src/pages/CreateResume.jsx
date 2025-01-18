import React from 'react';
import {Routes,Route} from "react-router-dom";
import { templateData } from '../utils/helpers';

function CreateResume() {
  return (
    <div className='w-full flex flex-col items-center justify-start py-4'>
      <Routes>
        {templateData.map((template)=>(
          <Route 
          key={template.id}
          path={`/${template.name}`}
          Component={template.component}></Route>
        ))}
      </Routes>
    </div>
  )
}

export default CreateResume