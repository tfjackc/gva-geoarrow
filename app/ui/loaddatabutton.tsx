// LoadDataButton.tsx
import React from 'react';

// If you have a type for the onButtonClick, you can define it like this:
// type Props = {
//   onButtonClick: () => void;
// };

// Or if you're using an interface:
interface LoadDataButtonProps {
    onButtonClick: () => void; // specify the type of your onClick function
}

// Correctly typed functional component with arrow function syntax
const LoadDataButton: React.FC<LoadDataButtonProps> = ({ onButtonClick }) => {
    return (
        <main>
            <button
                className="z-10 text-3xl text-white bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-300"
                onClick={onButtonClick}
            >
                Fire Arrows
            </button>
        </main>
    );
};

export default LoadDataButton;
