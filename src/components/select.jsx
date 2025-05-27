import React, {useId} from 'react'

function Select({
    options,
    label,
    className = "", // Default empty string for className
    ...props
}, ref) {
    const id = useId()
    return (
        <div className='w-full'>
            {/* Label styling: white text, font-medium, mb-2 for spacing */}
            {label && (
                <label htmlFor={id} className='block text-white text-lg font-medium mb-2'>
                    {label}
                </label>
            )}
            {/* Select field styling */}
            <select
                {...props}
                id={id}
                ref={ref}
                // Combined Tailwind classes for dark theme
                className={`
                    px-4 py-3 rounded-lg 
                    bg-gray-800 text-white 
                    border border-gray-700 
                    outline-none 
                    focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 
                    transition-all duration-300 ease-in-out 
                    shadow-md hover:border-red-500
                    w-full 
                    ${className}
                `}
            >
                {options?.map((option) => (
                    // Option styling might be limited by browser, but we can set default colors
                    <option 
                        key={option} 
                        value={option}
                        className="bg-gray-800 text-white" // Helps for some browsers/OS
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default React.forwardRef(Select)