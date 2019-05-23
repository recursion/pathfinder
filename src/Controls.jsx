import React from 'react';

const Controls = ({ reset, start }) => {
    return (

        <div className="border rounded p-5 flex flex-col justify-around items-start ml-5">
            <button
                className="btn btn-blue"
                onClick={start}
            >
                Find Path
          </button>
            <button
                className="btn btn-blue mt-3"
                onClick={reset}
            >
                Reset
          </button>
        </div>
    );
}

export default Controls;