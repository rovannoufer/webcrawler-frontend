import React from 'react'
import loading from "../src/img/icons.gif"

function Loading() {
  return (
    <div className=' flex justify-center p-5'>
        <img src={loading} alt='Loading' className='w-24'  />
    </div>
  )
}

export default Loading