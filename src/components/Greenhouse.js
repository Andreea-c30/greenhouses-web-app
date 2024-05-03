import './Greenhouse.css'
import NoImage from '../imgs/no-image.jpg'
import TempIcon from '../imgs/temp-icon.png'
import HumidityIcon from '../imgs/humidity-icon.png'
import LightIcon from '../imgs/light-icon.png'
import WindIcon from '../imgs/wind-icon.png'
import DeleteIcon from '../imgs/delete-icon.png'
import EditIcon from '../imgs/edit-icon.png'


function Greenhouse(props) {
    return (
        <div className='greenhouse'>
            <div className='greenhouse-name'>
                <span className='greenhouse-name-text'>{props.greenhouse.name}</span>
            </div>
            <div className='greenhouse-location'>
                <span className='greenhouse-location-text'>{props.greenhouse.location}</span>
            </div>

            <div className='greenhouse-img'>
                {!props.greenhouse.img ? (<img src={NoImage}/>):(<img src={props.greenhouse.img} />)}
            </div>

            <button className='check-greenhouse-button'>
                Check greenhouse
            </button>
            <button className='delete-button edit-button' onClick={() => {props.onEdit(props.greenhouse)}}>
                <img src={EditIcon}/>
            </button>
            <button className='delete-button' onClick={() => {props.onDelete(props.greenhouse)}}>
                <img src={DeleteIcon} className='delete-icon'/>
            </button>

            <div className='greenhouse-parameters'>
                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={TempIcon} className='temp-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>{props.greenhouse.temperature}</span>
                        <span className='temp-symbol'>°C</span>
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={HumidityIcon} className='humidity-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>{props.greenhouse.humidity}</span>
                        <span className='temp-symbol'>%</span>
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={LightIcon} className='light-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>{props.greenhouse.light}</span>
                        <span className='temp-symbol'>%</span>
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={WindIcon} className='wind-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>{props.greenhouse.ventilation}</span>
                        <span className='temp-symbol'>%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Greenhouse;