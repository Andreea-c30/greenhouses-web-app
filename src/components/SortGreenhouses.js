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
                <option value="name">Sort by: Name</option>
                <option value="location">Sort by: Location</option>
                <option value="date">Sort by: Date</option>
            </select>
        </>
    )
}

export default SortGreenhouses;