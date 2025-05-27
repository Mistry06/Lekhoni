import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full mb-4'> {/* Added mb-4 for spacing */}
            {label && 
            <label 
                className='block text-white text-lg font-medium mb-2 pl-1' /* Adjusted label styling */
                htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
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
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input