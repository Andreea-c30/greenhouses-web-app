import { useState } from 'react';
import './SortGreenhouses.css'


function SortGreenhouses({ handleSort }) {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
      const selectedValue =  event.target.value;
      setSelectedOption(selectedValue);
      handleSort(selectedValue);
    };
    
    return (
        <>
            <select id="sortDropdown" value={selectedOption} onChange={handleOptionChange}>
                <span>Sort by: </span>
                <option value="">Sort by</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="location">Location</option>
            </select>
        </>
    )
}

export default SortGreenhouses;